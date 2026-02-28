import { App, FileSystemAdapter, Notice, Platform, PluginSettingTab, Setting } from "obsidian";
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
		void this.plugin.reloadPacks().then(() => this.renderContents(containerEl));
	}

	private renderContents(containerEl: HTMLElement): void {
		containerEl.empty();

		// Header
		new Setting(containerEl).setName(t.pluginTitle).setHeading();
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
		new Setting(containerEl).setName(`\u263d ${t.settingGenrePacks}`).setHeading();

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
		new Setting(containerEl).setName(t.settingPackInstall).setHeading();
		containerEl.createEl("p", {
			text: t.settingPackInstallDesc,
			cls: "setting-item-description",
		});

		new Setting(containerEl)
			.setName(t.settingOpenFolder)
			.setDesc(t.settingOpenFolderDesc)
			.addButton((btn) =>
				btn
					.setButtonText(t.settingOpenFolder)
					.onClick(() => {
						void this.openPacksFolder();
					})
			);

		new Setting(containerEl)
			.setName(t.settingReload)
			.setDesc("")
			.addButton((btn) =>
				btn
					.setButtonText(t.settingReload)
					.onClick(() => {
						void this.plugin.reloadPacks().then(() => {
							new Notice(t.settingReloaded);
							this.renderContents(this.containerEl);
						});
					})
			);
	}

	/** Open the packs folder in the system file manager. */
	private async openPacksFolder(): Promise<void> {
		const adapter = this.app.vault.adapter;
		if (!(adapter instanceof FileSystemAdapter)) {
			new Notice("Could not open folder");
			return;
		}
		const basePath = adapter.getBasePath();
		const packsRel = "MuseWeaver/PluginSettings/MWPlot";
		const targetPath = `${basePath}/${packsRel}`;

		// Create packs folder if it doesn't exist
		try {
			if (!(await adapter.exists(packsRel))) {
				await adapter.mkdir(packsRel);
			}
		} catch {
			// ignore
		}

		// Open folder using Electron or Platform API
		if (Platform.isDesktopApp) {
			try {
				// eslint-disable-next-line @typescript-eslint/no-require-imports
				const electron = require("electron") as { shell?: { openPath?: (path: string) => Promise<string> } };
				if (electron.shell?.openPath) {
					void electron.shell.openPath(targetPath);
				}
			} catch {
				new Notice("Could not open folder");
			}
		} else {
			new Notice("Folder opening is only available on desktop");
		}
	}
}
