import { Lang, LangPacks, NlsKey, NlsReplacements } from "./types";
import zh from "./message/zh";
import en from "./message/en";

class Nls {
	nlsLangPacks: LangPacks;
	lang: Lang;

	constructor() {
		this.nlsLangPacks = {
			zh,
			en
		};

		for (const lang in this.nlsLangPacks) {
			if (navigator.language.startsWith(lang)) {
				this.lang = lang as Lang;
			}
		}
		if (!this.lang) {
			this.lang = "en";
		}
	}

	getLangPack = (targetLang: Lang = this.lang) => this.nlsLangPacks[targetLang];

	get = (targetKey: NlsKey, replacements?: NlsReplacements) => {
		let content = this.getLangPack()[targetKey];
		if (content && replacements instanceof Object) {
			for (const replacementKey in replacements) {
				const replacement = replacements[replacementKey];
				let replaceValue;
				if (replacement instanceof Function) {
					replaceValue = replacement(this.lang);
				} else {
					replaceValue = replacement;
				}
				if (typeof content === "string") {
					content = content.replaceAll(`\${${replacementKey}}`, replaceValue);
				}
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
