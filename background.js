const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://www.eventlinktounity.com",
  "http://www.eventlinktounity.com",
  "https://eventlinktounity.com",
  "http://eventlinktounity.com",
];

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {

  const origin = sender.origin || sender.url || "";
  if (!ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) {
    sendResponse({ ok: false, error: "forbidden" });
    return; // sync response
  }

  if (message?.type === "PING") {
    sendResponse({ ok: true });
    return; // sync response
  }

    if (message.type === "GET_COOKIES") {
    const cookieQueries = [
      { domain: "eventlink.wizards.com" },
      { domain: ".wizards.com" },
      { domain: "www.wizards.com" }, 
      { url: "https://eventlink.wizards.com" },
      { url: "https://www.wizards.com" }
    ];

    const promises = cookieQueries.map(
      (query) =>
        new Promise((resolve) =>
          chrome.cookies.getAll(query, resolve)
        )
    );

    Promise.all(promises).then((cookieArrays) => {
      const allCookies = cookieArrays.flat();

      const dedupedCookies = Array.from(
        new Map(allCookies.map((c) => [`${c.domain}|${c.name}`, c])).values()
      );

      console.log("🍪 All deduped cookies:", dedupedCookies);
      sendResponse(dedupedCookies);
    });

    return true; // Required for async sendResponse
  }

  sendResponse({ ok: false, error: "unsupported_message_type" });
});