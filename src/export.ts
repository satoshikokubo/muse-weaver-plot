import { App, Notice, TFile } from "obsidian";
import type { AnswerData } from "./types";
import { BASE_QUESTIONS, FLAVORS, getResolvedQuestion } from "./data";
import { t, lang } from "./i18n";

// ============================================================
// Parse: Import plot from Markdown
// ============================================================

export interface ParsedPlot {
	plotTitle: string;
	flavorId: string;
	answers: Record<string, AnswerData>;
	warnings: string[];
}

/**
 * Parse a Muse Weaver Plot Markdown file back into structured data.
 * Returns null if the file is not a valid plot format.
 */
export function parsePlotMarkdown(content: string): ParsedPlot | null {
	const warnings: string[] = [];

	// --- Frontmatter ---
	const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
	if (!fmMatch) return null;

	const fm = fmMatch[1];
	if (!fm.includes('plugin: "muse-weaver-plot"') && !fm.includes("plugin: muse-weaver-plot")) {
		return null;
	}

	const flavorMatch = fm.match(/flavor:\s*"?([^"\n]+)"?/);
	const flavorId = flavorMatch?.[1]?.trim() || "base";

	// Validate flavor exists (use base as fallback)
	const flavorExists = FLAVORS.some((f) => f.id === flavorId);
	const resolvedFlavor = flavorExists ? flavorId : "base";
	if (!flavorExists) {
		warnings.push(`Flavor "${flavorId}" not found, using base`);
	}

	// --- Title ---
	const body = content.slice(fmMatch[0].length).trim();
	const titleMatch = body.match(/^#\s+(.+)$/m);
	const plotTitle = titleMatch?.[1]?.trim() || "";

	// --- Split by ## Q{n}. sections ---
	const answers: Record<string, AnswerData> = {};
	// Capture header start position AND content start position
	const sectionRegex = /^## Q(\d+)\.\s+.+$/gm;
	const sections: { qNum: number; headerStart: number; contentStart: number }[] = [];

	let match: RegExpExecArray | null;
	while ((match = sectionRegex.exec(body)) !== null) {
		sections.push({
			qNum: parseInt(match[1], 10),
			headerStart: match.index,
			contentStart: match.index + match[0].length,
		});
	}

	// Find the diagnosis separator to exclude it
	const diagnosisSep = body.indexOf("\n---\n");

	for (let s = 0; s < sections.length; s++) {
		const { qNum, contentStart } = sections[s];
		if (qNum < 1 || qNum > 10) continue;

		const qIndex = qNum - 1;
		const qId = BASE_QUESTIONS[qIndex]?.id;
		if (!qId) continue;

		// Section ends at next header start, diagnosis separator, or EOF
		let endPos = body.length;
		if (s + 1 < sections.length) {
			endPos = sections[s + 1].headerStart;
		}
		if (diagnosisSep > 0 && diagnosisSep < endPos && diagnosisSep > contentStart) {
			endPos = diagnosisSep;
		}

		const sectionContent = body.slice(contentStart, endPos).trim();

		// --- Parse sub items ---
		const resolved = getResolvedQuestion(resolvedFlavor, qIndex);
		const sub: Record<string, string> = {};
		const subLines: Set<string> = new Set();

		if (resolved.sub.length > 0) {
			for (const subDef of resolved.sub) {
				// Match: - **label**: value  (value may be empty)
				const escaped = subDef.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
				const subMatch = sectionContent.match(new RegExp(`^-\\s+\\*\\*${escaped}\\*\\*:[ \\t]*(.*)$`, "m"));
				if (subMatch) {
					sub[subDef.id] = subMatch[1].trim();
					subLines.add(subMatch[0].trim());
				}
			}
		}

		// --- Main text: everything that's not a sub item line ---
		const mainLines = sectionContent
			.split("\n")
			.filter((line) => {
				const trimmed = line.trim();
				if (!trimmed) return false;
				if (subLines.has(trimmed)) return false;
				// Skip any "- **...**:" lines (matched or unmatched)
				if (/^-\s+\*\*.+\*\*:/.test(trimmed)) return false;
				// Skip Obsidian comments (%% ... %%)
				if (/^%%.*%%$/.test(trimmed)) return false;
				return true;
			})
			.join("\n")
			.trim();

		answers[qId] = { main: mainLines, sub };
	}

	// Check for missing questions
	const loadedCount = Object.keys(answers).length;
	if (loadedCount < 10 && loadedCount > 0) {
		warnings.push(`${loadedCount}/10 questions loaded`);
	}

	return { plotTitle, flavorId: resolvedFlavor, answers, warnings };
}

