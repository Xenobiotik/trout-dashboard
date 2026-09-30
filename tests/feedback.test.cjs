const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync(require.resolve("../app/feedback.js"), "utf8");

function mount(url = "https://docs.google.com/forms/d/e/test-form/viewform", supportsDialog = true) {
  const nodes = {};
  for (const id of ["feedbackOpen", "feedbackDialog", "feedbackClose", "feedbackExternal", "feedbackBody"]) {
    nodes[`#${id}`] = {
      handlers: {}, hidden: true, children: [], open: false,
      dataset: { feedbackUrl: url },
      addEventListener(type, handler) { this.handlers[type] = handler; },
      append(child) { this.children.push(child); },
      click() { this.clicked = true; this.handlers.click?.(); },
      focus() { this.focused = true; },
      close() { this.open = false; this.handlers.close?.(); }
    };
  }
  if (supportsDialog) nodes["#feedbackDialog"].showModal = function () { this.open = true; };
  const created = [];
  const document = {
    querySelector(selector) { return nodes[selector]; },
    createElement(tag) { const element = { tag }; created.push(element); return element; }
  };
  vm.runInNewContext(source, { document, URL });
  return { nodes, created, open: nodes["#feedbackOpen"], dialog: nodes["#feedbackDialog"] };
}

test("feedback: Google is not contacted before opening the report", () => {
  const app = mount();
  assert.equal(app.open.hidden, false);
  assert.equal(app.created.length, 0);
  app.open.click();
  assert.equal(app.dialog.open, true);
  assert.equal(app.created.length, 1);
  assert.equal(app.created[0].src, "https://docs.google.com/forms/d/e/test-form/viewform?embedded=true");
  assert.equal(app.created[0].referrerPolicy, "no-referrer");
  assert.ok(app.created[0].title);
});

test("feedback: closing restores focus and reopening preserves the same draft iframe", () => {
  const app = mount();
  app.open.click();
  const first = app.created[0];
  app.nodes["#feedbackClose"].click();
  assert.equal(app.dialog.open, false);
  assert.equal(app.open.focused, true);
  app.open.click();
  assert.equal(app.created.length, 1);
  assert.equal(app.created[0], first);
});

test("feedback: missing, editor and untrusted URLs keep the entry hidden", () => {
  for (const url of ["", "javascript:alert(1)", "https://example.com/forms/d/e/x/viewform", "https://docs.google.com/forms/d/x/edit", "http://docs.google.com/forms/d/e/x/viewform", "https://docs.google.com.evil.test/forms/d/e/x/viewform"]) {
    const app = mount(url);
    assert.equal(app.open.hidden, true);
    assert.equal(app.created.length, 0);
  }
});

test("feedback: no coordinates, prefilled values or page URL are forwarded", () => {
  const app = mount("https://docs.google.com/forms/d/e/test-form/viewform?entry.1=private&latitude=60&longitude=30#private");
  assert.equal(app.nodes["#feedbackExternal"].href, "https://docs.google.com/forms/d/e/test-form/viewform");
  app.open.click();
  assert.equal(app.created[0].src, "https://docs.google.com/forms/d/e/test-form/viewform?embedded=true");
});

test("feedback: older browsers open the official form without a broken modal", () => {
  const app = mount(undefined, false);
  app.open.click();
  assert.equal(app.nodes["#feedbackExternal"].clicked, true);
  assert.equal(app.created.length, 0);
});
