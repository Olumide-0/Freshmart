export async function POST(request) {
  const { text, sourceLang } = await request.json();

  if (!text || !sourceLang) {
    return Response.json({ error: "Missing text or sourceLang" }, { status: 400 });
  }

  // Already English — no translation needed
  const langPrefix = sourceLang.split("-")[0];
  if (langPrefix === "en") {
    return Response.json({ translatedText: text });
  }

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${langPrefix}|en`
    );
    const data = await res.json();
    const translatedText = data?.responseData?.translatedText || text;

    return Response.json({ translatedText });
  } catch (err) {
    console.error("Translation error:", err);
    // Fail gracefully — fall back to the original text rather than blocking search
    return Response.json({ translatedText: text });
  }
}