async function translateText({ text, sourceLanguage, targetLanguage }) {
  try {
    const response = await fetch("http://localhost:5000/translate", {
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

    return data.translatedText;
  } catch (error) {
    console.error("Error traduciendo:", error);

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
    {
      text: "ciao",
      sourceLanguage: "it",
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
