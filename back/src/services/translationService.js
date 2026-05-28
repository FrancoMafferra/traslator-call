async function translateText({ text, sourceLanguage, targetLanguage }) {
  try {
    const url =
      `https://api.mymemory.translated.net/get` +
      `?q=${encodeURIComponent(text)}` +
      `&langpair=${sourceLanguage}|${targetLanguage}`;

    const response = await fetch(url);

    const data = await response.json();

    const translatedText = data?.responseData?.translatedText;

    console.log("[MYMEMORY_RESULT]", {
      originalText: text,
      translatedText,
    });

    return translatedText || text;
  } catch (error) {
    console.error("[MYMEMORY_ERROR]", error);

    return text;
  }
}

async function warmupTranslations() {
  console.log("[WARMUP_TRANSLATIONS] iniciando...");

  const pairs = [
    {
      text: "hello",
      sourceLanguage: "en",
      targetLanguage: "es",
    },
    {
      text: "hola",
      sourceLanguage: "es",
      targetLanguage: "en",
    },
  ];

  for (const pair of pairs) {
    await translateText(pair);
  }

  console.log("[WARMUP_TRANSLATIONS] listo");
}

module.exports = {
  translateText,
  warmupTranslations,
};
