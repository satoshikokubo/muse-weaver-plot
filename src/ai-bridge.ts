import { App } from "obsidian";

const BRIDGE_ID = "muse-weaver-ai-bridge";

/** Augmented App type to access internal plugin registry. */
interface AppWithPlugins extends App {
	plugins?: {
		plugins?: Record<string, unknown>;
	};
}

interface AiRequest {
	system: string;
	message: string;
	maxTokens?: number;
}

interface AiResult {
	text: string;
	ok: boolean;
	error?: string;
}

/** Persona info from AI Bridge */
export interface GuideInfo {
	id: string;
	name: string;
	icon: string;
	tone: string;
	firstPerson: string;
	speechStyle: string;
}

interface AiBridgePlugin {
	callAi(req: AiRequest): Promise<AiResult>;
	isConfigured(): boolean;
	getProviderName(): string;
	getPersona?(): GuideInfo;
	getPersonaPrompt?(): string;
}

/** Default fallback when Bridge is unavailable or has no persona API */
const DEFAULT_GUIDE: GuideInfo = {
	id: "default",
	name: "Muse",
	icon: "moon",
	tone: "",
	firstPerson: "",
	speechStyle: "",
};

/**
 * Get the AI Bridge plugin instance, or null if not installed/enabled.
 */
export function getBridge(app: App): AiBridgePlugin | null {
	const plugins = (app as AppWithPlugins).plugins?.plugins;
	if (!plugins) return null;
	const bridge = plugins[BRIDGE_ID];
	if (!bridge || typeof (bridge as Record<string, unknown>).callAi !== "function") return null;
	return bridge as AiBridgePlugin;
}

/**
 * Check if AI Bridge is available and configured.
 */
export function isAiAvailable(app: App): boolean {
	const bridge = getBridge(app);
	return bridge?.isConfigured() ?? false;
}

/**
 * Call AI via Bridge. Returns null if Bridge unavailable.
 */
export async function callAi(app: App, req: AiRequest): Promise<AiResult | null> {
	const bridge = getBridge(app);
	if (!bridge) return null;
	return bridge.callAi(req);
}

/**
 * Get the active guide info. Falls back to default Muse if Bridge unavailable.
 */
export function getGuide(app: App): GuideInfo {
	const bridge = getBridge(app);
	if (bridge?.getPersona) {
		try {
			return bridge.getPersona();
		} catch { /* fallback */ }
	}
	return DEFAULT_GUIDE;
}

/**
 * Get the persona system prompt fragment from Bridge.
 * Returns empty string if Bridge unavailable (caller uses built-in Muse prompt).
 */
export function getGuidePrompt(app: App): string {
	const bridge = getBridge(app);
	if (bridge?.getPersonaPrompt) {
		try {
			return bridge.getPersonaPrompt();
		} catch { /* fallback */ }
	}
	return "";
}
