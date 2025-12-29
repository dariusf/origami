import {
  EditorView,
  Decoration,
  WidgetType,
  // DecorationSet,
  ViewPlugin,
} from "@codemirror/view";
import { StateEffect, StateField, EditorState } from "@codemirror/state";

import { MatchDecorator } from "@codemirror/view";

// TODO use the state field and transaction filter approach

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

const removePlaceholder = StateEffect.define();

// helper: scan doc for [[name]] placeholders and return ranges
function computeRanges(doc) {
  const text = doc.toString();
  const re = /\[\[(\w+)\]\]/g;
  const ranges = [];
  let m;
  while ((m = re.exec(text))) {
    const from = m.index;
    const to = m.index + m[0].length;
    const name = m[1];
    ranges.push({ from, to, name });
  }
  return ranges;
}

// StateField that tracks placeholder ranges and responds to remove effects
const placeholderRangesField = StateField.define({
  create(state) {
    return computeRanges(state.doc);
  },
  update(ranges, tr) {
    // recompute on doc change
    if (tr.docChanged) ranges = computeRanges(tr.newDoc);
    // apply any removePlaceholder effects
    for (const e of tr.effects) {
      if (e.is(removePlaceholder)) {
        const { from, to } = e.value;
        ranges = ranges.filter((r) => !(r.from === from && r.to === to));
      }
    }
    return ranges;
  },
  // provide decorations to the view using the ranges
  // provide: (field) =>
  //   EditorView.decorations.from((state) => {
  //     const rs = state.field(field);
  //     const decos = rs.map((r) =>
  //       Decoration.replace({ widget: new PlaceholderWidget(r.name) }).range(
  //         r.from,
  //         r.to
  //       )
  //     );
  //     return Decoration.set(decos, true);
  //   }),
});

// const obsidian = ViewPlugin.fromClass(
//   class {
//     placeholders; //: DecorationSet
//     constructor(view /*: EditorView*/) {
//       this.placeholders = placeholderMatcher.createDeco(view);
//     }
//     update(update /*: ViewUpdate*/) {
//       this.placeholders = placeholderMatcher.updateDeco(
//         update,
//         this.placeholders
//       );
//     }
//   },
//   {
//     decorations: (instance) => instance.placeholders,
//     provide: (plugin) =>
//       EditorView.atomicRanges.of((view) => {
//         return view.plugin(plugin)?.placeholders || Decoration.none;
//       }),
//   }
// );

const txFilter = EditorState.transactionFilter.of((tr) => {
  if (!tr.changes.empty) {
    const delta = tr.newDoc.length - tr.startState.doc.length;
    if (delta < 0) return []; // cancel transaction that shortens the document
  }
  return tr;
});

const obsidian = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.dom = view.dom.appendChild(document.createElement("div"));
      this.dom.style.cssText =
        "position: absolute; inset-block-start: 2px; inset-inline-end: 5px";
      this.dom.textContent = view.state.doc.length;
    }

    update(update) {
      if (update.docChanged) this.dom.textContent = update.state.doc.length;
    }

    destroy() {
      this.dom.remove();
    }
  }
);

export { obsidian };
