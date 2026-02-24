import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import { DEFAULT_SAVE_FOLDER, PACK_CATALOG } from "./types";
import type MuseWeaverPlotPlugin from "./main";
import { FLAVORS } from "./data";
import { t, lang } from "./i18n";

export class MuseWeaverPlotSettingTab extends PluginSettingTab {
	plugin: MuseWeaverPlotPlugin;

	constructor(app: App, plugin: MuseWeaverPlotPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// Auto-reload packs when settings tab opens
		this.plugin.reloadPacks().then(() => this.renderContents(containerEl));
	}

	private renderContents(containerEl: HTMLElement): void {
		containerEl.empty();

		// Header
		containerEl.createEl("h2", { text: t.pluginTitle });
		containerEl.createEl("p", {
			text: t.pluginSubtitle,
			cls: "setting-item-description",
		});

		// Save folder
		new Setting(containerEl)
			.setName(t.settingSaveFolder)
			.setDesc(t.settingSaveFolderDesc)
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_SAVE_FOLDER)
					.setValue(this.plugin.settings.saveFolder)
					.onChange(async (value) => {
						this.plugin.settings.saveFolder = value.trim() || DEFAULT_SAVE_FOLDER;
						await this.plugin.saveSettings();
					})
			);

		// ---- Packs section ----
		containerEl.createEl("h3", { text: `\u263d ${t.settingGenrePacks}` });

		// Built-in (always unlocked)
		const builtinFlavors = FLAVORS.filter((f) => !f.pack);
		new Setting(containerEl)
			.setName(`\u2705 ${t.settingBasePack}`)
			.setDesc(builtinFlavors.map((f) => f.name).join(" / "));

		// Catalog-driven pack display
		const loadedIds = new Set(this.plugin.loadedPacks.map((p) => p.id));
		const currentLang = lang;

		for (const entry of PACK_CATALOG) {
			const isLoaded = loadedIds.has(entry.id);
			const desc = entry.desc[currentLang] || entry.desc.ja;
			const displayName = entry.displayName[currentLang] || entry.displayName.ja;

			if (isLoaded) {
				// Show installed pack with flavor names from FLAVORS
				const loadedPack = this.plugin.loadedPacks.find((p) => p.id === entry.id);
				const packFlavors = FLAVORS.filter((f) => f.pack === entry.id);
				const flavorDesc = packFlavors.length > 0
					? packFlavors.map((f) => f.name).join(" / ")
					: desc;
				const versionSuffix = loadedPack ? ` (v${loadedPack.version})` : "";
				new Setting(containerEl)
					.setName(`\u2705 ${displayName}${versionSuffix}`)
					.setDesc(flavorDesc);
			} else {
				// Show locked pack with Booth link
				const setting = new Setting(containerEl)
					.setName(`\ud83d\udd12 ${displayName}`)
					.setDesc(desc);
				setting.addButton((btn) =>
					btn
						.setButtonText(t.settingBooth)
						.setCta()
						.onClick(() => {
							window.open(entry.boothUrl, "_blank");
						})
				);
			}
		}

		// Pack install guide
		containerEl.createEl("h3", { text: t.settingPackInstall });
		containerEl.createEl("p", {
			text: t.settingPackInstallDesc,
			cls: "setting-item-description",
		});

		new Setting(containerEl)
			.setName(t.settingOpenFolder)
			.setDesc(".obsidian/plugins/muse-weaver-plot/packs/")
			.addButton((btn) =>
				btn
					.setButtonText(t.settingOpenFolder)
					.onClick(async () => {
						const adapter = this.app.vault.adapter as any;
						if (!adapter.getBasePath) {
							new Notice("Could not open folder");
							return;
						}
						const basePath = adapter.getBasePath();
						const packsRel = ".obsidian/plugins/muse-weaver-plot/packs";
						const packsAbs = `${basePath}/${packsRel}`;

						// Create packs folder if it doesn't exist
						try {
							if (!(await adapter.exists(packsRel))) {
								await adapter.mkdir(packsRel);
							}
						} catch {
							// If mkdir fails, we'll try to open the parent instead
						}

						// Determine which path to open (packs if exists, plugin root otherwise)
						const targetPath = (await adapter.exists(packsRel))
							? packsAbs
							: `${basePath}/.obsidian/plugins/muse-weaver-plot`;

						const { shell } = (window as any).require("electron").remote
							|| (window as any).require("@electron/remote")
							|| {};
						if (shell?.openPath) {
							shell.openPath(targetPath);
						} else {
							try {
								(window as any).require("child_process")
									?.exec(`explorer "${targetPath.replace(/\//g, "\\")}"`)
								;
							} catch {
								new Notice("Could not open folder");
							}
						}
					})
			);

		new Setting(containerEl)
			.setName(t.settingReload)
			.setDesc(t.settingPackInstallDesc)
			.addButton((btn) =>
				btn
					.setButtonText(t.settingReload)
					.onClick(async () => {
						await this.plugin.reloadPacks();
						new Notice(t.settingReloaded);
						this.renderContents(this.containerEl);
					})
			);
	}
}
