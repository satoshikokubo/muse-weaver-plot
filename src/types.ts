export const VIEW_TYPE_MUSE_WEAVER_PLOT = "muse-weaver-plot-view";
export const DEFAULT_SAVE_FOLDER = "MuseWeaver/Plots";

// ============================================================
// Question / Flavor types
// ============================================================

export interface SubQuestion {
	id: string;
	label: string;
	placeholder: string;
}

export interface MpcQuestion {
	id: string;
	label: string;
	prompt: string;
	examples: string[];
	icon: string;
	sub: SubQuestion[];
}

export interface Flavor {
	id: string;
	name: string;
	locked: boolean;
	pack?: string;
	overrides?: Record<string, FlavorOverride>;
}

export interface FlavorOverride {
	examples?: string[];
	prompt?: string;
	label?: string;
	sub?: SubQuestion[];   // 設計書規約：subは丸ごと置換
}

// ============================================================
// Session / Plugin data types
// ============================================================

export interface AnswerData {
	main: string;
	sub: Record<string, string>;
}

export interface SessionData {
	plotTitle: string;
	selectedFlavor: string;
	currentStep: number;
	answers: Record<string, AnswerData>;
	status: "in_progress" | "complete";
	updatedAt: string;
}

export interface PluginSettings {
	saveFolder: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	saveFolder: DEFAULT_SAVE_FOLDER,
};

export interface PluginData {
	session?: SessionData;
	settings?: PluginSettings;
}

export type ViewMode = "start" | "flavor" | "question" | "complete";

// ============================================================
// Pack JSON schema
// ============================================================

export interface PackFlavorDef {
	id: string;
	name: string;
	overrides?: Record<string, FlavorOverride>;
}

export interface PackJson {
	id: string;
	name: string;
	version: string;
	flavors: PackFlavorDef[];
}

export interface LoadedPack {
	id: string;
	name: string;
	version: string;
	filename: string;
}

// ============================================================
// Pack Catalog — single source of truth for available packs
// Adding a new pack = adding ONE entry here. No other code changes needed.
// ============================================================

export interface PackCatalogEntry {
	id: string;
	name: string; // Internal key — must match Flavor.pack in data.ts
	displayName: { ja: string; en: string };
	desc: { ja: string; en: string };
	boothUrl: string;
}

export const PACK_CATALOG: PackCatalogEntry[] = [
	{
		id: "pack_a",
		name: "Pack A",
		displayName: {
			ja: "\u8ffd\u52a0\u30d1\u30c3\u30af\u3010\u6fc0\u52d5\u3068\u6311\u6226\u3011",
			en: "Expansion: Turmoil & Trials",
		},
		desc: {
			ja: "\u5b66\u5712\u9752\u6625\uff0f\u30b9\u30dd\u6839 / \u30b5\u30b9\u30da\u30f3\u30b9\uff0f\u30af\u30e9\u30a4\u30e0 / \u30e9\u30a4\u30c8SF\uff08\u8fd1\u672a\u6765\uff09 / \u6b74\u53f2\u30fb\u6642\u4ee3",
			en: "School / Sports / Suspense / Crime / Lite SF / Historical",
		},
		boothUrl: "https://kokubox.booth.pm/",
	},
	{
		id: "pack_b",
		name: "Pack B",
		displayName: {
			ja: "\u8ffd\u52a0\u30d1\u30c3\u30af\u3010\u60c5\u5ff5\u3068\u9670\u5f71\u3011",
			en: "Expansion: Passion & Shadows",
		},
		desc: {
			ja: "\u30c0\u30fc\u30af\u30d5\u30a1\u30f3\u30bf\u30b8\u30fc / \u30d2\u30e5\u30fc\u30de\u30f3\u30c9\u30e9\u30de / \u30e9\u30a4\u30c8\u30ce\u30ef\u30fc\u30eb / BL / GL",
			en: "Dark Fantasy / Human Drama / Light Noir / BL / GL",
		},
		boothUrl: "https://kokubox.booth.pm/",
	},
	// --- To add Pack C, just add an entry here: ---
	// {
	// 	id: "pack_c",
	// 	name: "Pack C",
	// 	displayName: { ja: "追加パック【...】", en: "Expansion: ..." },
	// 	desc: { ja: "...", en: "..." },
	// 	boothUrl: "https://kokubox.booth.pm/items/xxxxx",
	// },
];
