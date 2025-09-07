console.log("🔍 content.js loaded into", window.location.hostname);

window.addEventListener("message", (event) => {
  if (
    event.source !== window ||
    !event.data ||
    event.data.source !== "eventlink-webapp" ||
    event.data.type !== "eventlink:getCookies"
  ) {
    return;
  }

  console.log("📩 content.js received request to get cookies");

  chrome.runtime.sendMessage({ type: "GET_COOKIES" });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "COOKIE_RESULT") {
    console.log("📦 Sending cookie result to page", message.data);
    window.postMessage(
      {
        source: "eventlink-extension",
        type: "eventlink:cookieResult",
        data: message.data
      },
      "*"
    );
  }
});
