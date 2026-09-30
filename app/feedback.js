(function () {
  "use strict";

  const openButton = document.querySelector("#feedbackOpen");
  const dialog = document.querySelector("#feedbackDialog");
  const closeButton = document.querySelector("#feedbackClose");
  const externalLink = document.querySelector("#feedbackExternal");
  const body = document.querySelector("#feedbackBody");
  if (!openButton || !dialog || !closeButton || !externalLink || !body) return;

  let formUrl;
  try {
    formUrl = new URL(openButton.dataset.feedbackUrl);
    if (formUrl.origin !== "https://docs.google.com" || !/^\/forms\/d\/e\/[A-Za-z0-9_-]+\/viewform$/.test(formUrl.pathname)) return;
    // Only a public blank form URL is allowed, with no coordinates or prefilled report.
    formUrl.search = "";
    formUrl.hash = "";
  } catch (_) {
    return;
  }

  externalLink.href = formUrl.href;
  openButton.hidden = false;
  let frame;

  openButton.addEventListener("click", function () {
    if (typeof dialog.showModal !== "function") {
      externalLink.click();
      return;
    }
    if (!frame) {
      frame = document.createElement("iframe");
      frame.title = "Отчет о рыбалке: Google Форма";
      frame.referrerPolicy = "no-referrer";
      formUrl.searchParams.set("embedded", "true");
      frame.src = formUrl.href;
      body.append(frame);
    }
    if (!dialog.open) dialog.showModal();
  });

  closeButton.addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("close", function () { openButton.focus(); });
  // Keep the iframe mounted so closing and reopening does not erase an unfinished report.
})();
