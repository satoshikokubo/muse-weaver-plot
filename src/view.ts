import {
	WorkspaceLeaf,
	ItemView,
	TFile,
	TFolder,
	parseYaml,
	EventRef,
	SuggestModal,
	Notice,
} from "obsidian";
import type MuseWeaverPlotPlugin from "./main";
import {
	VIEW_TYPE_MUSE_WEAVER_PLOT,
	type PluginData,
	type AnswerData,
	type ViewMode,
} from "./types";
import { t, lang } from "./i18n";
import { BASE_QUESTIONS, FLAVORS, getExamples, getResolvedQuestion } from "./data";
import { saveAndOpenPlot, parsePlotMarkdown, plotFileExists } from "./export";
import { isAiAvailable, callAi, getGuide, getGuidePrompt } from "./ai-bridge";
import { buildApprovalPrompt, getMuseSystem, buildHintPrompt, getMuseHintSystem, buildDiagnosisPrompt, getMuseDiagnosisSystem } from "./ai-prompts";

/** WeakMap to track dot animation intervals per element. */
const dotIntervalMap = new WeakMap<HTMLElement, ReturnType<typeof setInterval>>();

export class MuseWeaverPlotView extends ItemView {
	private plugin: MuseWeaverPlotPlugin;
	private currentView: ViewMode = "start";
	private selectedFlavor = "base";
	private plotTitle = "";
	private currentStep = 0;
	private answers: Record<string, AnswerData> = {};
	private savedFilePath?: string;

	private get saveFolder(): string {
		return this.plugin.settings.saveFolder;
	}
	private contentEl_: HTMLElement | null = null;
	private vaultEvents: EventRef[] = [];
	private saveTimer: ReturnType<typeof setTimeout> | null = null;

	// AI approval state
	private approvalTimer: ReturnType<typeof setTimeout> | null = null;
	private approvalLastInput = "";
	private approvalAbort: AbortController | null = null;
	private approvalDismissTimer: ReturnType<typeof setTimeout> | null = null;
	private hintTimer: ReturnType<typeof setTimeout> | null = null;

