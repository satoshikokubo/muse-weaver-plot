import { App } from "obsidian";
import type { PackJson, LoadedPack, FlavorOverride, SubQuestion } from "./types";
import { FLAVORS } from "./data";
import { lang } from "./i18n";

const PACKS_FOLDER = "MuseWeaver/PluginSettings/MWPlot";
const PACK_PREFIX = "mwp-pack-";

// ============================================================
// i18n resolution for pack JSON values
// ============================================================

type Localizable = string | { ja: string; en: string };
type LocalizableArray = string[] | { ja: string[]; en: string[] };

/** Resolve a string that may be {ja, en} or plain string. */
function resolveStr(val: Localizable): string {
	if (typeof val === "string") return val;
	if (val && typeof val === "object" && "ja" in val) return val[lang] ?? val.ja;
	return String(val);
}

/** Resolve a string[] that may be {ja, en} or plain string[]. */
function resolveArr(val: LocalizableArray): string[] {
	if (Array.isArray(val)) return val;
	if (val && typeof val === "object" && "ja" in val) return val[lang] ?? val.ja;
	return [];
}

/**
 * Resolve all i18n values in pack overrides.
 * Converts {ja, en} objects to plain strings based on current lang.
 */
function resolveOverrides(overrides: Record<string, unknown>): Record<string, FlavorOverride> {
	const resolved: Record<string, FlavorOverride> = {};
	for (const [qId, rawOv] of Object.entries(overrides)) {
		if (!rawOv || typeof rawOv !== "object") continue;
		const ov = rawOv as Record<string, unknown>;
		const out: FlavorOverride = {};

		if (ov.prompt != null) out.prompt = resolveStr(ov.prompt as Localizable);
		if (ov.label != null) out.label = resolveStr(ov.label as Localizable);
		if (ov.examples != null) out.examples = resolveArr(ov.examples as LocalizableArray);

		if (Array.isArray(ov.sub)) {
			out.sub = (ov.sub as Record<string, unknown>[]).map((s) => ({
				id: String(s.id ?? ""),
				label: resolveStr((s.label ?? "") as Localizable),
				placeholder: resolveStr((s.placeholder ?? "") as Localizable),
			} as SubQuestion));
		}

		resolved[qId] = out;
	}
	return resolved;
}

/**
 * Snapshot of initial flavor state (before any pack is applied).
 * Used to reset flavors on reload.
 */
interface FlavorSnapshot {
	id: string;
	name: string;
	locked: boolean;
}

let initialSnapshot: FlavorSnapshot[] | null = null;

function captureSnapshot(): void {
	if (initialSnapshot) return; // Only capture once
	initialSnapshot = FLAVORS.map((f) => ({ id: f.id, name: f.name, locked: f.locked }));
}

/**
 * Reset FLAVORS to initial state: restore locked/name, remove pack-added flavors.
 */
function resetFlavors(): void {
	if (!initialSnapshot) return;

	// Remove dynamically added flavors (not in original snapshot)
	const originalIds = new Set(initialSnapshot.map((s) => s.id));
	for (let i = FLAVORS.length - 1; i >= 0; i--) {
		if (!originalIds.has(FLAVORS[i].id)) {
			FLAVORS.splice(i, 1);
		}
	}

	// Restore original locked state, name, and clear overrides from packs
	for (const snap of initialSnapshot) {
		const f = FLAVORS.find((fl) => fl.id === snap.id);
		if (f) {
			f.locked = snap.locked;
			f.name = snap.name;
			// Only clear overrides for pack flavors (locked ones); keep built-in overrides
			if (snap.locked) {
				f.overrides = undefined;
			}
		}
	}
}

/**
 * Scan plugin folder for mwp-pack-*.json files, load valid packs,
 * unlock matching flavors, and merge overrides.
 * Returns list of successfully loaded packs.
 */
export async function loadPacks(app: App): Promise<LoadedPack[]> {
	// Capture initial state on first call
	captureSnapshot();

	// Reset to clean state before (re)loading
	resetFlavors();

	const loaded: LoadedPack[] = [];
	const adapter = app.vault.adapter;

	// Check if plugin folder exists
	if (!(await adapter.exists(PACKS_FOLDER))) {
		return loaded;
	}

	// List files in plugin folder, pick only mwp-pack-*.json
	const listing = await adapter.list(PACKS_FOLDER);
	const jsonFiles = listing.files.filter((f) => {
		const fname = f.split("/").pop() ?? "";
		return fname.startsWith(PACK_PREFIX) && fname.endsWith(".json");
	});

	for (const filePath of jsonFiles) {
		try {
			const raw = await adapter.read(filePath);
			const pack = JSON.parse(raw) as PackJson;

			// Validate
			if (!isValidPack(pack)) {
				console.warn(`[MWP] Invalid pack: ${filePath}`);
				continue;
			}

			const resolvedPackName = resolveStr(pack.name as Localizable);

			// Merge flavors
			for (const pf of pack.flavors) {
				const resolvedName = resolveStr(pf.name as Localizable);
				const resolvedOverrides = pf.overrides ? resolveOverrides(pf.overrides as Record<string, unknown>) : undefined;
				const existing = FLAVORS.find((f) => f.id === pf.id);
				if (existing) {
					// Unlock and merge overrides
					existing.locked = false;
					if (resolvedName) existing.name = resolvedName;
					if (resolvedOverrides) existing.overrides = resolvedOverrides;
				} else {
					// New flavor from pack — append (use pack.id for matching)
					FLAVORS.push({
						id: pf.id,
						name: resolvedName,
						locked: false,
						pack: pack.id,
						overrides: resolvedOverrides,
					});
				}
			}

			const filename = filePath.split("/").pop() || filePath;
			loaded.push({
				id: pack.id,
				name: resolvedPackName,
				version: pack.version,
				filename,
			});
		} catch (e) {
			console.warn(`[MWP] Failed to load pack: ${filePath}`, e);
		}
	}

	if (loaded.length > 0) {
		console.warn(`[MWP] Loaded ${loaded.length} pack(s): ${loaded.map((p) => p.name).join(", ")}`);
	}

	return loaded;
}

/**
 * Check if a value is a valid string or {ja, en} localizable object.
 */
function isStringOrLocalizable(val: unknown): boolean {
	if (typeof val === "string") return val.length > 0;
	if (typeof val === "object" && val !== null && "ja" in (val as Record<string, unknown>)) {
		return typeof (val as Record<string, string>).ja === "string";
	}
	return false;
}

/**
 * Basic validation for pack JSON structure.
 */
function isValidPack(obj: unknown): obj is PackJson {
	if (typeof obj !== "object" || obj === null) return false;
	const p = obj as Record<string, unknown>;
	if (typeof p.id !== "string" || !p.id) return false;
	if (!isStringOrLocalizable(p.name)) return false;
	if (typeof p.version !== "string") return false;
	if (!Array.isArray(p.flavors)) return false;

	for (const f of p.flavors) {
		if (typeof f !== "object" || f === null) return false;
		if (typeof f.id !== "string" || !f.id) return false;
		if (!isStringOrLocalizable(f.name)) return false;
	}
	return true;
}
