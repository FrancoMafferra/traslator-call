const { translate } = require("@vitalets/google-translate-api");

async function translateText({ text, sourceLanguage, targetLanguage }) {
  const label = `[GOOGLE_TRANSLATE ${sourceLanguage}->${targetLanguage}]`;
  console.time(label);

  try {
    const result = await translate(text, {
      from: sourceLanguage,
      to: targetLanguage,
    });

    console.timeEnd(label);

    console.log("[GOOGLE_TRANSLATE_RESULT]", {
      originalText: text,
      translatedText: result.text,
    });

    return result.text || text;
  } catch (error) {
    console.timeEnd(label);

    console.error("[GOOGLE_TRANSLATE_ERROR]", {
      text,
      sourceLanguage,
      targetLanguage,
      error: error.message,
    });

    return text;
  }
}

async function warmupTranslations() {
  console.log("[WARMUP_TRANSLATIONS] iniciando...");

  await translateText({
    text: "hello",
    sourceLanguage: "en",
    targetLanguage: "es",
  });

  await translateText({
    text: "hola",
    sourceLanguage: "es",
    targetLanguage: "en",
  });

  console.log("[WARMUP_TRANSLATIONS] listo");
}

module.exports = {
  translateText,
  warmupTranslations,
};
