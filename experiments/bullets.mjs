import {
  WidgetType,
  MatchDecorator,
  ViewPlugin,
  EditorView,
  Decoration,
} from "@codemirror/view";

class Widge extends WidgetType {
  constructor(txt) {
    super();
    this.txt = txt;
  }

  eq(other) {
    return other.txt == this.txt;
  }

  toDOM() {
    let wrap = document.createElement("span");
    wrap.innerText = `•`;
    return wrap;
  }

  ignoreEvent() {
    return true;
  }
}

const matcher = new MatchDecorator({
  regexp: /^-(?= )/g,
  decoration: (match) =>
    Decoration.replace({
      widget: new Widge(match[1]),
    }),
});

const bullets = ViewPlugin.fromClass(
  class {
    placeholders; //: DecorationSet
    constructor(view /*: EditorView*/) {
      this.placeholders = matcher.createDeco(view);
    }
    update(update /*: ViewUpdate*/) {
      this.placeholders = matcher.updateDeco(update, this.placeholders);
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

export { bullets };
