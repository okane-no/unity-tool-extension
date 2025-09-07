window.addEventListener("message", (event) => {
  if (
    event.source !== window ||
    !event.data ||
    event.data.source !== "eventlink-webapp" ||
    event.data.type !== "eventlink:getCookies"
  ) {
    return;
  }
  
  chrome.runtime.sendMessage({ type: "GET_COOKIES" });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "COOKIE_RESULT") {
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
