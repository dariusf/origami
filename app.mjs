import { createEditor } from "./editor.mjs";

const editor = createEditor();
document.body.onload = function () {
  editor.focus();
};
