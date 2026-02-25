import { moment } from "obsidian";

export interface I18nStrings {
	pluginTitle: string;
	pluginSubtitle: string;
	brandHeading: string;
	brandSubtitle: string;
	brandMessage: string;
	weaveStory: string;
	resumePrompt: string;
	resumeYes: string;
	resumeNo: string;
	recentPlots: string;
	plotNameLabel: string;
	plotNamePlaceholder: string;
	saveNameLabel: string;
	overwriteConfirm: (name: string) => string;
	overwriteYes: string;
	overwriteNo: string;
	flavorLabel: string;
	start: string;
	next: string;
	done: string;
	back: string;
	backToFlavor: string;
	showExample: string;
	freeWrite: string;
	saveMd: string;
	openFile: string;
	close: string;
	completeTitle: string;
	completeSubtitle: string;
	noInput: string;
	savedNotice: string;
	charLabel: string;
	untitled: string;
	inputPlaceholder: string;
	updateBtn: string;
	cancelBtn: string;
	museName: (icon: string, name: string) => string;
	unsavedWarning: string;
	unsavedYes: string;
	unsavedNo: string;
	abortBtn: string;
	museWatching: (name: string) => string;
	museThinking: (name: string) => string;
	hintRetry: string;
	diagTitle: (name: string) => string;
	diagLoading: (name: string) => string;
	diagError: string;
	diagSynopsis: string;
	diagWeakness: string;
	diagSuggestion: string;
	diagRetry: string;
	settingSaveFolder: string;
	settingSaveFolderDesc: string;
	settingGenrePacks: string;
	settingBasePack: string;
	settingPackA: string;
	settingPackB: string;
	settingBooth: string;
	settingPackInstall: string;
	settingPackInstallDesc: string;
	settingOpenFolder: string;
	settingOpenFolderDesc: string;
	settingReload: string;
	settingReloaded: string;
	reweaveStory: string;
	reweaveDesc: string;
	reweaveSelect: string;
	reweaveLoaded: string;
	reweaveNotPlot: string;
	reweavePartial: (n: number) => string;
	reweaveNoFiles: string;
}

