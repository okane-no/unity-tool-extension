document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("getCookiesBtn");

  btn?.addEventListener("click", () => {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { type: "eventlink:getCookies" });
      }
    });
  });
});