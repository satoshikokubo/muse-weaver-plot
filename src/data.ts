import type { MpcQuestion, Flavor } from "./types";
import { lang } from "./i18n";

// ============================================================
// Bilingual data helpers
// ============================================================
type L<T> = { ja: T; en: T };
function l<T>(pair: L<T>): T { return pair[lang]; }

// ============================================================
// BASE QUESTIONS
// ============================================================

export const BASE_QUESTIONS: MpcQuestion[] = [
	{
		id: "q1",
		label: l({ ja: "\u4e3b\u4eba\u516c\uff08\u5f37\u307f\uff0f\u5f31\u307f\uff0f\u6b20\u843d\uff09", en: "Protagonist (Strength / Weakness / Lack)" }),
		prompt: l({
			ja: "\u3042\u306a\u305f\u306e\u7269\u8a9e\u306e\u4e3b\u4eba\u516c\u306b\u3064\u3044\u3066\u6559\u3048\u3066\u304f\u3060\u3055\u3044\u3002\n\u305d\u306e\u4eba\u306e\u5f37\u3055\u3001\u5f31\u3055\u3001\u305d\u3057\u3066\u307e\u3060\u624b\u306b\u3057\u3066\u3044\u306a\u3044\u3082\u306e\n\u2014\u2014\u305d\u308c\u304c\u7269\u8a9e\u3092\u52d5\u304b\u3059\u529b\u306b\u306a\u308a\u307e\u3059\u3002",
			en: "Tell me about your protagonist.\nTheir strength, their weakness, and what they have yet to obtain\n\u2014\u2014these will set the story in motion.",
		}),
		examples: l({
			ja: [
				"\u66f8\u5e97\u54e1\u306e\u82bd\u8863\u3002\u89b3\u5bdf\u773c\u306f\u92ed\u3044\u304c\u77ed\u6c17\u3067\u885d\u52d5\u7684\u3002\u5bb6\u65cf\u306b\u8a8d\u3081\u3089\u308c\u305f\u3044\u3068\u3044\u3046\u6b20\u843d\u3092\u62b1\u304f\u3002",
				"\u9ad8\u6821\u751f\u306e\u84bc\u592a\u3002\u7d76\u5bfe\u306b\u8ae6\u3081\u306a\u3044\u6839\u6027\u304c\u6b66\u5668\u3060\u304c\u3001\u4eba\u306e\u6c17\u6301\u3061\u3092\u8aad\u3080\u306e\u304c\u82e6\u624b\u3002\u201c\u5c45\u5834\u6240\u201d\u3092\u63a2\u3057\u3066\u3044\u308b\u3002",
				"\u4f1a\u793e\u54e1\u306e\u7f8e\u548c\u3002\u8ad6\u7406\u7684\u601d\u8003\u3068\u4ea4\u6e09\u529b\u3002\u3060\u304c\u4ed6\u4eba\u3092\u4fe1\u7528\u3067\u304d\u305a\u3001\u201c\u672c\u97f3\u3067\u8a71\u305b\u308b\u4eba\u201d\u304c\u3044\u306a\u3044\u3002",
			],
			en: [
				"Mei, a bookshop clerk. Sharp observation but short-tempered. Longs for her family\u2019s approval.",
				"Sota, a high schooler. Unyielding persistence is his weapon, but he struggles to read others\u2019 feelings. Searching for a \u2018place to belong.\u2019",
				"Miwa, an office worker. Logical mind and negotiation skills, but can\u2019t trust anyone. Has no one she can speak her true feelings to.",
			],
		}),
		icon: "\ud83d\udc64",
		sub: l({
			ja: [
				{ id: "strength", label: "\u5f37\u307f", placeholder: "\u4f8b\uff1a\u89b3\u5bdf\u773c" },
				{ id: "weakness", label: "\u5f31\u307f", placeholder: "\u4f8b\uff1a\u77ed\u6c17" },
				{ id: "lack", label: "\u6b20\u843d", placeholder: "\u4f8b\uff1a\u627f\u8a8d" },
			],
			en: [
				{ id: "strength", label: "Strength", placeholder: "e.g. Keen observation" },
				{ id: "weakness", label: "Weakness", placeholder: "e.g. Short-tempered" },
				{ id: "lack", label: "Lack", placeholder: "e.g. Approval" },
			],
		}),
	},
	{
		id: "q2",
		label: l({ ja: "\u30b4\u30fc\u30eb\uff08\u77ed\u671f\uff0f\u6700\u7d42\uff09", en: "Goal (Short-term / Final)" }),
		prompt: l({
			ja: "\u4e3b\u4eba\u516c\u306f\u4f55\u3092\u76ee\u6307\u3057\u3066\u3044\u308b\u306e\u3067\u3057\u3087\u3046\uff1f\n\u307e\u305a\u4f55\u3092\u3057\u305f\u3044\uff1f \u305d\u3057\u3066\u6700\u5f8c\u306b\u3069\u3053\u3078\u305f\u3069\u308a\u7740\u304d\u305f\u3044\uff1f\n\u77ed\u671f\u3068\u6700\u7d42\u3001\u4e8c\u3064\u306e\u30b4\u30fc\u30eb\u3092\u6559\u3048\u3066\u304f\u3060\u3055\u3044\u3002",
			en: "What is your protagonist striving for?\nWhat do they want first? And where do they ultimately want to arrive?\nTell me both the short-term and final goals.",
		}),
		examples: l({
			ja: [
				"\u307e\u305a\u5931\u8e2a\u3057\u305f\u53cb\u4eba\u3092\u898b\u3064\u3051\u305f\u3044\u3002\u6700\u7d42\u7684\u306b\u3001\u5f7c\u5973\u304c\u96a0\u3057\u3066\u3044\u305f\u771f\u5b9f\u3092\u53d7\u3051\u5165\u308c\u3001\u95a2\u4fc2\u3092\u4fee\u5fa9\u3057\u305f\u3044\u3002",
				"\u307e\u305a\u306f\u4e88\u9078\u7a81\u7834\u3002\u6700\u7d42\u7684\u306b\u306f\u30c1\u30fc\u30e0\u3068\u4e00\u7dd2\u306b\u5168\u56fd\u5927\u4f1a\u3067\u512a\u52dd\u3059\u308b\u3053\u3068\u3002",
			],
			en: [
				"First, find the missing friend. Ultimately, accept the truth she hid and mend their relationship.",
				"First, pass the qualifiers. Ultimately, win the nationals together with the team.",
			],
		}),
		icon: "\ud83c\udfaf",
		sub: l({
			ja: [
				{ id: "short_goal", label: "\u77ed\u671f\u30b4\u30fc\u30eb", placeholder: "\u4f8b\uff1a\u53cb\u4eba\u306e\u6240\u5728\u3092\u7a81\u304d\u6b62\u3081\u308b" },
				{ id: "final_goal", label: "\u6700\u7d42\u30b4\u30fc\u30eb", placeholder: "\u4f8b\uff1a\u771f\u5b9f\u3092\u53d7\u3051\u5165\u308c\u95a2\u4fc2\u3092\u4fee\u5fa9" },
			],
			en: [
				{ id: "short_goal", label: "Short-term Goal", placeholder: "e.g. Find where the friend went" },
				{ id: "final_goal", label: "Final Goal", placeholder: "e.g. Accept truth, mend relationship" },
			],
		}),
	},
	{
		id: "q3",
		label: l({ ja: "\u304d\u3063\u304b\u3051\uff08\u4e8b\u4ef6\uff0f\u51fa\u4f1a\u3044\uff09", en: "Inciting Incident" }),
		prompt: l({
			ja: "\u7269\u8a9e\u304c\u52d5\u304d\u51fa\u3059\u77ac\u9593\u3092\u805e\u304b\u305b\u3066\u304f\u3060\u3055\u3044\u3002\n\u4f55\u304c\u8d77\u304d\u3066\u3001\u4e3b\u4eba\u516c\u306f\u3082\u3046\u5f15\u304d\u8fd4\u305b\u306a\u304f\u306a\u308b\u306e\u3067\u3057\u3087\u3046\uff1f",
			en: "Tell me the moment your story begins to move.\nWhat happens\u2014what makes the protagonist unable to turn back?",
		}),
		examples: l({
			ja: [
				"\u552f\u4e00\u306e\u624b\u639b\u304b\u308a\u3092\u63e1\u308b\u76f8\u624b\u304c\u660e\u65e5\u8857\u3092\u53bb\u308b\u3068\u77e5\u308a\u3001\u82bd\u8863\u306f\u591c\u306e\u56f3\u66f8\u9928\u306b\u5fcd\u3073\u8fbc\u3080\u6c7a\u610f\u3092\u3059\u308b\u3002",
				"\u90e8\u5ba4\u306e\u30c9\u30a2\u3092\u958b\u3051\u305f\u3089\u3001\u898b\u77e5\u3089\u306c\u5c11\u5973\u304c\u201c\u52a9\u3051\u3066\u201d\u3068\u66f8\u304b\u308c\u305f\u7d19\u3092\u63e1\u3063\u3066\u7acb\u3063\u3066\u3044\u305f\u3002",
			],
			en: [
				"Learning that the only lead is leaving town tomorrow, Mei resolves to sneak into the library at night.",
				"Opening the door, a stranger stands holding a note that reads \u2018help me.\u2019",
			],
		}),
		icon: "\u26a1",
		sub: [],
	},
	{
		id: "q4",
		label: l({ ja: "\u969c\u5bb3\uff08\u5916\u7684\uff0f\u5185\u7684\uff09", en: "Obstacles (External / Internal)" }),
		prompt: l({
			ja: "\u4e3b\u4eba\u516c\u3092\u963b\u3080\u3082\u306e\u306f\u4f55\u3067\u3057\u3087\u3046\uff1f\n\u5916\u304b\u3089\u306e\u969c\u5bb3\u3068\u3001\u5fc3\u306e\u4e2d\u306e\u969c\u5bb3\u2014\u2014\n\u3069\u3061\u3089\u3082\u6559\u3048\u3066\u304f\u3060\u3055\u3044\u3002",
			en: "What stands in the protagonist\u2019s way?\nExternal obstacles and obstacles within their heart\u2014\nplease tell me both.",
		}),
		examples: l({
			ja: [
				"\u5916\u7684\uff1d\u9589\u9928\u5f8c\u306e\u8b66\u5099\u30b7\u30b9\u30c6\u30e0\uff0f\u5185\u7684\uff1d\u8b66\u5831\u97f3\u306b\u4f3c\u305f\u97f3\u3078\u306e\u904e\u654f\u3002",
				"\u5916\u7684\uff1d\u30c1\u30fc\u30e0\u306e\u30a8\u30fc\u30b9\u304c\u8ca0\u50b7\u96e2\u8131\uff0f\u5185\u7684\uff1d\u201c\u81ea\u5206\u304c\u30ea\u30fc\u30c0\u30fc\u306b\u3075\u3055\u308f\u3057\u3044\u306e\u304b\u201d\u3068\u3044\u3046\u81ea\u4fe1\u306e\u306a\u3055\u3002",
			],
			en: [
				"External: Security system after closing / Internal: Hypersensitivity to alarm-like sounds.",
				"External: The team\u2019s ace is injured / Internal: Self-doubt about deserving to be leader.",
			],
		}),
		icon: "\ud83e\uddf1",
		sub: l({
			ja: [
				{ id: "external", label: "\u5916\u7684\u969c\u5bb3", placeholder: "\u4f8b\uff1a\u8b66\u5099\u30b7\u30b9\u30c6\u30e0" },
				{ id: "internal", label: "\u5185\u7684\u969c\u5bb3", placeholder: "\u4f8b\uff1a\u904e\u654f" },
			],
			en: [
				{ id: "external", label: "External Obstacle", placeholder: "e.g. Security system" },
				{ id: "internal", label: "Internal Obstacle", placeholder: "e.g. Hypersensitivity" },
			],
		}),
	},
	{
		id: "q5",
		label: l({ ja: "\u5bfe\u7acb\u76f8\u624b\uff0f\u529b\uff08\u8ab0\u30fb\u4f55\u30fb\u306a\u305c\uff09", en: "Antagonist / Force (Who, What, Why)" }),
		prompt: l({
			ja: "\u4e3b\u4eba\u516c\u3068\u5bfe\u7acb\u3059\u308b\u306e\u306f\u8ab0\u3001\u3042\u308b\u3044\u306f\u4f55\u3067\u3057\u3087\u3046\uff1f\n\u305d\u306e\u76f8\u624b\u306b\u3082\u300c\u6b63\u3057\u3044\u7406\u7531\u300d\u3092\u4e00\u3064\u6301\u305f\u305b\u3066\u307f\u3066\u304f\u3060\u3055\u3044\u3002\n\u60aa\u5f79\u306b\u3082\u7269\u8a9e\u304c\u3042\u308b\u3068\u3001\u5bfe\u7acb\u306b\u6df1\u307f\u304c\u751f\u307e\u308c\u307e\u3059\u3002",
			en: "Who or what opposes the protagonist?\nTry giving that opponent one \u2018justifiable reason\u2019 of their own.\nVillains with their own stories make for deeper conflict.",
		}),
		examples: l({
			ja: [
				"\u56f3\u66f8\u9928\u306e\u7406\u4e8b\u4f1a\u3002\u4fdd\u5b58\u7b2c\u4e00\u306e\u65b9\u91dd\u3086\u3048\u306b\u95b2\u89a7\u5236\u9650\u306f\u6b63\u5f53\u3001\u3068\u4e3b\u5f35\u3059\u308b\u3002",
				"\u76e3\u7763\u306e\u9ad8\u6a4b\u3002\u52dd\u3064\u305f\u3081\u306b\u53a8\u3057\u3044\u7df4\u7fd2\u3092\u8ab2\u3059\u304c\u3001\u305d\u308c\u306f\u201c\u904e\u53bb\u306b\u81ea\u5206\u304c\u6319\u631f\u3057\u305f\u5f8c\u6094\u201d\u304b\u3089\u6765\u3066\u3044\u308b\u3002",
			],
			en: [
				"The library board. They insist restricted access is justified to preserve the collection.",
				"Coach Takahashi. His grueling practice comes from regret over his own past failure.",
			],
		}),
		icon: "\u2694\ufe0f",
		sub: [],
	},
	{
		id: "q6",
		label: l({ ja: "\u4f5c\u6226\uff08\u3069\u3046\u9032\u3081\u308b\u304b\uff09", en: "Strategy (How to Proceed)" }),
		prompt: l({
			ja: "\u30b4\u30fc\u30eb\u3078\u9032\u3080\u5177\u4f53\u7684\u306a\u6bb5\u53d6\u308a\u3092\u805e\u304b\u305b\u3066\u304f\u3060\u3055\u3044\u3002\n2\u301c3\u30b9\u30c6\u30c3\u30d7\u3067\u3001\u884c\u52d5\u306e\u52d5\u8a5e\u3067\u66f8\u3044\u3066\u307f\u3066\u304f\u3060\u3055\u3044\u3002",
			en: "Please tell me the concrete steps toward the goal.\nIf you can, describe 2\u20133 steps using action verbs.",
		}),
		examples: l({
			ja: [
				"\u95a2\u4fc2\u8005\u306e\u8a3c\u8a00\u3092\u96c6\u3081\u2192\u77db\u76fe\u70b9\u3092\u8a18\u9332\u2192\u9589\u67b6\u306b\u6f5c\u5165\u3057\u8a3c\u62e0\u3092\u78ba\u4fdd\u3059\u308b\u3002",
				"\u307e\u305a\u500b\u4eba\u7df4\u7fd2\u3067\u5f31\u70b9\u3092\u514b\u670d\u2192\u7d05\u767d\u6226\u3067\u30ec\u30ae\u30e5\u30e9\u30fc\u3092\u596a\u3046\u2192\u5168\u56fd\u5927\u4f1a\u3067\u30c1\u30fc\u30e0\u306e\u7d46\u3092\u793a\u3059\u3002",
			],
			en: [
				"Gather witness statements \u2192 record contradictions \u2192 sneak into the archive to secure evidence.",
				"Overcome weakness in solo practice \u2192 earn the regular spot in scrimmage \u2192 show team unity at nationals.",
			],
		}),
		icon: "\ud83d\udccb",
		sub: [],
	},
	{
		id: "q7",
		label: l({ ja: "\u4e2d\u592e\u306e\u8ee2\u63db\uff08\u524d\u63d0\u5d29\u3057\uff09", en: "Midpoint Twist" }),
		prompt: l({
			ja: "\u7269\u8a9e\u306e\u524d\u63d0\u3092\u8986\u3059\u4e8b\u5b9f\u306f\u4f55\u3067\u3057\u3087\u3046\uff1f\n\u300c\u5b9f\u306f\u301c\u3060\u3063\u305f\u300d\u300c\u301c\u306f\u624b\u6bb5\u306b\u904e\u304e\u306a\u304b\u3063\u305f\u300d\n\u3053\u306e\u4e00\u8a00\u304c\u3001\u7269\u8a9e\u3092\u4e00\u5909\u3055\u305b\u307e\u3059\u3002",
			en: "What fact overturns the story\u2019s premise?\n\u2018Actually, it was\u2026\u2019 \u2018That was merely a means to\u2026\u2019\nThis is the moment that changes everything.",
		}),
		examples: l({
			ja: [
				"\u5931\u8e2a\u306f\u8a98\u62d0\u3067\u306f\u306a\u304f\u3001\u53cb\u4eba\u81ea\u3089\u306e\u5931\u8e2a\u8a08\u753b\u3060\u3063\u305f\u3068\u5224\u660e\u3059\u308b\u3002",
				"\u76e3\u7763\u306e\u53a8\u3057\u3055\u306f\u201c\u611b\u201d\u3067\u306f\u306a\u304f\u3001\u304b\u3064\u3066\u306e\u81ea\u5206\u306e\u5931\u6557\u3092\u4e3b\u4eba\u516c\u306b\u91cd\u306d\u3066\u3044\u305f\u3060\u3051\u3060\u3063\u305f\u3002",
			],
			en: [
				"The disappearance wasn\u2019t abduction\u2014the friend planned it herself.",
				"The coach\u2019s strictness wasn\u2019t love\u2014he was just projecting his own past failure onto the protagonist.",
			],
		}),
		icon: "\ud83d\udd00",
		sub: [],
	},
	{
		id: "q8",
		label: l({ ja: "\u3069\u3093\u5e95\uff08\u6700\u5927\u306e\u5931\u6557\u30fb\u4ee3\u511f\uff09", en: "Rock Bottom (Greatest Failure / Cost)" }),
		prompt: l({
			ja: "\u6700\u3082\u5927\u304d\u306a\u5931\u6557\u306f\u4f55\u3067\u3057\u3087\u3046\uff1f\n\u305d\u3057\u3066\u4f55\u3092\u5931\u3044\u307e\u3057\u305f\u304b\uff1f\n\u7269\u54c1\u3001\u4fe1\u983c\u3001\u81ea\u7531\u3001\u6642\u9593\u2026\u2026\u805e\u304b\u305b\u3066\u304f\u3060\u3055\u3044\u3002",
			en: "What is the greatest failure?\nWhat was lost? Possessions, trust, freedom, time\u2026\nplease tell me.",
		}),
		examples: l({
			ja: [
				"\u4fb5\u5165\u304c\u767a\u899a\u3057\u3001\u82bd\u8863\u306f\u30a2\u30af\u30bb\u30b9\u6a29\u3092\u5265\u596a\u3001\u53cb\u4eba\u306e\u5bb6\u65cf\u304b\u3089\u3082\u62d2\u7d76\u3055\u308c\u308b\u3002",
				"\u5168\u56fd\u5927\u4f1a\u76f4\u524d\u306b\u30c1\u30fc\u30e0\u5185\u306e\u4e0d\u548c\u304c\u7206\u767a\u3057\u3001\u30a8\u30fc\u30b9\u304c\u201c\u3082\u3046\u3064\u3044\u3066\u3044\u3051\u306a\u3044\u201d\u3068\u8a00\u3044\u6b8b\u3057\u53bb\u308b\u3002",
			],
			en: [
				"The break-in is discovered. Mei loses access and is rejected by her friend\u2019s family.",
				"Right before nationals, the team fractures and the ace walks out saying \u2018I can\u2019t do this anymore.\u2019",
			],
		}),
		icon: "\ud83d\udc80",
		sub: [],
	},
	{
		id: "q9",
		label: l({ ja: "\u6c7a\u65ad\u3068\u30af\u30e9\u30a4\u30de\u30c3\u30af\u30b9", en: "Decision & Climax" }),
		prompt: l({
			ja: "\u4e3b\u4eba\u516c\u304c\u6700\u5f8c\u306b\u9078\u3076\u306e\u306f\u4f55\u3067\u3057\u3087\u3046\uff1f\n\u4f55\u3092\u6368\u3066\u3066\u3001\u4f55\u3092\u9078\u3076\u306e\u304b\u2014\u2014\n\u305d\u306e\u6c7a\u65ad\u306e\u77ac\u9593\u3092\u3001\u4e00\u6587\u3067\u6559\u3048\u3066\u304f\u3060\u3055\u3044\u3002",
			en: "What does the protagonist choose in the end?\nWhat do they sacrifice, and what do they choose?\nDescribe that decisive moment in one sentence.",
		}),
		examples: l({
			ja: [
				"\u8a55\u5224\u3092\u6368\u3066\u544a\u767a\u3092\u9078\u3073\u3001\u7406\u4e8b\u4f1a\u306e\u4e0d\u6b63\u3092\u516c\u8868\u3059\u308b\u3002",
				"\u52dd\u5229\u3088\u308a\u3082\u4ef2\u9593\u3092\u9078\u3073\u3001\u5168\u56fd\u5927\u4f1a\u306e\u821e\u53f0\u3067\u30a8\u30fc\u30b9\u306b\u201c\u304a\u524d\u304c\u5fc5\u8981\u3060\u201d\u3068\u544a\u3052\u308b\u3002",
			],
			en: [
				"Sacrificing her reputation, Mei chooses to expose the board\u2019s corruption.",
				"Choosing comrades over victory, he tells the ace \u2018I need you\u2019 on the nationals stage.",
			],
		}),
		icon: "\u2696\ufe0f",
		sub: [],
	},
	{
		id: "q10",
		label: l({ ja: "\u4f59\u97fb\uff0f\u30c6\u30fc\u30de\uff08\u3069\u3046\u5909\u308f\u3063\u305f\u304b\uff09", en: "Afterglow / Theme (How They Changed)" }),
		prompt: l({
			ja: "\u4e3b\u4eba\u516c\u306f\u3069\u3046\u5909\u308f\u308a\u307e\u3057\u305f\u304b\uff1f\n\u7269\u8a9e\u306e\u4e3b\u984c\u3092\u4e00\u8a00\u3067\u2014\u2014\n\u300c\u301c\u3060\u3063\u305f\u5f7c/\u5f7c\u5973\u304c\u3001\u301c\u3067\u304d\u308b\u3088\u3046\u306b\u306a\u3063\u305f\u300d\n\u3042\u306a\u305f\u306e\u7269\u8a9e\u306e\u7d50\u672b\u3092\u6559\u3048\u3066\u304f\u3060\u3055\u3044\u3002",
			en: "How did the protagonist change?\nExpress the theme in one line:\n\u2018They who were ___, now can ___.\u2019\nTell me how your story ends.",
		}),
		examples: l({
			ja: [
				"\u627f\u8a8d\u3092\u6c42\u3081\u7d9a\u3051\u305f\u82bd\u8863\u306f\u3001\u81ea\u3089\u9078\u3093\u3060\u5b64\u7acb\u306e\u4e2d\u3067\u3082\u8a87\u308a\u3092\u6301\u3064\u3053\u3068\u3092\u5b66\u3076\u2014\u2014\u4e3b\u984c\u306f\u201c\u8aa0\u5b9f\u201d\u3002",
				"\u52dd\u3061\u306b\u3053\u3060\u308f\u3063\u3066\u3044\u305f\u84bc\u592a\u306f\u3001\u4ef2\u9593\u3068\u5171\u306b\u6226\u3046\u559c\u3073\u3092\u77e5\u308b\u2014\u2014\u4e3b\u984c\u306f\u201c\u7d46\u201d\u3002",
			],
			en: [
				"Mei, who always sought approval, learns to take pride in her choices even in solitude. Theme: \u2018Integrity.\u2019",
				"Sota, who was obsessed with winning, discovers the joy of fighting alongside his team. Theme: \u2018Bonds.\u2019",
			],
		}),
		icon: "\ud83c\udf05",
		sub: [],
	},
];

