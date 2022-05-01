import { Lang, LangPacks, NlsKey, NlsReplacements } from "./types";

class Nls {
	nlsLangPacks: LangPacks;
	lang: Lang;

	constructor() {
		this.nlsLangPacks = {
			zh: require("./config/zh.json"),
			en: require("./config/en.json")
		};

		for (const lang in this.nlsLangPacks) {
			if (navigator.language.startsWith(lang)) {
				this.lang = lang as Lang;
			}
		}
		if (!this.lang) {
			this.lang = "zh";
		}
	}

	getLangPack = (targetLang: Lang = this.lang) => this.nlsLangPacks[targetLang];

	get = (targetKey: NlsKey, replacements?: NlsReplacements) => {
		let content = this.getLangPack()[targetKey];
		if (content && replacements instanceof Object) {
			for (const replacementKey in replacements) {
				const replacementValue = replacements[replacementKey];
				content = content.replaceAll(`\${${replacementKey}}`, replacementValue);
			}
		}
		return content;
	};

	switchLang = (targetLang: Lang) => {
		if (this.lang !== targetLang && this.nlsLangPacks[targetLang]) {
			this.lang = targetLang;
		} else {
			console.warn(`Language pack "${targetLang}" not supported`);
		}
	};
}

export default new Nls();
