// totally useless
// window.vim = vim;
// window.Vim = Vim;

// import { basicSetup } from "codemirror";
// // import { EditorView } from "codemirror";
// import { StateField, StateEffect } from "@codemirror/state";
// import {
//   EditorView,
//   Decoration,
//   // DecorationSet,
//   // WidgetType,
//   keymap,
//   drawSelection,
// } from "@codemirror/view";
// import { markdown } from "@codemirror/lang-markdown";
// // import { javascript } from "@codemirror/lang-javascript";
// import { vim, Vim } from "@replit/codemirror-vim";
// import { acceptCompletion } from "@codemirror/autocomplete";
// import { toggleFold, foldedRanges } from "@codemirror/language";
// // import { toggleFold } from "@codemirror/commands";

// const dec = Decoration.line({
//   // class: "indented",
//   style: "color: green",
//   // from: 1,
//   // to: 10,
// });

// const virtualIndent = StateField.define(
//   // < any >
//   {
//     create() {
//       return Decoration.set([dec.range(5, 5)]);
//       // return Decoration.none;
//     },
//     update(deco, tr) {
//       // if (!tr.docChanged) return deco;
//       // return getDecorations(tr.state);
//       return deco;
//     },
//     // update(st, tr) {
//     //   return st;
//     //   return underlines;
//     // },
//     provide: (f) => EditorView.decorations.from(f),
//   }
// );

// // let editor =
// new EditorView({
//   doc: `# asd
// asd
// ## asd
// aasd
// ### asd
// hahah
// # sdk
// asd
// ## asdkl
// kalsjld
// ### asldj
// kljhygyuguyd`,
//   extensions: [
//     vim(),
//     virtualIndent,
//     // keymap.of([{ key: "Ctrl-S", run: () => console.log("hi") }]),
//     basicSetup,
//     // drawSelection(),
//     markdown(),
//     EditorView.atomicRanges.of((v) => foldedRanges(v.state)),
//     // keymap.of([{ key: "Tab", run: acceptCompletion }]),
//     keymap.of([{ key: "Tab", run: toggleFold }]),
//     keymap.of([
//       {
//         key: "Alt-v", // only in insert mode
//         run: (view) => {
//           console.log("hi");
//           toggleFold(view);
//           // enableVim = !enableVim
//           // updateView()
//           return true;
//         },
//       },
//     ]),
//   ],
//   parent: document.body,
// });

// window.Vim = Vim;

// Vim.defineAction("forwardsearch", (view) => {
//   const { state, dispatch } = view;
//   console.log(view);

//   console.log("normal mode");
// });
// Vim.mapCommand("za", "action", "forwardsearch");

// Vim.defineAction("togglefold", toggleFold);
// Vim.mapCommand("Tab", "action", "togglefold");