const ja: I18nStrings = {
	pluginTitle: "\u263d Muse Weaver Plot",
	pluginSubtitle: "MPC-10 \u2014 10\u306e\u554f\u3044\u3067\u7269\u8a9e\u306e\u9aa8\u683c\u3092\u4f5c\u308b",
	brandHeading: "Muse Weaver Plot",
	brandSubtitle: "MPC-10 \u2014 10\u306e\u554f\u3044\u3067\u7269\u8a9e\u306e\u9aa8\u683c\u3092\u4f5c\u308b",
	brandMessage: "\u3042\u306a\u305f\u306e\u7269\u8a9e\u3092\u805e\u304b\u305b\u3066\u304f\u3060\u3055\u3044\u3002",
	weaveStory: "\u263d \u7269\u8a9e\u3092\u7d21\u3050",
	reweaveStory: "\ud83d\udcd6 \u7269\u8a9e\u3092\u7de8\u307f\u76f4\u3059",
	reweaveDesc: "\u4fdd\u5b58\u6e08\u307f\u30d7\u30ed\u30c3\u30c8\u3092\u8aad\u307f\u8fbc\u3093\u3067\u518d\u7de8\u96c6",
	reweaveSelect: "\ud83d\udcd6 \u7de8\u307f\u76f4\u3059\u30d7\u30ed\u30c3\u30c8\u3092\u9078\u3093\u3067\u304f\u3060\u3055\u3044",
	reweaveLoaded: "\u30d7\u30ed\u30c3\u30c8\u3092\u8aad\u307f\u8fbc\u307f\u307e\u3057\u305f",
	reweaveNotPlot: "\u3053\u306e\u30d5\u30a1\u30a4\u30eb\u306f\u30d7\u30ed\u30c3\u30c8\u5f62\u5f0f\u3067\u306f\u3042\u308a\u307e\u305b\u3093",
	reweavePartial: (n: number) => `${n}/10\u9805\u76ee\u3092\u8aad\u307f\u8fbc\u307f\u307e\u3057\u305f`,
	reweaveNoFiles: "\u4fdd\u5b58\u6e08\u307f\u30d7\u30ed\u30c3\u30c8\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093",
	resumePrompt: "\u524d\u56de\u306e\u7d9a\u304d\u304c\u3042\u308a\u307e\u3059\u3002\u518d\u958b\u3057\u307e\u3059\u304b\uff1f",
	resumeYes: "\u518d\u958b\u3059\u308b",
	resumeNo: "\u65b0\u3057\u304f\u59cb\u3081\u308b",
	recentPlots: "\u4fdd\u5b58\u6e08\u307f\u30d7\u30ed\u30c3\u30c8",
	plotNameLabel: "\u30d7\u30ed\u30c3\u30c8\u540d\uff08\u4efb\u610f\uff09",
	plotNamePlaceholder: "\u7121\u984c\u306e\u30d7\u30ed\u30c3\u30c8",
	saveNameLabel: "\u30d7\u30ed\u30c3\u30c8\u540d\u3092\u6c7a\u3081\u3066\u4fdd\u5b58",
	overwriteConfirm: (name: string) => `\u300c${name}\u300d\u306f\u65e2\u306b\u5b58\u5728\u3057\u307e\u3059\u3002`,
	overwriteYes: "\u4e0a\u66f8\u304d\u4fdd\u5b58",
	overwriteNo: "\u5225\u540d\u3067\u4fdd\u5b58",
	flavorLabel: "\u30b8\u30e3\u30f3\u30eb\u3092\u9078\u3076",
	start: "\u306f\u3058\u3081\u308b \u203a",
	next: "\u6b21\u3078 \u203a",
	done: "\u5b8c\u4e86 \u2714",
	back: "\u2039",
	backToFlavor: "\u2039\u30b8\u30e3\u30f3\u30eb",
	showExample: "\ud83d\udca1 \u4f8b\u3092\u898b\u308b",
	freeWrite: "\ud83d\udcdd \u81ea\u7531\u306b\u66f8\u304f",
	saveMd: "\ud83d\udcc4 MD\u306b\u4fdd\u5b58",
	openFile: "\ud83d\udcc2 \u30d5\u30a1\u30a4\u30eb\u3092\u958b\u304f",
	close: "\u9589\u3058\u308b",
	completeTitle: "\u307e\u305f\u4e00\u3064\u3001\u7269\u8a9e\u306e\u7a2e\u304c\u82bd\u5439\u304d\u307e\u3057\u305f",
	completeSubtitle: "\u3053\u306e\u7269\u8a9e\u304c\u3069\u3093\u306a\u82b1\u3092\u54b2\u304b\u305b\u308b\u306e\u304b\u2026\u2026\u697d\u3057\u307f\u3067\u3059\u3002",
	noInput: "\uff08\u672a\u5165\u529b\uff09",
	savedNotice: "\u263d \u4fdd\u5b58\u3057\u307e\u3057\u305f: ",
	charLabel: "\u5b57",
	untitled: "\u7121\u984c\u306e\u30d7\u30ed\u30c3\u30c8",
	inputPlaceholder: "\u3053\u3053\u306b\u5165\u529b\u2026",
	updateBtn: "\u66f4\u65b0",
	cancelBtn: "\u30ad\u30e3\u30f3\u30bb\u30eb",
	museName: (icon: string, name: string) => `${icon} ${name}`,
	unsavedWarning: "\u307e\u3060\u4fdd\u5b58\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002\u9589\u3058\u307e\u3059\u304b\uff1f",
	unsavedYes: "\u9589\u3058\u308b",
	unsavedNo: "\u623b\u308b",
	abortBtn: "\u3084\u3081\u308b",
	museWatching: (name: string) => `${name}\u304c\u898b\u5b88\u3063\u3066\u3044\u307e\u3059`,
	museThinking: (name: string) => `${name}\u304c\u4f55\u304b\u8a00\u3044\u305f\u305d\u3046\u3067\u3059`,
	hintRetry: "\u30af\u30ea\u30c3\u30af\u3067\u5225\u306e\u63d0\u6848",
	diagTitle: (name: string) => `${name}\u306e\u8a3a\u65ad`,
	diagLoading: (name: string) => `${name}\u304c\u7269\u8a9e\u5168\u4f53\u3092\u8aad\u307f\u89e3\u3044\u3066\u3044\u307e\u3059\u2026\u2026`,
	diagError: "\u8a3a\u65ad\u3092\u53d6\u5f97\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f\u3002",
	diagSynopsis: "\ud83d\udcdd \u3042\u3089\u3059\u3058",
	diagWeakness: "\ud83d\udca1 \u3082\u3046\u5c11\u3057\u6398\u308a\u4e0b\u3052\u305f\u3044\u3068\u3053\u308d",
	diagSuggestion: "\u2728 \u3053\u3093\u306a\u65b9\u5411\u3082\u3042\u308b\u304b\u3082\uff1f",
	diagRetry: "\u263d \u3082\u3046\u4e00\u5ea6\u8a3a\u65ad",
	settingSaveFolder: "\u4fdd\u5b58\u5148\u30d5\u30a9\u30eb\u30c0",
	settingSaveFolderDesc: "\u30d7\u30ed\u30c3\u30c8\u306eMD\u30d5\u30a1\u30a4\u30eb\u306e\u4fdd\u5b58\u5148",
	settingGenrePacks: "\u30b8\u30e3\u30f3\u30eb\u30d1\u30c3\u30af",
	settingBasePack: "\u57fa\u672c\u30d1\u30c3\u30af\uff08\u30d9\u30fc\u30b9/\u7570\u4e16\u754c/\u30e9\u30d6\u30b3\u30e1/\u30df\u30b9\u30c6\u30ea/\u30db\u30e9\u30fc\uff09",
	settingPackA: "\u30b8\u30e3\u30f3\u30eb\u30d1\u30c3\u30af A\uff08\u5b66\u5712\u9752\u6625/\u30b5\u30b9\u30da\u30f3\u30b9/\u30e9\u30a4\u30c8SF/\u6b74\u53f2\u30fb\u6642\u4ee3\uff09",
	settingPackB: "\u30b8\u30e3\u30f3\u30eb\u30d1\u30c3\u30af B\uff08\u30c0\u30fc\u30af/\u30c9\u30e9\u30de/\u30ce\u30ef\u30fc\u30eb/BL\u30fbGL\uff09",
	settingBooth: "\ud83c\udfea Booth",
	settingPackInstall: "\ud83d\udce6 \u30d1\u30c3\u30af\u306e\u5c0e\u5165",
	settingPackInstallDesc: "\u8cfc\u5165\u3057\u305fJSON\u30d5\u30a1\u30a4\u30eb\u3092 MuseWeaver/PluginSettings/MWPlot/ \u306b\u914d\u7f6e\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
	settingOpenFolder: "\ud83d\udcc2 \u30d5\u30a9\u30eb\u30c0\u3092\u958b\u304f",
	settingOpenFolderDesc: "MuseWeaver/PluginSettings/MWPlot/ \u30d5\u30a9\u30eb\u30c0\u304c\u306a\u3044\u5834\u5408\u3001\u81ea\u52d5\u4f5c\u6210\u3055\u308c\u307e\u3059\u3002",
	settingReload: "\ud83d\udd04 \u518d\u8aad\u307f\u8fbc\u307f",
	settingReloaded: "\u30d1\u30c3\u30af\u3092\u518d\u8aad\u307f\u8fbc\u307f\u3057\u307e\u3057\u305f",
};