// ============================================================
// FLAVORS
// ============================================================

export const FLAVORS: Flavor[] = [
	{ id: "base", name: l({ ja: "\u30d9\u30fc\u30b9\uff08\u30b8\u30e3\u30f3\u30eb\u4e0d\u554f\uff09", en: "Base (Any Genre)" }), locked: false },
	{
		id: "isekai",
		name: l({ ja: "\u7570\u4e16\u754c\u30d5\u30a1\u30f3\u30bf\u30b8\u30fc", en: "Isekai Fantasy" }),
		locked: false,
		overrides: {
			q1: {
				label: l({ ja: "主人公（出自／クラス／スキル）", en: "Protagonist (Origin / Class / Skill)" }),
				prompt: l({ ja: "あなたの主人公はどんな存在でしょう？\n転生、召喚、転移……どのようにしてその世界に降り立ちましたか？\nクラスやスキル、そして力の代償も教えてください。", en: "How did your protagonist arrive in this world?\nReincarnation, summoning, or transfer?\nPlease tell me about their class, their skills, and the price they pay for power." }),
				sub: [
					{ id: "origin_type", label: l({ ja: "出自", en: "Origin" }), placeholder: l({ ja: "例：転生", en: "e.g. Reincarnation" }) },
					{ id: "class", label: l({ ja: "初期クラス/役割", en: "Starting Class" }), placeholder: l({ ja: "例：文官見習い", en: "e.g. Scribe apprentice" }) },
					{ id: "starter_boost", label: l({ ja: "初期恩恵/スキル", en: "Starting Skill" }), placeholder: l({ ja: "例：鑑定", en: "e.g. Appraisal" }) },
					{ id: "magic_cost", label: l({ ja: "代償/世界の制約", en: "Cost / Constraint" }), placeholder: l({ ja: "例：魔力は睡眠でしか回復しない", en: "e.g. Mana only recovers through sleep" }) },
				],
				examples: l({ ja: ["農家の三男ユーリ。身体強化魔法の才能はあるが、戦略を考えるのが苦手。「自分の土地」を持つことへの執着。", "元プログラマの転生者アキラ。論理的思考が武器だが、この世界の常識を知らない。「帰る方法」を求めている。", "獣人族の少女リン。嗅覚と直感が鋭いが、人間社会のルールに馴染めない。「種族の壁を越えた友」を欲しがっている。"], en: ["Yuri, a farmer\u2019s third son. Body-enhancement magic talent but weak at strategy. Fixated on owning \u2018his own land.\u2019", "Akira, a reincarnated programmer. Logical thinking is a weapon but doesn\u2019t know this world\u2019s rules. Searching for \u2018a way home.\u2019", "Rin, a beastfolk girl. Sharp instincts but can\u2019t adapt to human society. Yearns for \u2018a friend beyond the species barrier.\u2019"] }),
			},
			q2: { examples: l({ ja: ["まずは辺境の村を魔獣から守る。最終的には、封印された魔王の復活を阻止し世界を安定させる。", "まずは元の世界への帰還方法を見つける。最終的には、この世界でも元の世界でも生きていける居場所を見つける。"], en: ["First, protect the border village from beasts. Ultimately, prevent the sealed Demon Lord\u2019s revival and stabilize the world.", "First, find a way back to the original world. Ultimately, find a place to belong in either world."] }) },
			q3: {
				prompt: l({ ja: "異世界での物語が動き出す瞬間を聞かせてください。\n何が起きて、最初の試練に巻き込まれるのでしょう？", en: "Tell me the moment the story begins in the other world.\nWhat happens\u2014and what first trial awaits?" }),
				examples: l({ ja: ["村の井戸から魔力が溢れ出し、ユーリだけがそれを制御できると判明する。", "転移門が突然開き、元の世界の友人が「助けて」と叫ぶ声が聞こえた。", "森の奥で倒れた獣人族の少女が、\u201c人間の街に行きたい\u201dと言い出した。"], en: ["Magic overflows from the village well, and Yuri is the only one who can control it.", "A teleportation gate opens suddenly and a friend from the old world cries \u2018help me!\u2019", "Deep in the forest, a beastfolk girl declares \u2018I want to go to the human town.\u2019"] }),
			},
			q4: { examples: l({ ja: ["外的＝魔王復活を目論む暗黒神官団／内的＝「所詮農家の三男」という劣等感。", "外的＝転生者を危険視する王国の追跡部隊／内的＝「この世界の人間を本当に信じていいのか」という疑念。"], en: ["External: Dark priest order seeking the Demon Lord\u2019s revival / Internal: Inferiority as \u2018just a farmer\u2019s third son.\u2019", "External: Kingdom pursuit squad hostile to reincarnators / Internal: \u2018Can I truly trust the people of this world?\u2019"] }) },
			q5: {
				prompt: l({ ja: "主人公と対立するのは誰、あるいは何でしょう？\n魔王、貴族、ギルド、あるいは世界の法則……\nその相手にも\u201c正しい理由\u201dを持たせてみてください。", en: "Who or what opposes your protagonist?\nDemon Lord, nobles, guild, or the world's own laws...\nTry giving them a 'justification' of their own." }),
				examples: l({ ja: ["暗黒神官ヴェルド。魔王復活こそが世界の「正しい姿」だと信じ、本気で世界を救おうとしている。", "帝国の将軍アルゴス。異世界人を「世界のバランスを乱す者」と見なすが、過去の異世界人による災害の記憶から来ている。"], en: ["Dark Priest Veld. Genuinely believes the Demon Lord\u2019s return is the world\u2019s \u2018true form\u2019\u2014sincerely trying to save the world.", "General Argos. Sees otherworlders as \u2018disruptors of balance\u2019 due to devastation caused by a previous reincarnator."] }),
			},
			q6: { examples: l({ ja: ["仲間を募り辺境の魔獣を討伐→神官団の拠点を突き止める→封印の神殿へ急行し儀式を妨害する。", "転移門の手がかりを集める→王都の図書館で古代魔法を解読→世界の境界が薄い地点で門を開く。"], en: ["Recruit allies to slay border beasts → strike the priests\u2019 base → rush to the seal\u2019s temple and sabotage the ritual.", "Gather portal clues → decode ancient magic at the capital library → open the gate where the boundary is thinnest."] }) },
			q7: {
				prompt: l({ ja: "この世界の根幹を揺るがす真実は何でしょう？\n血統、加護、歴史改竄……\n「実は——」の一言が、物語を一変させます。", en: "What truth shakes the very foundation of this world?\nBloodline, divine protection, falsified history...\nThat single 'actually\u2014' changes everything." }),
				examples: l({ ja: ["魔王は恋意的に封印されたのではなく、世界の崩壊を防ぐために自ら封印を選んでいた。", "「帰る方法」は最初から存在せず、召喚自体がこの世界の意志によるものだった。", "信じていた師匠が、実は暗黒神官団の創設者だった。"], en: ["The Demon Lord wasn\u2019t sealed by force\u2014he chose the seal himself to prevent the world\u2019s collapse.", "There was never \u2018a way home\u2019\u2014the summoning itself was this world\u2019s will.", "The trusted mentor was actually the founder of the dark priest order."] }),
			},
			q8: { examples: l({ ja: ["仲間を守るために魔力を使い果たし、「制御できる唯一の人」という存在意義を失う。", "転移門が開いたが、元の世界ではもう10年が過ぎており、自分の居場所はもうなかった。"], en: ["Used up all magic power to protect allies, losing the identity of being \u2018the only one who can control it.\u2019", "The portal opens, but 10 years have passed in the old world and there\u2019s no place left."] }) },
			q9: { examples: l({ ja: ["魔王の封印を解く代わりに自らの魔力を捨て、一介の農民として生きることを選ぶ。", "帰れる門を前に、この世界の仲間を選び、門を自ら閉じる。"], en: ["Gives up magic to release the Demon Lord\u2019s seal, choosing to live as an ordinary farmer.", "Facing the open gate home, chooses the companions of this world and closes the gate."] }) },
			q10: { examples: l({ ja: ["「特別な力」で認められたかったユーリが、力を失ってもなお必要とされる自分を知る——主題は\u201c居場所\u201d。", "「帰りたい」と願っていたアキラが、「ここが帰る場所」だと気づく——主題は\u201cもう一つの故郷\u201d。"], en: ["Yuri, who wanted recognition through power, learns he\u2019s needed even without it. Theme: \u2018Belonging.\u2019", "Akira, who longed to go home, realizes \u2018this is home.\u2019 Theme: \u2018A Second Homeland.\u2019"] }) },
		},
	},
	{
		id: "romcom",
		name: l({ ja: "\u30e9\u30d6\u30b3\u30e1\uff08\u73fe\u4ee3\uff09", en: "Romantic Comedy" }),
		locked: false,
		overrides: {
			q1: { examples: l({ ja: ["カフェ店員のひなた。人の好さには絶対の自信があるが、恋愛だけは臨機応変がきかない。「素の自分を見せる勇気」がない。", "大学生の悠真。文才と観察力があるが、極度の人見知り。「好きと言われても信じられない」という自己肯定の低さ。", "営業職の美月。コミュニケーションお化けだが、本音を言うと必ず空回りする。「自然体でいられる相手」がほしい。"], en: ["Hinata, a café worker. Confident about kindness but hopeless at romance. Lacks \u2018the courage to show her true self.\u2019", "Yuma, a college student. Gifted writer and observer, but extremely shy. Can\u2019t believe it when told \u2018I like you.\u2019", "Mitsuki, a saleswoman. Master communicator at work, but her true feelings always backfire. Wants \u2018someone she can be herself with.\u2019"] }) },
			q2: { examples: l({ ja: ["まずは気になる人と友達になりたい。最終的には、お互いの弱さを受け入れた上で付き合う。", "まずは元カノとの関係を整理したい。最終的には、「好き」を自分の言葉で伝えられるようになる。"], en: ["First, become friends with the person she likes. Ultimately, date while accepting each other\u2019s weaknesses.", "First, sort things out with an ex. Ultimately, learn to say \u2018I like you\u2019 in her own words."] }) },
			q3: { examples: l({ ja: ["雨の日、傷ついた子猫を拾おうとした二人の手が触れる。", "アパートの隣人が実は同じ会社の別部署の先輩だと判明する。", "合コンアプリでマッチした相手が、学生時代の幼馴染みだった。"], en: ["On a rainy day, their hands touch while both reach for an injured kitten.", "The apartment neighbor turns out to be a senior from a different department at the same company.", "A dating app match is actually a childhood friend from school days."] }) },
			q4: {
				label: l({ ja: "障害（人物／状況／価値観）", en: "Obstacles (Person / Situation / Values)" }),
				prompt: l({ ja: "二人の間にある障害を教えてください。\n邪魔する人物、ままならない状況、すれ違う価値観——\n恋には試練がつきものですから。", en: "Please tell me about the obstacles between them.\nA rival, an awkward situation, clashing values...\nLove, too, comes with trials." }),
				sub: [
					{ id: "people", label: l({ ja: "人物障害", en: "Person Obstacle" }), placeholder: l({ ja: "例：幼なじみの牽制", en: "e.g. Childhood friend\u2019s interference" }) },
					{ id: "situation", label: l({ ja: "状況障害", en: "Situation Obstacle" }), placeholder: l({ ja: "例：同じバイト先で気まずい", en: "e.g. Same workplace, awkward" }) },
					{ id: "values", label: l({ ja: "価値観障害", en: "Values Obstacle" }), placeholder: l({ ja: "例：仕事最優先で恋愛は二の次", en: "e.g. Career-first, romance second" }) },
				],
				examples: l({ ja: ["外的＝相手の元カノが復縁を迫ってくる／内的＝「自分なんかと付き合っても」という自己否定。", "外的＝転勤で遠距離になる／内的＝「重いと思われたくない」という見栄。"], en: ["External: Their ex aggressively pushes for reconciliation / Internal: \u2018Someone like me doesn\u2019t deserve to date.\u2019", "External: A transfer makes it long-distance / Internal: Fear of seeming \u2018too clingy.\u2019"] }),
			},
			q5: { examples: l({ ja: ["元カノの宏斗。まだ未練があり、「あの子を幸せにできるのは自分だけ」と本気で信じている。", "親友の菜緒。主人公の「恋をしない宣言」を全力で守ろうとし、出会いを妨害するが、それは「親友を失いたくない」という不器用な優しさから。"], en: ["Ex-boyfriend Hiroto. Still has feelings and genuinely believes \u2018I\u2019m the only one who can make her happy.\u2019", "Best friend Nao. Enforces the protagonist\u2019s \u2018no-dating\u2019 pact and blocks encounters\u2014out of fear of losing her friend."] }) },
			q6: { examples: l({ ja: ["まず「友達として」距離を縮める→偶然を装って接触頻度を上げる→決定的なイベントで気持ちに気づく。", "元カノとの関係を整理→自分の気持ちを整理→素直に伝える。"], en: ["Close distance as \u2018friends\u2019 → engineer \u2018coincidences\u2019 → a decisive event sparks awareness of feelings.", "Sort out the ex → sort out own feelings → confess honestly."] }) },
			q7: {
				prompt: l({ ja: "最大のすれ違いは何でしょう？\nどんな誤解が生まれて、なぜ簡単には解けないのか——\n聞かせてください。", en: "What is the biggest misunderstanding between them?\nHow does it arise, and why can\u2019t it be easily resolved?" }),
				examples: l({ ja: ["相手が優しかったのは「好きだから」ではなく、「先輩としての責任感」だったと知る。", "実は相手も合コンアプリを使っており、「偶然の再会」は両方が仕組んだものだった。", "「転勤」は嘘で、本当は主人公から逃げるための口実だった。"], en: ["The kindness wasn\u2019t from \u2018love\u2019 but from \u2018responsibility as a senior.\u2019", "Both were using the dating app, and the \u2018coincidental reunion\u2019 was orchestrated by both sides.", "The \u2018transfer\u2019 was a lie\u2014an excuse to run away from the protagonist."] }),
			},
			q8: { examples: l({ ja: ["告白の瞬間、締め切ったプロジェクトの打ち上げが重なり「今は恋愛どころじゃない」と空振りする。", "勇気を出して「好き」と言ったのに、「ごめん、今は答えられない」と保留される。"], en: ["Right when confessing, a project deadline hits and \u2018now\u2019s not the time for romance\u2019 deflects.", "Mustering courage to say \u2018I like you,\u2019 only to hear \u2018Sorry, I can\u2019t answer right now.\u2019"] }) },
			q9: {
				prompt: l({ ja: "想いを伝える瞬間を聞かせてください。\n何を捨てて——見栄、安定、それとも過去？\nその決断が、二人の物語を動かします。", en: "Tell me the moment they confess.\nWhat do they let go of\u2014pride, stability, or the past?\nThat choice will move their story forward." }),
				examples: l({ ja: ["「傘がなくなっても、雨の中一緒に走る」と言い、形振り構わず追いかける。", "「重いと思われてもいい」と覚悟し、空港で引き止める。"], en: ["\u2018Even without an umbrella, I\u2019ll run through the rain with you\u2019\u2014chases after without caring about appearances.", "Accepts being \u2018too much\u2019 and stops them at the airport."] }),
			},
			q10: { examples: l({ ja: ["「好きと言われても信じられなかった」ひなたが、「信じたいと思える人」に出会えた——主題は\u201c自己受容\u201d。", "「本音を言うと壊れる」と思っていた美月が、「本音でしか繋がれない」と知る——主題は\u201c素のまま\u201d。"], en: ["Hinata, who couldn\u2019t believe \u2018I like you,\u2019 meets someone she wants to believe. Theme: \u2018Self-acceptance.\u2019", "Mitsuki, who feared honesty would break things, discovers only honesty can connect. Theme: \u2018Being Yourself.\u2019"] }) },
		},
	},
	{
		id: "mystery",
		name: l({ ja: "\u30df\u30b9\u30c6\u30ea\uff08\u672c\u683c/\u65e5\u5e38\u306e\u8b0e\uff09", en: "Mystery" }),
		locked: false,
		overrides: {
			q1: { examples: l({ ja: ["古書店主の春木。記憶力と細部への執着が武器だが、人の感情に鈍感。「妹の失踪」という過去の傷を抱える。", "女子高生の理沙。推理小説オタクで観察眼が鋭いが、思い込みが激しく暴走しがち。「誰かに認められたい」という渇き。", "引退した刑事の安藤。尋問技術と人脈があるが、「解けなかった一件」への執着が判断を曇らせる。"], en: ["Haruki, an old bookshop owner. Exceptional memory and eye for detail but emotionally numb. Haunted by \u2018his sister\u2019s disappearance.\u2019", "Risa, a high school girl. Mystery nerd with sharp eyes, but prone to runaway assumptions. Craves \u2018recognition.\u2019", "Ando, a retired detective. Interrogation skills and connections, but obsession with \u2018the unsolved case\u2019 clouds his judgment."] }) },
			q2: { examples: l({ ja: ["まずは古書に残された暗号を解読したい。最終的には、妹の失踪の真相を突き止める。", "まずは学園祭前の不審事を解決したい。最終的には、犯人の動機を理解し、誰も傷つかない結末を見つける。"], en: ["First, decode the cipher in the old book. Ultimately, uncover the truth behind his sister\u2019s disappearance.", "First, solve the mystery before the school festival. Ultimately, understand the culprit\u2019s motive and find an ending where no one gets hurt."] }) },
			q3: { examples: l({ ja: ["店に持ち込まれた古書の中から、妹の筆跡に酷似した書き込みが見つかる。", "学園祭準備中、展示品が一つ消える。盗難に見えるが、犯人には不可解な行動パターンがある。", "代表作のない作家の遺品が持ち込まれ、その中に「未発表原稿」と書かれた封筒があった。"], en: ["Among books brought to the shop, handwriting eerily resembling his sister\u2019s is discovered.", "During festival prep, an exhibit goes missing. Looks like theft, but the culprit\u2019s pattern makes no sense.", "An obscure author\u2019s belongings are brought in, containing an envelope labeled \u2018Unpublished Manuscript.\u2019"] }) },
			q4: {
				label: l({ ja: "障害（手がかり/偽手がかり）", en: "Obstacles (Clues / Red Herrings)" }),
				prompt: l({ ja: "謎を解く手がかりを教えてください。\n本物の手がかりを3つ以上、そして偽の手がかりも——\n読者を惑わせる仕掛けが、ミステリの醍醐味ですから。", en: "Please tell me the clues that solve the mystery.\nAt least three true ones, and some red herrings as well\u2014\nMisdirection is what makes a mystery shine." }),
				sub: [
					{ id: "clues", label: l({ ja: "手がかり", en: "Clues" }), placeholder: l({ ja: "例：鍵の向き、雨の足跡、貸出履歴", en: "e.g. Key direction, rain footprints, lending records" }) },
					{ id: "red_herrings", label: l({ ja: "偽手がかり", en: "Red Herrings" }), placeholder: l({ ja: "例：割れた窓", en: "e.g. Broken window" }) },
				],
				examples: l({ ja: ["外的＝書き込みのあるページが何者かに切り取られる／内的＝「妹を見つけたい」と「真実を知るのが怖い」の矛盾。", "外的＝教師から「探偵ごっこはやめなさい」と活動禁止を受ける／内的＝「本当に正しいのか」という推理への不安。"], en: ["External: The page with writing is torn out / Internal: Wanting to find his sister vs. fearing the truth.", "External: A teacher bans \u2018playing detective\u2019 / Internal: Self-doubt\u2014\u2018Am I really right?\u2019"] }),
			},
			q5: {
				prompt: l({ ja: "犯人——あるいは対立する力の動機は何でしょう？\nそして核心のトリックは物理的？ 心理的？ 状況的？\n動機に説得力があると、謎が深まります。", en: "What drives the culprit\u2014or the opposing force?\nAnd the core trick: physical, psychological, or situational?\nA compelling motive deepens the mystery." }),
				examples: l({ ja: ["古書の元持ち主・辻村。妹を「保護」したと主張し、情報を隠す。本人は「妹を危険から遠ざけた」と信じている。", "理沙のクラスメイト・古島。「展示品を盗んだ」のではなく、「守ろうとした」のだという裏事情がある。"], en: ["Tsujimura, the book\u2019s previous owner. Claims he \u2018protected\u2019 the sister and hides information\u2014believes he was shielding her.", "Classmate Furushima. Didn\u2019t \u2018steal\u2019 the exhibit but was trying to \u2018protect\u2019 it\u2014there\u2019s a hidden reason."] }),
			},
			q6: { examples: l({ ja: ["書き込みの暗号を解読→辻村の過去を調査→妹が最後に目撃された場所へ向かう。", "展示品の消失パターンを分析→目撃者を見つける→古島の「守りたいもの」の正体を突き止める。"], en: ["Decode the cipher → investigate Tsujimura\u2019s past → go to where the sister was last sighted.", "Analyze the disappearance pattern → find a witness → uncover what Furushima was trying to protect."] }) },
			q7: {
				prompt: l({ ja: "読者に全ての手がかりが揃う瞬間を教えてください。\nこの地点で、読者も真相に辿り着けるはず——\nフェアプレーの宣言ですね。", en: "Please tell me the moment all clues are in the reader\u2019s hands.\nAt this point, the reader should be able to reach the truth\u2014\nA quiet declaration of fair play." }),
				examples: l({ ja: ["妹は「失踪」したのではなく、自ら姿を消すことを選んでいた。", "展示品の中に「本物の犯行予告」が隠されており、盗難事件自体が囮。", "「未発表原稿」はフィクションではなく、実際の事件の記録だった。"], en: ["The sister didn\u2019t \u2018disappear\u2019\u2014she chose to vanish on her own.", "A real crime notice was hidden inside the exhibit; the theft itself was a diversion.", "The \u2018unpublished manuscript\u2019 wasn\u2019t fiction\u2014it was a record of an actual incident."] }),
			},
			q8: { examples: l({ ja: ["妹の居場所を突き止めたが、妹から「来ないで」と拒絶される。春木は「自分の正義」が妹を追い詰めていたと知る。", "推理が当たり、犯人を暴くが、それにより犯人の家庭が崩壊する。「解くことは正義なのか」と打ちのめされる。"], en: ["Finds his sister but she says \u2018Don\u2019t come.\u2019 Haruki realizes his \u2018justice\u2019 was cornering her.", "The deduction is correct and the culprit is exposed, but it destroys their family. \u2018Was solving it the right thing?\u2019"] }) },
			q9: { examples: l({ ja: ["「見つけること」を諦め、「待つこと」を選ぶ。妹が帰れる場所として店を守り続ける。", "「公表」を捨て、犯人と二人で真実を抱えることを選ぶ。"], en: ["Gives up \u2018finding\u2019 and chooses \u2018waiting.\u2019 Keeps the shop open as a place the sister can return to.", "Gives up public exposure and chooses to carry the truth together with the culprit."] }) },
			q10: { examples: l({ ja: ["「答えを求め続けた」春木が、「答えがないことを受け入れる」ことを学ぶ——主題は\u201c許し\u201d。", "「正義が全て」だった理沙が、「正義より大切なもの」を知る——主題は\u201c思いやり\u201d。"], en: ["Haruki, who always sought answers, learns to accept that some things have none. Theme: \u2018Forgiveness.\u2019", "Risa, who believed in justice above all, discovers something more important. Theme: \u2018Compassion.\u2019"] }) },
		},
	},
	{
		id: "horror",
		name: l({ ja: "\u30db\u30e9\u30fc\uff08\u548c\u98a8/\u602a\u8ac7\uff09", en: "Horror (Japanese Gothic)" }),
		locked: false,
		overrides: {
			q1: { examples: l({ ja: ["大学生の志敦。科学的思考と行動力があるが、「解明できないもの」に対する恐怖が極度に強い。「祖母の死の真相」を突き止めたい。", "配信者の結衣。度胸とユーモアが武器だが、幼少期から「声」が聞こえる体質。「普通」になりたいという切なる願い。", "農家の娘・美冬。土地への愛着と忘れ去られた神楽の技。だが村の「見えないルール」に縛られている。「自由に生きること」への渇き。"], en: ["Shiki, a university student. Scientific mind but deeply terrified of \u2018the unexplainable.\u2019 Wants to uncover \u2018the truth behind grandmother\u2019s death.\u2019", "Yui, a streamer. Bold humor is her weapon, but she\u2019s heard \u2018voices\u2019 since childhood. Desperately wishes to be \u2018normal.\u2019", "Mifuyu, a farmer\u2019s daughter. Deep attachment to the land and forgotten kagura dance skills. Bound by the village\u2019s \u2018invisible rules.\u2019 Yearns for \u2018freedom.\u2019"] }) },
			q2: { examples: l({ ja: ["まずは祖母の家の残された手がかりを見つけたい。最終的には、「家系に縛られた因縁」を断ち切り、自分の意志で生きる。", "まずは声の正体を突き止めたい。最終的には、因縁を断ち切り正常な日常を取り戻す。"], en: ["First, find clues in grandmother\u2019s house. Ultimately, sever the \u2018karmic ties binding the bloodline\u2019 and live by her own will.", "First, identify the source of the voice. Ultimately, break the curse and reclaim a normal life."] }) },
			q3: {
				prompt: l({ ja: "なぜ主人公は禁忌に踏み込まざるを得ないのでしょう？\n避けられない理由を聞かせてください。\n怖い物語ほど、その理由は切実です。", en: "Why must your protagonist step into the taboo?\nTell me why they cannot avoid it.\nThe scarier the story, the more compelling the reason." }),
				examples: l({ ja: ["祖母の家の解体中、床下から「開けてはいけない」と書かれた箱が見つかる。", "帰省先の村で、子供の頃にはなかった「奉り地蔵」が増えていることに気づく。", "配信中に廃校の鏡に「いないはずの人影」が映り込み、コメント欄が凍りつく。"], en: ["During demolition of grandmother\u2019s house, a box labeled \u2018Do Not Open\u2019 is found beneath the floor.", "Returning to the hometown village, she notices roadside Jizo statues that weren\u2019t there in childhood.", "While streaming in an abandoned school, a mirror reflects \u2018a figure that shouldn\u2019t be there\u2019 and the comments freeze."] }),
			},
			q4: { examples: l({ ja: ["外的＝村の古老が「祖母のことは忘れろ」と話を遮断する／内的＝真実に近づくほど触れてはいけない予感が強まる。", "外的＝声が次第に具体的な「指示」に変わり、従わないと体調が悪化する／内的＝「自分はおかしいのでは」という疑念。"], en: ["External: Village elders shut down any talk about grandmother / Internal: The closer to truth, the stronger the feeling of \u2018I must not touch this.\u2019", "External: The voice gives increasingly specific \u2018orders,\u2019 disobedience worsens health / Internal: \u2018Am I losing my mind?\u2019"] }) },
			q5: {
				label: l({ ja: "恐怖の源とルール", en: "Source of Fear and Rules" }),
				prompt: l({ ja: "恐怖の源は何でしょう？ 超自然、人間、それとも環境？\nそして、その恐怖には\u201cルール\u201dがありますか？\n「振り向くな」「名を呼ぶな」……聞かせてください。", en: "What is the source of fear? Supernatural, human, or environment?\nAnd does this fear have 'rules'?\n'Don't turn around,' 'Don't say the name'... tell me." }),
				sub: [
					{ id: "source", label: l({ ja: "恐怖の源", en: "Source of Fear" }), placeholder: l({ ja: "例：超自然", en: "e.g. Supernatural" }) },
					{ id: "rule", label: l({ ja: "禁忌のルール", en: "Taboo Rule" }), placeholder: l({ ja: "例：名を呼ばれても振り向くな", en: "e.g. Never turn around when called by name" }) },
				],
				examples: l({ ja: ["祖母の友人だった老婆・トヨ。「あの子の過ちを繰り返させない」という善意から、真実を隠し続けている。", "廃校の「主」。かつてその場所で命を絶った生徒の残留思念。「忘れられたくない」という切実な願いが恐怖を生んでいる。"], en: ["Old woman Toyo, grandmother\u2019s friend. Hides the truth out of goodwill\u2014\u2018to prevent that child\u2019s fate from repeating.\u2019", "The \u2018master\u2019 of the abandoned school. A lingering will of a student who died there. The desperate wish \u2018not to be forgotten\u2019 breeds the horror."] }),
			},
			q6: { examples: l({ ja: ["箱の中身を調べる→祖母の日記を解読→村の禁忌の地に踏み込む。", "声のパターンを記録→郷土史を調査→因縁の原点である神社の御神体にたどり着く。"], en: ["Examine the box\u2019s contents → decode grandmother\u2019s diary → enter the village\u2019s forbidden ground.", "Record the voice\u2019s patterns → research local history → reach the shrine\u2019s sacred object at the curse\u2019s origin."] }) },
			q7: {
				prompt: l({ ja: "安全だと思っていた場所が崩れる瞬間を教えてください。\n味方だったはずの人、守られていたはずの場所——\nその瞬間が、恐怖を決定的にします。", en: "Tell me the moment the safe place crumbles.\nA trusted ally, a protected place\u2014\nThat moment makes the terror absolute." }),
				examples: l({ ja: ["祖母は「被害者」ではなく「封じる側」だった。そして封印の代償として命を落としていた。", "声の主は「悪霊」ではなく、封じられた土地神だった。「助けて」は襲いではなく文字通りの救いの言葉だった。"], en: ["Grandmother wasn\u2019t a \u2018victim\u2019 but \u2018the one who sealed it.\u2019 She gave her life as the price of the seal.", "The voice isn\u2019t an evil spirit but a sealed land deity. \u2018Help me\u2019 was literally a plea, not a threat."] }),
			},
			q8: { examples: l({ ja: ["禁忌の地に踏み込んだ結果、封印が綻び、村全体に異変が拡大する。志敦は「自分が触れたせいで」と罪悪感に潰れる。", "御神体を触った瞬間、「声」が完全に乗っ取り、自分の意志で体が動かなくなる。"], en: ["Entering the forbidden ground weakens the seal and anomalies spread. Shiki drowns in guilt\u2014\u2018It\u2019s because I touched it.\u2019", "The moment she touches the sacred object, the \u2018voice\u2019 takes full possession and her body no longer obeys her will."] }) },
			q9: { examples: l({ ja: ["祖母と同じ「封じる側」になることを選び、自らの寿命を代償に封印を更新する。", "「封じる」のではなく「解放する」ことを選び、土地神を自由にする代わりに村から去ることを受け入れる。"], en: ["Chooses to become \u2018the one who seals\u2019 like grandmother, giving lifespan to renew the seal.", "Instead of sealing, chooses to \u2018release\u2019 the land deity, accepting exile from the village."] }) },
			q10: { examples: l({ ja: ["「科学で説明できないものは存在しない」と信じていた志敦が、「理解できなくても向き合える」と知る——主題は\u201c畏れと共存\u201d。", "「正常でありたい」と願っていた結衣が、「異常な自分も自分」だと受け入れる——主題は\u201c自己受容\u201d。"], en: ["Shiki, who believed only in science, learns to face the unexplainable. Theme: \u2018Coexisting with Fear.\u2019", "Yui, who wished to be \u2018normal,\u2019 accepts her abnormal self. Theme: \u2018Self-acceptance.\u2019"] }) },
		},
	},
	{ id: "school", name: l({ ja: "\u5b66\u5712\u9752\u6625\uff0f\u30b9\u30dd\u6839", en: "School / Sports" }), locked: true, pack: "pack_a" },
	{ id: "suspense", name: l({ ja: "\u30b5\u30b9\u30da\u30f3\u30b9\uff0f\u30af\u30e9\u30a4\u30e0", en: "Suspense / Crime" }), locked: true, pack: "pack_a" },
	{ id: "sf", name: l({ ja: "\u30e9\u30a4\u30c8SF\uff08\u8fd1\u672a\u6765\uff09", en: "Lite SF (Near Future)" }), locked: true, pack: "pack_a" },
	{ id: "historical", name: l({ ja: "\u6b74\u53f2\u30fb\u6642\u4ee3", en: "Historical" }), locked: true, pack: "pack_a" },
	{ id: "darkfantasy", name: l({ ja: "\u30c0\u30fc\u30af\u30d5\u30a1\u30f3\u30bf\u30b8\u30fc", en: "Dark Fantasy" }), locked: true, pack: "pack_b" },
	{ id: "drama", name: l({ ja: "\u30d2\u30e5\u30fc\u30de\u30f3\u30c9\u30e9\u30de", en: "Human Drama" }), locked: true, pack: "pack_b" },
	{ id: "noir", name: l({ ja: "\u30e9\u30a4\u30c8\u30ce\u30ef\u30fc\u30eb", en: "Light Noir" }), locked: true, pack: "pack_b" },
	{ id: "blgl", name: l({ ja: "BL / GL", en: "BL / GL" }), locked: true, pack: "pack_b" },
];