	constructor(leaf: WorkspaceLeaf, plugin: MuseWeaverPlotPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string { return VIEW_TYPE_MUSE_WEAVER_PLOT; }
	getDisplayText(): string { return "Muse Weaver Plot"; }
	getIcon(): string { return "moon"; }

	/** Get the active guide's display name */
	private get guideName(): string { return getGuide(this.app).name || "Muse"; }
	/** Get the persona system prompt from Bridge (empty = use default) */
	private get personaPrompt(): string { return getGuidePrompt(this.app); }
	/** Get the guide icon as emoji for inline display */
	private get guideEmoji(): string {
		const icon = getGuide(this.app).icon || "moon";
		const map: Record<string, string> = {
			moon: "\u263d", star: "\u2726", sun: "\u2600", scale: "\u2696", sword: "\u2694",
		};
		return map[icon] || "\u263d";
	}

	async onOpen(): Promise<void> {
		const container = this.containerEl.children[1] as HTMLElement;
		container.empty();
		container.addClass("muse-weaver-plot-container");
		this.contentEl_ = container;

		const raw: unknown = await this.plugin.loadData();
		const data = (raw != null && typeof raw === "object") ? raw as PluginData : null;
		if (data?.session && data.session.status === "in_progress") {
			this.plotTitle = data.session.plotTitle;
			this.selectedFlavor = data.session.selectedFlavor;
			this.currentStep = data.session.currentStep;
			this.answers = data.session.answers;
		}

		// Reload packs in case user added new ones
		await this.plugin.reloadPacks();

		const ref1 = this.app.vault.on("create", () => this.refreshIfStart());
		const ref2 = this.app.vault.on("delete", () => this.refreshIfStart());
		const ref3 = this.app.vault.on("rename", () => this.refreshIfStart());
		this.vaultEvents = [ref1, ref2, ref3];

		this.renderView();
	}

	async onClose(): Promise<void> {
		await Promise.resolve();
		for (const ref of this.vaultEvents) {
			this.app.vault.offref(ref);
		}
		this.vaultEvents = [];
		this.contentEl_ = null;
	}

	private refreshIfStart(): void {
		if (this.currentView === "start") this.renderView();
	}

	// ---- Persistence ----

	private debounceSave(): void {
		if (this.saveTimer) clearTimeout(this.saveTimer);
		this.saveTimer = setTimeout(() => { void this.saveSession(); }, 1000);
	}

	private async saveSession(): Promise<void> {
		const data: PluginData = {
			session: {
				plotTitle: this.plotTitle,
				selectedFlavor: this.selectedFlavor,
				currentStep: this.currentStep,
				answers: this.answers,
				status: "in_progress",
				updatedAt: new Date().toISOString(),
			},
		};
		await this.plugin.saveData(data);
		this.plugin.cachedData = data;
	}

	private async clearSession(): Promise<void> {
		const empty: PluginData = {};
		await this.plugin.saveData(empty);
		this.plugin.cachedData = empty;
	}

	// ---- Navigation ----

	private showView(view: ViewMode): void {
		this.currentView = view;
		this.renderView();
	}

	private renderView(): void {
		if (!this.contentEl_) return;
		this.contentEl_.empty();

		if (this.currentView === "start") {
			this.renderBrandFull(this.contentEl_);
		} else {
			this.renderBrandCompact(this.contentEl_);
		}

		const body = this.contentEl_.createDiv({ cls: "mwp-body" });

		switch (this.currentView) {
			case "start": this.renderStart(body); break;
			case "flavor": this.renderFlavor(body); break;
			case "question": this.renderQuestion(body); break;
			case "complete": this.renderComplete(body); break;
		}
	}

	private renderBrandFull(container: HTMLElement): void {
		const header = container.createDiv({ cls: "mwp-header-full" });
		const icon = header.createDiv({ cls: "mwp-brand-icon" });
		icon.setText("\u263d");
		header.createDiv({ text: t.brandHeading, cls: "mwp-brand-heading" });
		header.createEl("p", { text: t.brandSubtitle, cls: "mwp-brand-subtitle" });
		header.createEl("p", { text: t.brandMessage, cls: "mwp-brand-message" });
	}

	private renderBrandCompact(container: HTMLElement): void {
		const header = container.createDiv({ cls: "mwp-header-compact" });
		header.createSpan({ text: "\u263d", cls: "mwp-compact-icon" });
		header.createSpan({ text: `${t.brandHeading} \u2014 ${t.brandMessage}`, cls: "mwp-compact-text" });
	}

	// ---- Start View ----

	private renderStart(container: HTMLElement): void {
		const btnArea = container.createDiv({ cls: "mwp-start-btns" });

		const btn = btnArea.createEl("button", {
			text: t.weaveStory,
			cls: "mwp-btn-primary",
		});
		btn.addEventListener("click", () => {
			const data = this.plugin.cachedData;
			if (data?.session && data.session.status === "in_progress") {
				this.renderResumePrompt(container, btnArea);
			} else {
				this.resetState();
				this.showView("flavor");
			}
		});

		const reweaveBtn = btnArea.createEl("button", {
			text: t.reweaveStory,
			cls: "mwp-btn-secondary",
		});
		btnArea.createEl("p", {
			text: t.reweaveDesc,
			cls: "mwp-start-desc",
		});
		reweaveBtn.addEventListener("click", () => { void this.openPlotSelector(); });

		void this.renderPlotList(container);
	}

	private async openPlotSelector(): Promise<void> {
		// Collect plot files from vault
		const plotFiles: TFile[] = [];

		// Primary: save folder
		const folder = this.app.vault.getAbstractFileByPath(this.saveFolder);
		if (folder && folder instanceof TFolder) {
			for (const f of folder.children) {
				if (f instanceof TFile && f.extension === "md") plotFiles.push(f);
			}
		}

		// Also scan all vault MD files with muse-weaver-plot frontmatter
		for (const f of this.app.vault.getMarkdownFiles()) {
			if (plotFiles.some((p) => p.path === f.path)) continue;
			try {
				const cache = this.app.metadataCache.getFileCache(f);
				if (cache?.frontmatter?.plugin === "muse-weaver-plot") {
					plotFiles.push(f);
				}
			} catch { /* ignore */ }
		}

		if (plotFiles.length === 0) {
			new Notice(t.reweaveNoFiles);
			return;
		}

		// Sort by modified time (newest first)
		plotFiles.sort((a, b) => b.stat.mtime - a.stat.mtime);

		// Build rich info for each file
		const items: PlotFileInfo[] = [];
		for (const file of plotFiles) {
			let title = file.basename;
			let flavor = "";
			try {
				const cache = this.app.metadataCache.getFileCache(file);
				if (cache?.frontmatter) {
					const fm = cache.frontmatter;
					if (fm.flavor) {
						const flavorObj = FLAVORS.find((f) => f.id === fm.flavor);
						flavor = flavorObj ? flavorObj.name : fm.flavor;
					}
				}
				// Extract title from # heading via cached read
				const content = await this.app.vault.cachedRead(file);
				const titleMatch = content.match(/^#\s+(.+)$/m);
				if (titleMatch) title = titleMatch[1].trim();
			} catch { /* ignore */ }

			const date = new Date(file.stat.mtime);
			const ymd = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
			const hm = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
			const updated = `${ymd} ${hm}`;
			items.push({ file, title, flavor, updated });
		}

		// Open suggest modal
		const modal = new PlotSelectModal(this.app, items, (file) => {
			void this.loadPlotFromFile(file);
		});
		modal.setPlaceholder(t.reweaveSelect);
		modal.open();
	}

	private async loadPlotFromFile(file: TFile): Promise<void> {
		const content = await this.app.vault.read(file);
		const result = parsePlotMarkdown(content);

		if (!result) {
			new Notice(t.reweaveNotPlot);
			return;
		}

		// Restore state (reset previous session fully)
		this.plotTitle = result.plotTitle;
		this.selectedFlavor = result.flavorId;
		this.answers = result.answers;
		this.currentStep = 0;
		this.diagnosisResult = null;
		this.savedFilePath = undefined;

		// Show warnings if any
		if (result.warnings.length > 0) {
			const count = Object.keys(result.answers).length;
			new Notice(t.reweavePartial(count));
		} else {
			new Notice(t.reweaveLoaded);
		}

		// Save session and go to Q1
		void this.saveSession();
		this.showView("question");
	}

	private renderResumePrompt(container: HTMLElement, triggerBtn: HTMLElement): void {
		triggerBtn.remove();

		const prompt = container.createDiv({ cls: "mwp-resume-prompt" });
		const bubble = prompt.createDiv({ cls: "mwp-bubble mwp-bubble-sm" });
		bubble.createSpan({ text: t.museName(this.guideEmoji, this.guideName), cls: "mwp-bubble-name" });
		bubble.createEl("p", { text: t.resumePrompt });

		const btns = prompt.createDiv({ cls: "mwp-resume-btns" });
		const yesBtn = btns.createEl("button", { text: t.resumeYes, cls: "mwp-btn-accent mwp-btn-half" });
		yesBtn.addEventListener("click", () => {
			this.showView("question");
		});

		const noBtn = btns.createEl("button", { text: t.resumeNo, cls: "mwp-btn-secondary mwp-btn-half" });
		noBtn.addEventListener("click", () => {
			this.resetState();
			void this.clearSession().then(() => {
				this.showView("flavor");
			});
		});

		if (container.firstChild) {
			container.insertBefore(prompt, container.firstChild);
		}
	}

	private async renderPlotList(container: HTMLElement): Promise<void> {
		const folder = this.app.vault.getAbstractFileByPath(this.saveFolder);
		if (!folder || !(folder instanceof TFolder)) return;

		const files = folder.children.filter(
			(f): f is TFile => f instanceof TFile && f.extension === "md"
		);
		if (files.length === 0) return;

		files.sort((a, b) => {
			const timeDiff = b.stat.mtime - a.stat.mtime;
			if (timeDiff !== 0) return timeDiff;
			return a.basename.localeCompare(b.basename, "ja");
		});

		const section = container.createDiv({ cls: "mwp-plot-list-section" });
		section.createDiv({ cls: "mwp-section-label", text: t.recentPlots });

		const list = section.createDiv({ cls: "mwp-plot-list" });
		const maxShow = 10;

		for (const file of files.slice(0, maxShow)) {
			const item = list.createDiv({ cls: "mwp-plot-list-item" });
			item.createSpan({ text: "\ud83d\udcc4", cls: "mwp-plot-list-icon" });

			const info = item.createDiv({ cls: "mwp-plot-list-info" });
			info.createSpan({ text: file.basename, cls: "mwp-plot-list-name" });

			try {
				const content = await this.app.vault.cachedRead(file);
				const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
				if (fmMatch) {
					const fm = parseYaml(fmMatch[1]);
					if (fm?.flavor) {
						const fn = FLAVORS.find((f) => f.id === fm.flavor)?.name || fm.flavor;
						info.createSpan({ text: fn, cls: "mwp-plot-list-flavor" });
					}
				}
			} catch { /* ignore */ }

			item.addEventListener("click", () => {
				this.app.workspace.openLinkText(file.path, "", false).catch(() => { /* ignore */ });
			});
		}
	}

	// ---- Flavor Select View ----

	private renderFlavor(container: HTMLElement): void {
		const titleLabel = container.createDiv({ cls: "mwp-section-label" });
		titleLabel.setText(t.plotNameLabel);

		const titleInput = container.createEl("input", {
			cls: "mwp-text-input",
			attr: { type: "text", placeholder: t.plotNamePlaceholder, value: this.plotTitle },
		});
		titleInput.addEventListener("input", () => { this.plotTitle = titleInput.value; });

		container.createDiv({ cls: "mwp-section-label", text: t.flavorLabel });

		const flavorList = container.createDiv({ cls: "mwp-flavor-list" });
		for (const flavor of FLAVORS) {
			const item = flavorList.createDiv({
				cls: "mwp-flavor-item" +
					(flavor.id === this.selectedFlavor ? " selected" : "") +
					(flavor.locked ? " locked" : ""),
			});
			const radio = item.createDiv({ cls: "mwp-radio" });
			if (flavor.id === this.selectedFlavor) radio.addClass("checked");
			item.createSpan({ text: (flavor.locked ? "\ud83d\udd12 " : "") + flavor.name });
			if (flavor.locked && flavor.pack) {
				item.createSpan({ text: flavor.pack, cls: "mwp-pack-label" });
			}
			if (!flavor.locked) {
				item.addEventListener("click", () => { this.selectedFlavor = flavor.id; this.renderView(); });
			}
		}

		const nav = container.createDiv({ cls: "mwp-nav" });
		const backBtn = nav.createEl("button", { text: t.back, cls: "mwp-btn-secondary mwp-btn-nav-back" });
		backBtn.addEventListener("click", () => this.showView("start"));

		const startBtn = nav.createEl("button", { text: t.start, cls: "mwp-btn-primary mwp-btn-flex" });
		startBtn.addEventListener("click", () => {
			this.currentStep = 0;
			void this.saveSession();
			this.showView("question");
		});
	}

	// ---- Question Wizard View ----

	private renderQuestion(container: HTMLElement): void {
		const q = getResolvedQuestion(this.selectedFlavor, this.currentStep);
		const answer = this.answers[q.id] || { main: "", sub: {} };
		const hasSub = q.sub.length > 0;
		const flavorName = FLAVORS.find((f) => f.id === this.selectedFlavor)?.name || "";

		// Progress stepper
		const progressWrap = container.createDiv({ cls: "mwp-progress" });
		const progressInfo = progressWrap.createDiv({ cls: "mwp-progress-info" });
		progressInfo.createSpan({ text: flavorName, cls: "mwp-progress-flavor" });
		const pct = Math.round(((this.currentStep + 1) / 10) * 100);
		progressInfo.createSpan({ text: `${pct}%`, cls: "mwp-progress-pct" });

		const stepper = progressWrap.createDiv({ cls: "mwp-stepper" });
		for (let i = 0; i < 10; i++) {
			const qId = BASE_QUESTIONS[i].id;
			const ans = this.answers[qId];
			const hasContent = ans && (
				ans.main.trim() ||
				Object.values(ans.sub).some((v) => v.trim().length > 0)
			);
			const isCurrent = i === this.currentStep;
			const isAnswered = hasContent && !isCurrent;
			const isPast = i < this.currentStep && !hasContent;

			const node = stepper.createDiv({
				cls: `mwp-step${isCurrent ? " is-current" : ""}${isAnswered ? " is-answered" : ""}${isPast ? " is-past" : ""}`,
			});
			node.createSpan({ text: `${i + 1}`, cls: "mwp-step-num" });

			// Clickable: answered steps or past steps (already visited)
			if ((isAnswered || isPast) && !isCurrent) {
				node.addClass("is-clickable");
				node.addEventListener("click", () => {
					// Save current answer before jumping
					void this.saveSession();
					this.currentStep = i;
					void this.saveSession();
					this.showView("question");
				});
			}

			// Connector line (between nodes)
			if (i < 9) {
				const connector = stepper.createDiv({ cls: "mwp-step-connector" });
				if (i < this.currentStep) connector.addClass("is-filled");
			}
		}

		// Muse bubble
		const bubble = container.createDiv({ cls: "mwp-bubble" });
		bubble.createDiv({ cls: "mwp-bubble-header" }).createSpan({ text: t.museName(this.guideEmoji, this.guideName), cls: "mwp-bubble-name" });
		const bubbleText = bubble.createDiv({ cls: "mwp-bubble-text" });
		for (const line of q.prompt.split("\n")) bubbleText.createEl("p", { text: line });

		// Input area
		let mainTextarea: HTMLTextAreaElement | null = null;

		if (hasSub) {
			const subArea = container.createDiv({ cls: "mwp-sub-area" });
			for (const sub of q.sub) {
				const field = subArea.createDiv({ cls: "mwp-sub-field" });
				field.createEl("label", { text: sub.label });
				const input = field.createEl("input", {
					cls: "mwp-sub-input",
					attr: { type: "text", placeholder: sub.placeholder, value: answer.sub[sub.id] || "" },
				});
				input.addEventListener("input", () => {
					this.ensureAnswer(q.id);
					this.answers[q.id].sub[sub.id] = input.value;
					this.debounceSave();
				});
				input.addEventListener("blur", () => { void this.saveSession(); });
			}

			this.renderExpandable(container, t.freeWrite, (content) => {
				mainTextarea = content.createEl("textarea", {
					cls: "mwp-textarea",
					attr: { placeholder: t.inputPlaceholder, rows: "3" },
				});
				mainTextarea.value = answer.main;
				const countEl = content.createDiv({ cls: "mwp-char-count" });
				this.bindCharCount(mainTextarea, countEl);
				mainTextarea.addEventListener("input", () => {
					this.ensureAnswer(q.id);
					this.answers[q.id].main = mainTextarea!.value;
					this.debounceSave();
				});
				mainTextarea.addEventListener("blur", () => { void this.saveSession(); });
			}, answer.main.trim().length > 0);
		} else {
			mainTextarea = container.createEl("textarea", {
				cls: "mwp-textarea",
				attr: { placeholder: t.inputPlaceholder, rows: "5" },
			});
			mainTextarea.value = answer.main;
			const countEl = container.createDiv({ cls: "mwp-char-count" });
			this.bindCharCount(mainTextarea, countEl);
			const taRef = mainTextarea;
			mainTextarea.addEventListener("input", () => {
				this.ensureAnswer(q.id);
				this.answers[q.id].main = taRef.value;
				this.debounceSave();
			});
			mainTextarea.addEventListener("blur", () => { void this.saveSession(); });
		}

		// Example (flavor-aware, shuffle with ▲▼)
		const examples = getExamples(this.selectedFlavor, q.id);
		if (examples.length > 0) {
			// Shuffle into random order once
			const shuffled = [...examples].sort(() => Math.random() - 0.5);
			let exIdx = 0;

			this.renderExpandable(container, t.showExample, (content) => {
				const exWrap = content.createDiv({ cls: "mwp-example-wrap" });
				const exampleText = exWrap.createEl("p", { cls: "mwp-hint-text" });
				exampleText.setText(shuffled[exIdx]);

				if (shuffled.length > 1) {
					const nav = exWrap.createDiv({ cls: "mwp-example-nav" });
					const upBtn = nav.createEl("span", { text: "\u25b2", cls: "mwp-example-arrow" });
					const downBtn = nav.createEl("span", { text: "\u25bc", cls: "mwp-example-arrow" });

					const update = () => { exampleText.setText(shuffled[exIdx]); };

					upBtn.addEventListener("click", () => {
						exIdx = (exIdx - 1 + shuffled.length) % shuffled.length;
						update();
					});
					downBtn.addEventListener("click", () => {
						exIdx = (exIdx + 1) % shuffled.length;
						update();
					});
				}
			});
		}

		// AI comment areas (hint above, approval below)
		const hintArea = container.createDiv({ cls: "mwp-approval-area mwp-hint-area" });
		const approvalArea = container.createDiv({ cls: "mwp-approval-area" });

		// Setup AI watcher (debounced input monitoring + focus-based hints)
		if (isAiAvailable(this.app)) {
			this.setupApprovalWatcher(q.id, hintArea, approvalArea, mainTextarea, hasSub ? container : null);
		}

		// Nav
		const nav = container.createDiv({ cls: "mwp-nav" });
		const prevBtn = nav.createEl("button", {
			text: this.currentStep === 0 ? t.backToFlavor : t.back,
			cls: "mwp-btn-secondary mwp-btn-nav-back",
		});
		prevBtn.addEventListener("click", () => {
			this.cancelApproval();
			this.saveCurrentAnswer(mainTextarea);
			if (this.currentStep === 0) { this.showView("flavor"); }
			else { this.currentStep--; void this.saveSession(); this.showView("question"); }
		});

		const nextBtn = nav.createEl("button", {
			text: this.currentStep === 9 ? t.done : t.next,
			cls: "mwp-btn-primary mwp-btn-flex",
		});
		nextBtn.addEventListener("click", () => {
			this.cancelApproval();
			this.saveCurrentAnswer(mainTextarea);
			void this.saveSession();
			if (this.currentStep < 9) { this.currentStep++; void this.saveSession(); this.showView("question"); }
			else { this.showView("complete"); }
		});

		// Abort button
		const abortBtn = container.createEl("button", {
			text: t.abortBtn,
			cls: "mwp-btn-abort",
		});
		abortBtn.addEventListener("click", () => {
			this.cancelApproval();
			this.saveCurrentAnswer(mainTextarea);
			this.renderUnsavedWarning(container, abortBtn, "question");
		});
	}

	private bindCharCount(textarea: HTMLTextAreaElement, el: HTMLElement): void {
		const update = () => {
			el.setText(`${[...textarea.value].length}${t.charLabel}`);
		};
		textarea.addEventListener("input", update);
		update();
	}

	private renderExpandable(container: HTMLElement, label: string, renderContent: (el: HTMLElement) => void, startOpen = false): void {
		const wrapper = container.createDiv({ cls: "mwp-expandable" });
		const toggle = wrapper.createEl("button", { cls: "mwp-expand-btn" });
		const arrow = toggle.createSpan({ text: startOpen ? "\u25bc" : "\u25b6", cls: "mwp-expand-arrow" });
		toggle.createSpan({ text: label });
		const content = wrapper.createDiv({ cls: "mwp-expand-content" });
		if (startOpen) content.addClass("open");
		renderContent(content);
		toggle.addEventListener("click", () => {
			const isOpen = content.hasClass("open");
			content.toggleClass("open", !isOpen);
			arrow.setText(isOpen ? "\u25b6" : "\u25bc");
		});
	}

	private saveCurrentAnswer(textarea: HTMLTextAreaElement | null): void {
		const q = getResolvedQuestion(this.selectedFlavor, this.currentStep);
		this.ensureAnswer(q.id);
		if (textarea) this.answers[q.id].main = textarea.value;
	}

	private ensureAnswer(qId: string): void {
		if (!this.answers[qId]) this.answers[qId] = { main: "", sub: {} };
	}

	// ---- AI Approval Watcher ----

	private setupApprovalWatcher(
		qId: string,
		hintArea: HTMLElement,
		approvalArea: HTMLElement,
		mainTextarea: HTMLTextAreaElement | null,
		subContainer: HTMLElement | null,
	): void {
		this.showWatchingState(approvalArea, "idle");
		this.showWatchingState(hintArea, "idle");

		const THIN_THRESHOLD = 5;

		// Collect all input fields with labels
		const inputFields: { el: HTMLInputElement | HTMLTextAreaElement; label: string; id: string }[] = [];
		if (subContainer) {
			const q = getResolvedQuestion(this.selectedFlavor, this.currentStep);
			const inputs = subContainer.querySelectorAll<HTMLInputElement>(".mwp-sub-input");
			inputs.forEach((input, i) => {
				inputFields.push({ el: input, label: q.sub[i]?.label || "", id: q.sub[i]?.id || "" });
			});
		}
		if (mainTextarea) {
			inputFields.push({ el: mainTextarea, label: "自由記述", id: "main" });
		}

		let focusedIdx = -1;

		// ---- Hint logic (independent timer) ----

		const findHintTarget = (): { label: string; explicit: boolean } | null => {
			// Priority 1: focused field is empty/thin
			if (focusedIdx >= 0 && focusedIdx < inputFields.length) {
				const f = inputFields[focusedIdx];
				if ([...f.el.value.trim()].length < THIN_THRESHOLD) {
					return { label: f.label, explicit: false };
				}
			}

			// Priority 2: another field is empty/thin
			for (const f of inputFields) {
				if ([...f.el.value.trim()].length < THIN_THRESHOLD) {
					return { label: f.label, explicit: true };
				}
			}

			// All fields sufficient
			return null;
		};

		const restartHintTimer = () => {
			if (this.hintTimer) clearTimeout(this.hintTimer);
			this.hintTimer = setTimeout(() => {
				const target = findHintTarget();
				if (target) {
					void this.fireHint(qId, hintArea, target.label, target.explicit);
				}
			}, 5000);
		};

		// ---- Approval logic (independent timer) ----

		const triggerApprovalCheck = () => {
			if (this.approvalTimer) clearTimeout(this.approvalTimer);
			if (this.approvalDismissTimer) clearTimeout(this.approvalDismissTimer);

			const hasComment = approvalArea.querySelector(".mwp-approval-bubble");
			if (hasComment) {
				this.approvalDismissTimer = setTimeout(() => {
					approvalArea.addClass("fade-out");
					approvalArea.removeClass("visible");
					setTimeout(() => {
						approvalArea.removeClass("fade-out");
						this.clearDotInterval(approvalArea);
						this.showWatchingState(approvalArea, "typing");
					}, 500);
				}, 2000);
			} else {
				this.clearDotInterval(approvalArea);
				this.showWatchingState(approvalArea, "typing");
			}

			this.approvalTimer = setTimeout(() => {
				void this.fireApproval(qId, approvalArea);
			}, 3000);
		};

		// ---- Wire up events ----

		for (let i = 0; i < inputFields.length; i++) {
			const field = inputFields[i];

			field.el.addEventListener("focus", () => {
				focusedIdx = i;
				// Restart hint timer on focus change
				restartHintTimer();
			});

			field.el.addEventListener("input", () => {
				// Approval: restart timer
				triggerApprovalCheck();
				// Hint: restart timer (will re-evaluate target after input stops)
				restartHintTimer();
			});
		}

		// Initial hint timer
		const hasContent = this.answers[qId] &&
			(this.answers[qId].main.trim() ||
			 Object.values(this.answers[qId].sub).some((v) => [...v.trim()].length >= THIN_THRESHOLD));
		if (!hasContent) {
			restartHintTimer();
		}
	}

	private async fireHint(qId: string, hintArea: HTMLElement, fieldLabel: string, explicit: boolean): Promise<void> {
		// Show thinking indicator (append, don't clear existing hints)
		const thinkingEl = hintArea.createDiv({ cls: "mwp-approval-watching mwp-hint-thinking-temp" });
		thinkingEl.createSpan({ text: this.guideEmoji, cls: "mwp-approval-icon" });
		const dotSpan = thinkingEl.createSpan({ cls: "mwp-approval-dots-js" });
		const textSpan = thinkingEl.createSpan({ cls: "mwp-approval-watch-text" });
		textSpan.setText(t.museThinking(this.guideName));
		let dotCount = 0;
		const dotInterval = setInterval(() => {
			dotCount = (dotCount + 1) % 4;
			dotSpan.setText(".".repeat(dotCount));
		}, 500);
		hintArea.addClass("visible");

		const flavor = FLAVORS.find((f) => f.id === this.selectedFlavor);
		const flavorName = flavor?.name || (lang === "ja" ? "ベース" : "Base");

		const existingAnswers = this.answers[qId] || { main: "", sub: {} };

		let prompt = buildHintPrompt(qId, flavorName, existingAnswers, this.answers, this.selectedFlavor, this.guideName);
		if (lang === "ja") {
			if (explicit) {
				prompt += `\n\n「${fieldLabel}」のフィールドについてヒントをください。最初にどのフィールドについて話しているか、あなたらしい口調で軽く触れてから本題に入ってください。`;
			} else {
				prompt += `\n\n「${fieldLabel}」のフィールドについてヒントをください。`;
			}
		} else {
			if (explicit) {
				prompt += `\n\nGive a hint about the "${fieldLabel}" field. Briefly mention which field you're addressing in your own voice, then give the hint.`;
			} else {
				prompt += `\n\nGive a hint about the "${fieldLabel}" field.`;
			}
		}

		const result = await callAi(this.app, {
			system: getMuseHintSystem(this.personaPrompt),
			message: prompt,
			maxTokens: 300,
		});

		// Remove thinking indicator
		clearInterval(dotInterval);
		thinkingEl.remove();

		if (!this.contentEl_) return;

		if (result?.ok && result.text) {
			// Enforce max 3 hints: remove oldest if needed
			const existingBubbles = hintArea.querySelectorAll(".mwp-approval-bubble");
			if (existingBubbles.length >= 3) {
				const oldest = existingBubbles[0] as HTMLElement;
				oldest.addClass("mwp-fade-out-quick");
				setTimeout(() => oldest.remove(), 300);
			}

			const bubble = hintArea.createDiv({ cls: "mwp-approval-bubble mwp-hint-bubble mwp-clickable" });
			bubble.createSpan({ text: this.guideEmoji, cls: "mwp-approval-icon" });
			bubble.createSpan({ text: this.stripTags(result.text), cls: "mwp-approval-text" });
			bubble.setAttribute("aria-label", t.hintRetry);
			hintArea.addClass("visible");

			// Click to regenerate
			bubble.addEventListener("click", () => {
				void this.fireHint(qId, hintArea, fieldLabel, explicit);
			});
		}
	}

	private showWatchingState(area: HTMLElement, state: "idle" | "typing" | "thinking"): void {
		area.empty();
		area.removeClass("visible");
		area.removeClass("sliding-out");

		if (state === "idle") return;

		const wrap = area.createDiv({ cls: "mwp-approval-watching" });
		wrap.createSpan({ text: this.guideEmoji, cls: "mwp-approval-icon" });
		const textSpan = wrap.createSpan({ cls: "mwp-approval-watch-text" });
		const baseText = state === "typing" ? t.museWatching(this.guideName) : t.museThinking(this.guideName);
		textSpan.setText(baseText);

		// JS-driven dot animation
		const dotSpan = wrap.createSpan({ cls: "mwp-approval-dots-js" });
		let dotCount = 0;
		const dotInterval = setInterval(() => {
			dotCount = (dotCount + 1) % 4;
			dotSpan.setText(".".repeat(dotCount));
		}, 500);

		// Store interval so we can clear it when area is emptied
		dotIntervalMap.set(area, dotInterval);

		area.addClass("visible");
	}

	private clearDotInterval(area: HTMLElement): void {
		const interval = dotIntervalMap.get(area);
		if (interval) { clearInterval(interval); dotIntervalMap.delete(area); }
	}

	private async fireApproval(qId: string, approvalArea: HTMLElement): Promise<void> {
		const answer = this.answers[qId];
		if (!answer) return;

		// Check if there's actual content
		const hasContent = answer.main.trim() ||
			Object.values(answer.sub).some((v) => v.trim());
		if (!hasContent) {
			this.showWatchingState(approvalArea, "idle");
			return;
		}

		// Build input fingerprint to avoid duplicate calls
		const fingerprint = JSON.stringify(answer);
		if (fingerprint === this.approvalLastInput) return;

		// Show thinking state
		this.showWatchingState(approvalArea, "thinking");

		// Cancel previous in-flight request
		if (this.approvalAbort) this.approvalAbort.abort();
		this.approvalAbort = new AbortController();

		const prompt = buildApprovalPrompt(qId, answer, this.answers, this.selectedFlavor);

		// Scale maxTokens based on input length (increased for deepening question)
		const inputLen = JSON.stringify(answer).length;
		const maxTokens = inputLen < 40 ? 150 : inputLen < 120 ? 200 : inputLen < 300 ? 300 : 400;

		const result = await callAi(this.app, {
			system: getMuseSystem(this.personaPrompt),
			message: prompt,
			maxTokens,
		});

		// Check if we were cancelled (user navigated away)
		if (!this.contentEl_) return;

		if (result?.ok && result.text) {
			this.approvalLastInput = fingerprint;
			this.clearDotInterval(approvalArea);
			approvalArea.empty();
			approvalArea.removeClass("fade-out");
			const bubble = approvalArea.createDiv({ cls: "mwp-approval-bubble" });
			bubble.createSpan({ text: this.guideEmoji, cls: "mwp-approval-icon" });
			bubble.createSpan({ text: this.stripTags(result.text), cls: "mwp-approval-text" });
			approvalArea.addClass("visible");
		} else {
			this.showWatchingState(approvalArea, "idle");
		}
	}

	private cancelApproval(): void {
		if (this.approvalTimer) { clearTimeout(this.approvalTimer); this.approvalTimer = null; }
		if (this.approvalDismissTimer) { clearTimeout(this.approvalDismissTimer); this.approvalDismissTimer = null; }
		if (this.hintTimer) { clearTimeout(this.hintTimer); this.hintTimer = null; }
		if (this.approvalAbort) { this.approvalAbort.abort(); this.approvalAbort = null; }
		this.approvalLastInput = "";
	}

	// ---- Complete View ----

	private renderComplete(container: HTMLElement): void {
		const header = container.createDiv({ cls: "mwp-complete-header" });

		const iconWrap = header.createDiv({ cls: "mwp-complete-icon-wrap" });
		iconWrap.createSpan({ text: "\u2727", cls: "mwp-sparkle mwp-sparkle-1" });
		iconWrap.createSpan({ text: this.guideEmoji, cls: "mwp-complete-moon" });
		iconWrap.createSpan({ text: "\u2727", cls: "mwp-sparkle mwp-sparkle-2" });
		iconWrap.createSpan({ text: "\u2726", cls: "mwp-sparkle mwp-sparkle-3" });

		header.createDiv({ text: t.completeTitle, cls: "mwp-complete-title" });
		const title = this.plotTitle || t.untitled;
		const flavorName = FLAVORS.find((f) => f.id === this.selectedFlavor)?.name || "";
		header.createEl("p", { text: `\u300c${title}\u300d \u2014 ${flavorName}`, cls: "mwp-complete-meta" });
		header.createEl("p", { text: t.completeSubtitle, cls: "mwp-complete-sub" });

		// Inline-editable summary (accordion)
		const list = container.createDiv({ cls: "mwp-summary-list" });
		let openIndex: number = -1;

		const renderItems = () => {
			list.empty();
			for (let i = 0; i < BASE_QUESTIONS.length; i++) {
				const q = getResolvedQuestion(this.selectedFlavor, i);
				const ans = this.answers[q.id] || { main: "", sub: {} };
				const isOpen = openIndex === i;

				const item = list.createDiv({ cls: "mwp-summary-item" + (isOpen ? " open" : "") });
				const row = item.createDiv({ cls: "mwp-summary-row" });
				row.createSpan({ text: q.icon, cls: "mwp-summary-icon" });

				const display = this.getSummaryText(q, ans);
				row.createSpan({
					text: display.length > 50 ? display.substring(0, 50) + "\u2026" : display,
					cls: "mwp-summary-text",
				});

				if (isOpen) {
					const editor = item.createDiv({ cls: "mwp-summary-editor" });

					const miniPrompt = editor.createDiv({ cls: "mwp-mini-prompt" });
					miniPrompt.createSpan({ text: t.museName(this.guideEmoji, this.guideName), cls: "mwp-bubble-name" });
					miniPrompt.createEl("p", { text: q.prompt.split("\n")[0], cls: "mwp-mini-prompt-text" });

					if (q.sub.length > 0) {
						for (const sub of q.sub) {
							const field = editor.createDiv({ cls: "mwp-sub-field" });
							field.createEl("label", { text: sub.label });
							const input = field.createEl("input", {
								cls: "mwp-sub-input",
								attr: { type: "text", placeholder: sub.placeholder, value: ans.sub[sub.id] || "" },
							});
							input.addEventListener("input", () => {
								this.ensureAnswer(q.id);
								this.answers[q.id].sub[sub.id] = input.value;
							});
						}
					}

					const ta = editor.createEl("textarea", {
						cls: "mwp-textarea mwp-textarea-sm",
						attr: { placeholder: t.inputPlaceholder, rows: "3" },
					});
					ta.value = ans.main;
					ta.addEventListener("input", () => {
						this.ensureAnswer(q.id);
						this.answers[q.id].main = ta.value;
					});

					const btns = editor.createDiv({ cls: "mwp-editor-btns" });
					const okBtn = btns.createEl("button", { text: t.updateBtn, cls: "mwp-btn-primary mwp-btn-sm" });
					okBtn.addEventListener("click", () => {
						openIndex = -1;
						void this.saveSession();
						renderItems();
					});
					const cancelBtn = btns.createEl("button", { text: t.cancelBtn, cls: "mwp-btn-secondary mwp-btn-sm" });
					cancelBtn.addEventListener("click", () => {
						openIndex = -1;
						renderItems();
					});
				} else {
					row.addEventListener("click", () => {
						openIndex = i;
						renderItems();
					});
					row.addClass("clickable");
				}
			}
		};
		renderItems();

		// Phase B: Muse Diagnosis
		if (isAiAvailable(this.app)) {
			const diagSection = container.createDiv({ cls: "mwp-diagnosis-section" });
			const diagHeader = diagSection.createDiv({ cls: "mwp-diagnosis-header" });
			diagHeader.createSpan({ text: this.guideEmoji, cls: "mwp-approval-icon" });
			diagHeader.createSpan({ text: t.diagTitle(this.guideName) });

			const diagContent = diagSection.createDiv({ cls: "mwp-diagnosis-content" });

			if (this.diagnosisResult) {
				// Use cached result
				this.renderDiagnosisResult(diagContent, this.diagnosisResult);
			} else {
				diagContent.createDiv({ cls: "mwp-diagnosis-loading", text: t.diagLoading(this.guideName) });
				void this.fireDiagnosis(diagContent);
			}
		}

		// Actions
		const actions = container.createDiv({ cls: "mwp-actions" });

		const saveBtn = actions.createEl("button", { text: t.saveMd, cls: "mwp-btn-primary" });
		saveBtn.addEventListener("click", () => {
			this.renderSaveDialog(actions, saveBtn);
		});

		if (this.savedFilePath) {
			const openBtn = actions.createEl("button", { text: t.openFile, cls: "mwp-btn-accent" });
			openBtn.addEventListener("click", () => {
				if (this.savedFilePath) void this.app.workspace.openLinkText(this.savedFilePath, "", false);
			});
			actions.createDiv({ cls: "mwp-file-path", text: this.savedFilePath });
		}

		const closeBtn = actions.createEl("button", { text: t.close, cls: "mwp-btn-secondary mwp-btn-full" });
		closeBtn.addEventListener("click", () => {
			if (!this.savedFilePath) {
				this.renderUnsavedWarning(actions, closeBtn);
			} else {
				void this.clearSession().then(() => {
					this.resetState();
					this.showView("start");
				});
			}
		});
	}

	private renderUnsavedWarning(container: HTMLElement, triggerBtn: HTMLElement, returnView?: ViewMode): void {
		triggerBtn.remove();
		const warn = container.createDiv({ cls: "mwp-unsaved-warning" });
		warn.createEl("p", { text: t.unsavedWarning, cls: "mwp-warn-text" });
		const btns = warn.createDiv({ cls: "mwp-resume-btns" });
		const yesBtn = btns.createEl("button", { text: t.unsavedYes, cls: "mwp-btn-secondary mwp-btn-half" });
		yesBtn.addEventListener("click", () => {
			this.cancelApproval();
			void this.clearSession().then(() => {
				this.resetState();
				this.showView("start");
			});
		});
		const noBtn = btns.createEl("button", { text: t.unsavedNo, cls: "mwp-btn-accent mwp-btn-half" });
		noBtn.addEventListener("click", () => {
			this.showView(returnView || "complete");
		});
	}

	private getSummaryText(q: typeof BASE_QUESTIONS[number], ans: AnswerData): string {
		if (q.sub.length > 0) {
			const parts = q.sub.map((s) => ans.sub[s.id]).filter(Boolean);
			if (parts.length > 0) return parts.join(" / ");
		}
		if (ans.main) return ans.main;
		return t.noInput;
	}

	private renderSaveDialog(container: HTMLElement, triggerBtn: HTMLElement): void {
		triggerBtn.remove();
		const dialog = container.createDiv({ cls: "mwp-save-dialog" });
		dialog.createEl("label", { text: t.saveNameLabel, cls: "mwp-section-label" });
		const input = dialog.createEl("input", {
			cls: "mwp-text-input",
			attr: { type: "text", placeholder: t.plotNamePlaceholder, value: this.plotTitle },
		});
		// Auto focus
		setTimeout(() => input.focus(), 50);

		const btns = dialog.createDiv({ cls: "mwp-resume-btns" });
		const saveConfirm = btns.createEl("button", { text: t.saveMd, cls: "mwp-btn-primary mwp-btn-half" });

		const doSave = async (overwrite: boolean) => {
			this.plotTitle = input.value;
			const path = await saveAndOpenPlot(
				this.app,
				this.saveFolder,
				this.plotTitle,
				this.selectedFlavor,
				this.answers,
				this.diagnosisResult,
				{ emoji: this.guideEmoji, name: this.guideName },
				overwrite,
			);
			if (path) {
				this.savedFilePath = path;
				await this.clearSession();
				this.showView("complete");
			}
		};

		saveConfirm.addEventListener("click", () => {
			const title = input.value || t.untitled;
			// If titled (not untitled) and file exists, ask overwrite
			if (input.value.trim() && plotFileExists(this.app, this.saveFolder, title)) {
				this.renderOverwriteConfirm(dialog, title, doSave);
			} else {
				void doSave(false);
			}
		});

		const cancelSave = btns.createEl("button", { text: t.cancelBtn, cls: "mwp-btn-secondary mwp-btn-half" });
		cancelSave.addEventListener("click", () => {
			this.showView("complete");
		});

		// Enter key to save
		input.addEventListener("keydown", (e: KeyboardEvent) => {
			if (e.key === "Enter") saveConfirm.click();
		});
	}

	private renderOverwriteConfirm(
		dialog: HTMLElement,
		title: string,
		doSave: (overwrite: boolean) => Promise<void>,
	): void {
		// Replace dialog content with overwrite prompt
		dialog.empty();
		dialog.createEl("p", { text: t.overwriteConfirm(title), cls: "mwp-warn-text" });
		const btns = dialog.createDiv({ cls: "mwp-resume-btns" });
		const overBtn = btns.createEl("button", { text: t.overwriteYes, cls: "mwp-btn-primary mwp-btn-half" });
		overBtn.addEventListener("click", () => { void doSave(true); });
		const newBtn = btns.createEl("button", { text: t.overwriteNo, cls: "mwp-btn-secondary mwp-btn-half" });
		newBtn.addEventListener("click", () => { void doSave(false); });
	}


	// ---- Utils ----

	// Diagnosis result cache for MD export
	private diagnosisResult: { synopsis: string; weaknesses: { questionId: string; label: string; issue: string }[]; suggestions: string[] } | null = null;

	private async fireDiagnosis(container: HTMLElement): Promise<void> {
		const flavor = FLAVORS.find((f) => f.id === this.selectedFlavor);
		const flavorName = flavor?.name || (lang === "ja" ? "ベース" : "Base");

		const prompt = buildDiagnosisPrompt(flavorName, this.answers, this.selectedFlavor);

		const result = await callAi(this.app, {
			system: getMuseDiagnosisSystem(this.personaPrompt),
			message: prompt,
			maxTokens: 2000,
		});

		// If user navigated away during AI call, discard result
		if (this.currentView !== "complete") return;

		container.empty();

		if (!result?.ok || !result.text) {
			console.error("[MWP Diagnosis] AI call failed:", result?.error || "unknown error");
			container.createDiv({ cls: "mwp-diagnosis-error", text: t.diagError });
			this.addDiagRetryButton(container);
			return;
		}

		try {
			const cleaned = result.text
				.replace(/```json\s*/g, "").replace(/```\s*/g, "")
				.replace(/<\/?user_input>/g, "")
				.trim();
			const parsed = JSON.parse(cleaned);

			// Validate diagnosis JSON schema
			const data = this.validateDiagnosis(parsed);
			if (!data) {
				console.error("[MWP Diagnosis] Invalid JSON schema (keys missing or wrong type)");
				container.createDiv({ cls: "mwp-diagnosis-error", text: t.diagError });
				this.addDiagRetryButton(container);
				return;
			}

			this.diagnosisResult = data;
			this.renderDiagnosisResult(container, data);
		} catch (e) {
			// Log only the error type, not the full raw AI response (may contain user content)
			console.error("[MWP Diagnosis] JSON parse failed:", e instanceof Error ? e.message : "unknown");
			container.createDiv({ cls: "mwp-diagnosis-error", text: t.diagError });
			this.addDiagRetryButton(container);
		}
	}

	/**
	 * Validate and sanitize diagnosis JSON from AI response.
	 * Returns null if the structure is invalid.
	 */
	private validateDiagnosis(
		parsed: unknown,
	): { synopsis: string; weaknesses: { questionId: string; label: string; issue: string }[]; suggestions: string[] } | null {
		if (!parsed || typeof parsed !== "object") return null;
		const obj = parsed as Record<string, unknown>;

		// synopsis: must be string
		if (typeof obj.synopsis !== "string") return null;
		let synopsis = obj.synopsis;
		if (synopsis.length > 3000) synopsis = synopsis.slice(0, 3000);

		// weaknesses: must be array
		if (!Array.isArray(obj.weaknesses)) return null;
		const weaknesses = obj.weaknesses.filter(
			(w: unknown): w is { questionId: string; label: string; issue: string } =>
				!!w &&
				typeof w === "object" &&
				typeof (w as Record<string, unknown>).questionId === "string" &&
				typeof (w as Record<string, unknown>).label === "string" &&
				typeof (w as Record<string, unknown>).issue === "string",
		);

		// suggestions: must be array of strings
		if (!Array.isArray(obj.suggestions)) return null;
		const suggestions = obj.suggestions.filter(
			(s: unknown): s is string => typeof s === "string",
		);

		return { synopsis, weaknesses, suggestions };
	}

	private addDiagRetryButton(container: HTMLElement): void {
		const retryBtn = container.createEl("button", { text: t.diagRetry, cls: "mwp-btn-secondary mwp-btn-sm mwp-diag-retry" });
		retryBtn.addEventListener("click", () => {
			this.diagnosisResult = null;
			container.empty();
			container.createDiv({ cls: "mwp-diagnosis-loading", text: t.diagLoading(this.guideName) });
			void this.fireDiagnosis(container);
		});
	}

	private renderDiagnosisResult(
		container: HTMLElement,
		data: { synopsis: string; weaknesses: { questionId: string; label: string; issue: string }[]; suggestions: string[] },
	): void {
		container.empty();

		if (data.synopsis) {
			const synSec = container.createDiv({ cls: "mwp-diag-block" });
			synSec.createDiv({ cls: "mwp-diag-label", text: t.diagSynopsis });
			synSec.createDiv({ cls: "mwp-diag-text", text: data.synopsis });
		}

		if (data.weaknesses && data.weaknesses.length > 0) {
			const weakSec = container.createDiv({ cls: "mwp-diag-block" });
			weakSec.createDiv({ cls: "mwp-diag-label", text: t.diagWeakness });
			for (const w of data.weaknesses) {
				const item = weakSec.createDiv({ cls: "mwp-diag-item" });
				item.createSpan({ text: `${w.label}`, cls: "mwp-diag-item-label" });
				item.createSpan({ text: w.issue });
			}
		}

		if (data.suggestions && data.suggestions.length > 0) {
			const sugSec = container.createDiv({ cls: "mwp-diag-block" });
			sugSec.createDiv({ cls: "mwp-diag-label", text: t.diagSuggestion });
			for (const s of data.suggestions) {
				sugSec.createDiv({ cls: "mwp-diag-item", text: s });
			}
		}

		this.addDiagRetryButton(container);
	}

	private resetState(): void {
		this.selectedFlavor = "base";
		this.plotTitle = "";
		this.currentStep = 0;
		this.answers = {};
		this.savedFilePath = undefined;
		this.diagnosisResult = null;
	}

	/** Strip internal prompt tags that AI may accidentally echo. */
	private stripTags(text: string): string {
		return text.replace(/<\/?user_input>/g, "").trim();
	}
}

// ============================================================
// Plot file selection modal for Reweave
// ============================================================

interface PlotFileInfo {
	file: TFile;
	title: string;
	flavor: string;
	updated: string;
}

class PlotSelectModal extends SuggestModal<PlotFileInfo> {
	private items: PlotFileInfo[];
	private onSelect: (file: TFile) => void;

	constructor(app: import("obsidian").App, items: PlotFileInfo[], onSelect: (file: TFile) => void) {
		super(app);
		this.items = items;
		this.onSelect = onSelect;
	}

	getSuggestions(query: string): PlotFileInfo[] {
		const lower = query.toLowerCase();
		if (!lower) return this.items;
		return this.items.filter((item) =>
			item.title.toLowerCase().includes(lower) ||
			item.flavor.toLowerCase().includes(lower) ||
			item.file.basename.toLowerCase().includes(lower)
		);
	}

	renderSuggestion(item: PlotFileInfo, el: HTMLElement): void {
		const row = el.createDiv({ cls: "mwp-plot-modal-row" });
		const titleText = item.title || item.file.basename;
		row.createDiv({ cls: "mwp-plot-modal-title", text: titleText });
		const meta = row.createDiv({ cls: "mwp-plot-modal-meta" });
		if (item.flavor) meta.createSpan({ text: item.flavor });
		meta.createSpan({ text: item.updated });
		// Show filename if different from title (e.g. _2, _3 suffixed files)
		if (item.file.basename !== titleText) {
			meta.createSpan({ text: item.file.basename, cls: "mwp-plot-modal-file" });
		}
	}

	onChooseSuggestion(item: PlotFileInfo): void {
		this.onSelect(item.file);
	}
}
