const LIBRETRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL || "http://127.0.0.1:5000";

async function translateText({ text, sourceLanguage, targetLanguage }) {
  const label = `[LIBRETRANSLATE ${sourceLanguage}->${targetLanguage}]`;
  console.time(label);

  try {
    const response = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: "text",
      }),
    });

    const data = await response.json();

    console.timeEnd(label);

    console.log("[LIBRETRANSLATE_RESULT]", {
      originalText: text,
      translatedText: data.translatedText,
    });

    return data.translatedText;
  } catch (error) {
    console.timeEnd(label);

    console.error("[LIBRETRANSLATE_ERROR]", {
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
