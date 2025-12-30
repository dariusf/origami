import { basicSetup } from "codemirror";

import {
  EditorView,
  Decoration,
  MatchDecorator,
  WidgetType,
  ViewPlugin,
} from "@codemirror/view";
// import { oneDark } from "@codemirror/theme-one-dark";

class PlaceholderWidget extends WidgetType {
  constructor(txt) {
    super();
    this.txt = txt;
  }

  eq(other) {
    return other.txt == this.txt;
  }

  toDOM() {
    let wrap = document.createElement("span");
    wrap.innerText = `⟨${this.txt}⟩`;
    return wrap;
  }

  ignoreEvent() {
    return true;
  }
}

const placeholderMatcher = new MatchDecorator({
  regexp: /\[\[(\w+)\]\]/g,
  decoration: (match) =>
    Decoration.replace({
      widget: new PlaceholderWidget(match[1]),
      inclusive: false,
      point: true,
    }),
});

class Acc {
  placeholders; //: DecorationSet
  constructor(view /*: EditorView*/) {
    this.view = view;
    this.placeholders = placeholderMatcher.createDeco(view);
  }
  update(update /*: ViewUpdate*/) {
    this.placeholders = placeholderMatcher.updateDeco(
      update,
      this.placeholders
    );
  }
}

const plugin = ViewPlugin.fromClass(Acc, {
  decorations: (instance) => instance.placeholders,
  provide: (plugin) =>
    EditorView.atomicRanges.of((view) => {
      return view.plugin(plugin)?.placeholders || Decoration.none;
    }),
});

let doc = `Move your cursor into the following text: [[a]]`;

const editor = new EditorView({
  doc,
  extensions: [
    // oneDark,
    basicSetup,
    plugin,
  ],
  parent: document.body,
});