const en: I18nStrings = {
	pluginTitle: "\u263d Muse Weaver Plot",
	pluginSubtitle: "MPC-10 \u2014 Build your story\u2019s backbone in 10 questions",
	brandHeading: "Muse Weaver Plot",
	brandSubtitle: "MPC-10 \u2014 Build your story\u2019s backbone in 10 questions",
	brandMessage: "I\u2019d like to hear your story.",
	weaveStory: "\u263d Weave a Story",
	reweaveStory: "\ud83d\udcd6 Reweave a Story",
	reweaveDesc: "Load a saved plot and re-edit",
	reweaveSelect: "\ud83d\udcd6 Select a plot to reweave",
	reweaveLoaded: "Plot loaded successfully",
	reweaveNotPlot: "This file is not a valid plot format",
	reweavePartial: (n: number) => `${n}/10 fields loaded`,
	reweaveNoFiles: "No saved plots found",
	resumePrompt: "You have an unfinished plot. Resume?",
	resumeYes: "Resume",
	resumeNo: "Start New",
	recentPlots: "Saved Plots",
	plotNameLabel: "Plot Name (optional)",
	plotNamePlaceholder: "Untitled Plot",
	saveNameLabel: "Name your plot and save",
	overwriteConfirm: (name: string) => `"${name}" already exists.`,
	overwriteYes: "Overwrite",
	overwriteNo: "Save as new",
	flavorLabel: "Choose a Genre",
	start: "Start \u203a",
	next: "Next \u203a",
	done: "Done \u2714",
	back: "\u2039",
	backToFlavor: "\u2039Genre",
	showExample: "\ud83d\udca1 Examples",
	freeWrite: "\ud83d\udcdd Free Write",
	saveMd: "\ud83d\udcc4 Save as MD",
	openFile: "\ud83d\udcc2 Open File",
	close: "Close",
	completeTitle: "Another seed of a story has sprouted",
	completeSubtitle: "What kind of flower will this story bloom into\u2026 how exciting.",
	noInput: "(empty)",
	savedNotice: "\u263d Saved: ",
	charLabel: " chars",
	untitled: "Untitled Plot",
	inputPlaceholder: "Type here\u2026",
	updateBtn: "Update",
	cancelBtn: "Cancel",
	museName: (icon: string, name: string) => `${icon} ${name}`,
	unsavedWarning: "Your plot hasn\u2019t been saved yet. Close anyway?",
	unsavedYes: "Close",
	unsavedNo: "Go Back",
	abortBtn: "Quit",
	museWatching: (name: string) => `${name} is watching over you`,
	museThinking: (name: string) => `${name} has something to say`,
	hintRetry: "Click for another suggestion",
	diagTitle: (name: string) => `${name}\u2019s Diagnosis`,
	diagLoading: (name: string) => `${name} is reading your entire story\u2026`,
	diagError: "Could not retrieve diagnosis.",
	diagSynopsis: "\ud83d\udcdd Synopsis",
	diagWeakness: "\ud83d\udca1 Areas to Explore Further",
	diagSuggestion: "\u2728 Possible Directions",
	diagRetry: "\u263d Diagnose Again",
	settingSaveFolder: "Save Folder",
	settingSaveFolderDesc: "Where to save plot MD files",
	settingGenrePacks: "Genre Packs",
	settingBasePack: "Base Pack (Base/Isekai/RomCom/Mystery/Horror)",
	settingPackA: "Genre Pack A (School/Suspense/Lite SF/Historical)",
	settingPackB: "Genre Pack B (Dark/Drama/Noir/BL\u30fbGL)",
	settingBooth: "\ud83c\udfea Booth",
	settingPackInstall: "\ud83d\udce6 Pack Installation",
	settingPackInstallDesc: "Place purchased JSON files in MuseWeaver/PluginSettings/MWPlot/.",
	settingOpenFolder: "\ud83d\udcc2 Open Folder",
	settingOpenFolderDesc: "If MuseWeaver/PluginSettings/MWPlot/ does not exist, it will be created automatically.",
	settingReload: "\ud83d\udd04 Reload",
	settingReloaded: "Packs reloaded",
};

/** Detect language: ja if locale starts with 'ja', otherwise en */
function detectLang(): "ja" | "en" {
	try {
		const locale = moment.locale();
		return locale.startsWith("ja") ? "ja" : "en";
	} catch {
		return "en";
	}
}

export const lang: "ja" | "en" = detectLang();
export const t: I18nStrings = lang === "ja" ? ja : en;
