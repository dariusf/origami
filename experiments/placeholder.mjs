import {
  MatchDecorator,
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

// class MatchDecorator2 extends MatchDecorator {
//   updateDeco(update /*: ViewUpdate */, deco /*: DecorationSet */) {
//     const res = super.updateDeco(update, deco);
//   }
//   // if (changeTo > -1)
//   //   return this.updateRange(
//   //     update.view,
//   //     deco.map(update.changes),
//   //     changeFrom,
//   //     changeTo
//   //   );
//   // return deco;
// }

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
    // this.placeholders = placeholderMatcher.updateDeco(
    //   update,
    //   this.placeholders
    // );

    // 1. Let the decorator do its standard update/mapping
    let nextDeco = placeholderMatcher.updateDeco(update, this.placeholders);

    // always
    let from = update.startState.selection.ranges[0].from;
    let to = update.state.selection.ranges[0].from;
    if (from > to) {
      const temp = from;
      from = to;
      to = temp;
    }
    nextDeco = placeholderMatcher.updateRange(this.view, nextDeco, from, to);
    // console.log("always", from, to);

    // console.log("update", nextDeco);

    // 2. If the document changed, strictly validate that every decoration still matches
    nextDeco = nextDeco.update({
      filter: (from, to, _value) => {
        // Slice the text currently under the decoration
        let stillValid;
        {
          const text = update.state.doc.sliceString(from, to);
          // Check if it STILL matches your regex pattern
          // Note: use a new RegExp or reset lastIndex if using /g
          const pattern = /\[\[(\w+)\]\]/g;
          stillValid = !update.docChanged || pattern.test(text);
        }
        let inside;
        {
          const cursor = update.state.selection.ranges[0].from;
          inside = from <= cursor && cursor <= to;
        }
        // if (!inside) {
        //   console.log(cursor, from, to);
        // }
        // console.log(inside);

        // return stillValid && !inside;
        return !inside;
      },
    });

    this.placeholders = nextDeco;
  }
}

const placeholders = ViewPlugin.fromClass(Acc, {
  decorations: (instance) => instance.placeholders,
  provide: (plugin) => [],
  // EditorView.atomicRanges.of((view) => {
  //   return view.plugin(plugin)?.placeholders || Decoration.none;
  // }),
});

export { placeholders };