/**
 * Generate Markdown string from plot answers.
 */
export function generateMarkdown(
	plotTitle: string,
	flavorId: string,
	answers: Record<string, AnswerData>,
	diagnosis?: { synopsis: string; weaknesses: { questionId: string; label: string; issue: string }[]; suggestions: string[] } | null,
	guideInfo?: { emoji: string; name: string } | null,
): string {
	const title = plotTitle || t.untitled;
	const flavorName = FLAVORS.find((f) => f.id === flavorId)?.name || "";
	const now = new Date().toISOString().split("T")[0];

	let md = "---\n";
	md += 'mpc_version: "1.0"\n';
	md += 'plugin: "muse-weaver-plot"\n';
	md += `flavor: "${flavorId}"\n`;
	md += `created: ${now}\n`;
	md += `updated: ${now}\n`;
	md += 'status: "complete"\n';
	md += "---\n\n";
	md += `# ${title}\n\n`;
	md += `> ${lang === "ja" ? "\u30b8\u30e3\u30f3\u30eb" : "Genre"}: ${flavorName}\n\n`;

	// Import note
	md += lang === "ja"
		? "> [!info] \u3053\u306e\u30d5\u30a1\u30a4\u30eb\u306f\u300c\u7269\u8a9e\u3092\u7de8\u307f\u76f4\u3059\u300d\u3067\u518d\u53d6\u308a\u8fbc\u307f\u3067\u304d\u307e\u3059\u3002`## Q{n}.` \u30d8\u30c3\u30c0\u3068 `- **\u9805\u76ee\u540d**:` \u306e\u5f62\u5f0f\u3092\u5d29\u3055\u306a\u3044\u3088\u3046\u306b\u3054\u6ce8\u610f\u304f\u3060\u3055\u3044\u3002\n\n"
		: "> [!info] This file can be re-imported via \u201cReweave a Story.\u201d Please preserve the `## Q{n}.` headers and `- **Label**:` format.\n\n";

	for (let i = 0; i < BASE_QUESTIONS.length; i++) {
		const q = getResolvedQuestion(flavorId, i);
		const answer = answers[q.id];
		md += `## Q${i + 1}. ${q.label}\n\n`;

		// Always output sub labels (even when empty)
		if (q.sub.length > 0) {
			for (const sub of q.sub) {
				const val = answer?.sub?.[sub.id] || "";
				md += `- **${sub.label}**: ${val}\n`;
			}
			md += "\n";
			// Free-text marker for sub-field questions
			md += `%% ${lang === "ja" ? "\u2193 \u81ea\u7531\u8a18\u8ff0" : "\u2193 Free text"} %%\n`;
			const mainText = answer?.main || "";
			md += mainText ? `${mainText}\n\n` : "\n";
		} else {
			// No sub fields: show marker then content
			const mainText = answer?.main || "";
			if (mainText) {
				md += `${mainText}\n\n`;
			} else {
				md += `%% ${lang === "ja" ? "\u2193 \u3053\u3053\u306b\u5165\u529b" : "\u2193 Enter here"} %%\n\n`;
			}
		}
	}

	// Diagnosis
	if (diagnosis) {
		const gEmoji = guideInfo?.emoji || "\u263d";
		const gName = guideInfo?.name || "Muse";
		md += "---\n\n";
		md += lang === "ja"
			? `## ${gEmoji} ${gName}\u306e\u8a3a\u65ad\n\n`
			: `## ${gEmoji} ${gName}\u2019s Diagnosis\n\n`;

		if (diagnosis.synopsis) {
			md += lang === "ja" ? "### \u3042\u3089\u3059\u3058\n\n" : "### Synopsis\n\n";
			md += `${diagnosis.synopsis}\n\n`;
		}

		if (diagnosis.weaknesses && diagnosis.weaknesses.length > 0) {
			md += lang === "ja" ? "### \u3082\u3046\u5c11\u3057\u6398\u308a\u4e0b\u3052\u305f\u3044\u3068\u3053\u308d\n\n" : "### Areas to Explore Further\n\n";
			for (const w of diagnosis.weaknesses) {
				md += `- **${w.label}**: ${w.issue}\n`;
			}
			md += "\n";
		}

		if (diagnosis.suggestions && diagnosis.suggestions.length > 0) {
			md += lang === "ja" ? "### \u3053\u3093\u306a\u65b9\u5411\u3082\u3042\u308b\u304b\u3082\uff1f\n\n" : "### Possible Directions\n\n";
			for (const s of diagnosis.suggestions) {
				md += `- ${s}\n`;
			}
			md += "\n";
		}
	}

	return md;
}

