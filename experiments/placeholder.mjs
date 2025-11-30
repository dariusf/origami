import { MatchDecorator } from "@codemirror/view";

import {
  Decoration,
  // DecorationSet,
  WidgetType,
  EditorView,
  ViewPlugin,
  // ViewUpdate,
} from "@codemirror/view";

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
    // wrap.innerText = this.txt;
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
    }),
});

const placeholders = ViewPlugin.fromClass(
  class {
    placeholders; //: DecorationSet
    constructor(view /*: EditorView*/) {
      this.placeholders = placeholderMatcher.createDeco(view);
    }
    update(update /*: ViewUpdate*/) {
      this.placeholders = placeholderMatcher.updateDeco(
        update,
        this.placeholders
      );
    }
  },
  {
    decorations: (instance) => instance.placeholders,
    provide: (plugin) =>
      EditorView.atomicRanges.of((view) => {
        return view.plugin(plugin)?.placeholders || Decoration.none;
      }),
  }
);

export { placeholders };
