chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_COOKIES") {
    const cookieQueries = [
      { domain: "eventlink.wizards.com" },
      { domain: ".wizards.com" },
      { domain: "www.wizards.com" }, // just in case
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

      // De-duplicate cookies by name + domain
      const dedupedCookies = Array.from(
        new Map(allCookies.map((c) => [`${c.domain}|${c.name}`, c])).values()
      );

      console.log("🍪 All deduped cookies:", dedupedCookies);
      sendResponse(dedupedCookies);
    });

    return true; // Required for async sendResponse
  }
});