/**
 * Ensure folder path exists, creating nested folders as needed.
 */
export async function ensureFolder(app: App, folderPath: string): Promise<void> {
	const parts = folderPath.split("/");
	let currentPath = "";
	for (const part of parts) {
		currentPath = currentPath ? `${currentPath}/${part}` : part;
		if (!app.vault.getAbstractFileByPath(currentPath)) {
			await app.vault.createFolder(currentPath);
		}
	}
}

/**
 * Get a unique file path (no overwrite). Appends _2, _3, etc.
 */
export function getUniqueFilePath(app: App, folder: string, title: string): string {
	const sanitized = title.replace(/[\\/:*?"<>|]/g, "_");
	let filePath = `${folder}/${sanitized}.md`;
	let counter = 1;
	while (app.vault.getAbstractFileByPath(filePath)) {
		counter++;
		filePath = `${folder}/${sanitized}_${counter}.md`;
	}
	return filePath;
}

/**
 * Check if a file with this title already exists in the save folder.
 */
export function plotFileExists(app: App, folder: string, title: string): boolean {
	const sanitized = title.replace(/[\\/:*?"<>|]/g, "_");
	return !!app.vault.getAbstractFileByPath(`${folder}/${sanitized}.md`);
}

/**
 * Save markdown to file and open it.
 */
export async function saveAndOpenPlot(
	app: App,
	saveFolder: string,
	plotTitle: string,
	flavorId: string,
	answers: Record<string, AnswerData>,
	diagnosis?: { synopsis: string; weaknesses: { questionId: string; label: string; issue: string }[]; suggestions: string[] } | null,
	guideInfo?: { emoji: string; name: string } | null,
	overwrite?: boolean,
): Promise<string | null> {
	const title = plotTitle || t.untitled;
	const md = generateMarkdown(plotTitle, flavorId, answers, diagnosis, guideInfo);

	await ensureFolder(app, saveFolder);

	const sanitized = title.replace(/[\\/:*?"<>|]/g, "_");
	const exactPath = `${saveFolder}/${sanitized}.md`;

	let filePath: string;
	if (overwrite && app.vault.getAbstractFileByPath(exactPath)) {
		// Overwrite existing file
		filePath = exactPath;
		try {
			const existing = app.vault.getAbstractFileByPath(exactPath);
			if (existing instanceof TFile) {
				await app.vault.modify(existing, md);
			}
			new Notice(t.savedNotice + filePath);
			await app.workspace.openLinkText(filePath, "", false);
			return filePath;
		} catch (e) {
			new Notice(`\u4fdd\u5b58\u306b\u5931\u6557: ${e}`);
			return null;
		}
	} else {
		filePath = getUniqueFilePath(app, saveFolder, title);
		try {
			await app.vault.create(filePath, md);
			new Notice(t.savedNotice + filePath);
			await app.workspace.openLinkText(filePath, "", false);
			return filePath;
		} catch (e) {
			new Notice(`\u4fdd\u5b58\u306b\u5931\u6557: ${e}`);
			return null;
		}
	}
}