// ============================================================
// Question resolution (base + flavor overrides)
// ============================================================

/**
 * Resolve a question by merging base with flavor overrides.
 * - prompt: override wins if present
 * - label: override wins if present
 * - sub: override REPLACES entirely (per MPC-10 spec)
 * - examples: override wins if present (same as getExamples)
 */
export function getResolvedQuestion(flavorId: string, questionIndex: number): MpcQuestion {
	const base = BASE_QUESTIONS[questionIndex];
	if (!base) return BASE_QUESTIONS[0]; // safety fallback

	const flavor = FLAVORS.find((f) => f.id === flavorId);
	const ov = flavor?.overrides?.[base.id];
	if (!ov) return base;

	return {
		id: base.id,
		label: ov.label ?? base.label,
		prompt: ov.prompt ?? base.prompt,
		icon: base.icon,
		sub: ov.sub ?? base.sub,
		examples: (ov.examples && ov.examples.length > 0) ? ov.examples : base.examples,
	};
}

// ============================================================
// Example resolution
// ============================================================

export function getExamples(flavorId: string, questionId: string): string[] {
	const flavor = FLAVORS.find((f) => f.id === flavorId);
	const override = flavor?.overrides?.[questionId]?.examples;
	if (override && override.length > 0) return override;
	const question = BASE_QUESTIONS.find((q) => q.id === questionId);
	return question?.examples || [];
}

export function pickRandomExample(
	examples: string[],
	seen: Set<number>,
): { text: string; index: number } | null {
	const unseen = examples.map((_, i) => i).filter((i) => !seen.has(i));
	if (unseen.length === 0) return null;
	const idx = unseen[Math.floor(Math.random() * unseen.length)];
	return { text: examples[idx], index: idx };
}
