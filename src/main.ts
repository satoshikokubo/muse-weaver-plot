import { Plugin, WorkspaceLeaf } from "obsidian";
import {
	VIEW_TYPE_MUSE_WEAVER_PLOT,
	DEFAULT_SETTINGS,
	type PluginData,
	type PluginSettings,
	type LoadedPack,
} from "./types";
import { MuseWeaverPlotView } from "./view";
import { MuseWeaverPlotSettingTab } from "./settings";
import { loadPacks } from "./pack-loader";

export default class MuseWeaverPlotPlugin extends Plugin {
	cachedData: PluginData | null = null;
	settings: PluginSettings = DEFAULT_SETTINGS;
	loadedPacks: LoadedPack[] = [];

	async onload(): Promise<void> {
		this.cachedData = (await this.loadData()) as PluginData | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, this.cachedData?.settings);

		// Load external packs (unlocks flavors, merges overrides)
		this.loadedPacks = await loadPacks(this.app);

		this.registerView(
			VIEW_TYPE_MUSE_WEAVER_PLOT,
			(leaf) => new MuseWeaverPlotView(leaf, this),
		);

		this.addRibbonIcon("moon", "Muse Weaver Plot", () => this.activateView());

		this.addCommand({
			id: "open-muse-weaver-plot",
			name: "Open Muse Weaver Plot",
			callback: () => this.activateView(),
		});

		this.addSettingTab(new MuseWeaverPlotSettingTab(this.app, this));
	}

	async saveSettings(): Promise<void> {
		const data: PluginData = {
			...(this.cachedData || {}),
			settings: this.settings,
		};
		await this.saveData(data);
		this.cachedData = data;
	}

	async reloadPacks(): Promise<void> {
		this.loadedPacks = await loadPacks(this.app);
	}

	async activateView(): Promise<void> {
		const { workspace } = this.app;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_MUSE_WEAVER_PLOT);

		let leaf: WorkspaceLeaf | null;
		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			if (leaf) await leaf.setViewState({ type: VIEW_TYPE_MUSE_WEAVER_PLOT, active: true });
		}
		if (leaf) workspace.revealLeaf(leaf);
	}
}
