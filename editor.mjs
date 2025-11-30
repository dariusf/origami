// indent wrap

import { vim, Vim } from "@replit/codemirror-vim";

import { EditorView } from "codemirror";
// import { html } from "@codemirror/lang-html";
import { markdown } from "@codemirror/lang-markdown";

import {
  Decoration,
  keymap,
  scrollPastEnd,

  // keymap,
  highlightSpecialChars,
  drawSelection,
  // highlightActiveLine,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  // lineNumbers, highlightActiveLineGutter
} from "@codemirror/view";
// import { ViewUpdate, ViewPlugin, DecorationSet } from "@codemirror/view";
import { StateField, EditorState } from "@codemirror/state";
import {
  syntaxTree,
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from "@codemirror/language";

// import { dracula, noctisLilac } from "thememirror";
import { oneDark } from "@codemirror/theme-one-dark";

import {
  indentWithTab,
  defaultKeymap,
  history,
  historyKeymap,
} from "@codemirror/commands";

// import {
// } from "@codemirror/view";
// import { } from "@codemirror/state";
// import {
// } from "@codemirror/language";
// import {} from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";

window.syntaxTree = syntaxTree;
// paste in console
// syntaxTree(state).iterate({from:0, to:100, enter: node => console.log(node.name, node.from, node.to)})

// export const getStartTabs = (line) => /^ */.exec(line)?.[0] ?? "";

const getDecorations = (state) => {
  const decorations = [];
  window.state = state;

  for (let i = 0; i < state.doc.lines; i++) {
    if (i === 0) continue;
    if (i > 1) break;
    const line = state.doc.line(i + 1);
    console.log("line", line);
    // const numberOfTabs = getStartTabs(line.text).length;
    // if (numberOfTabs === 0) continue;

    // const offset = numberOfTabs * 1;
    const offset = 2;

    const linerwapper = Decoration.line({
      attributes: {
        style: `--indented: ${offset}ch;`,
        class: "indented-wrapped-line",
      },
    });

    // console.log("range", line.from, line.from);
    decorations.push(linerwapper.range(line.from, line.from));
  }

  return Decoration.set(decorations);
};

/**
 * Plugin that makes line wrapping in the editor respect the identation of the line.
 * It does this by adding a line decoration that adds margin-left (as much as there is indentation),
 * and adds the same amount as negative "text-indent". The nice thing about text-indent is that it
 * applies to the initial line of a wrapped line.
 */
export const indentedLineWrap = StateField.define({
  create(state) {
    return getDecorations(state);
  },
  update(deco, tr) {
    if (!tr.docChanged) return deco;
    return getDecorations(tr.state);
  },
  provide: (f) => EditorView.decorations.from(f),
});

const theme = EditorView.theme({
  ".indented-wrapped-line": {
    borderLeft: "transparent solid calc(var(--indented))",
  },
  // ".indented-wrapped-line:before": {
  //   content: '""',
  //   marginLeft: "calc(-1 * var(--indented))",
  // },
  ".cm-gutters, .cm-activeLineGutter": {
    background: "transparent",
  },
});

// const doc = `  <!-- this line is deliberately indented without problems :) --><!doctype html>
// <body>
//   <h2 id="overview">Overview</h2>

//   <p>CodeMirror is a code-editor component that can be embedded in Web pages. The core library provides <em>only</em> the editor component, no accompanying buttons, auto-completion, or other IDE functionality. It does provide a rich API on top of which such functionality can be straightforwardly implemented. See the <a href="#addons">add-ons</a> included in the distribution, and the <a href="https://github.com/jagthedrummer/codemirror-ui">CodeMirror UI</a> project, for reusable implementations of extra features.</p>

//   <p>CodeMirror works with language-specific modes. Modes are JavaScript programs that help color (and optionally indent) text written in a given language. The distribution comes with a number of modes (see the <a href="../mode/"><code>mode/</code></a> directory), and it isn't hard to <a href="#modeapi">write new ones</a> for other languages.</p>
// </body>
// `;

const doc = `# todos
a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long line

## mvp

- [X] enable line wrapping
- [X] vite
- [X] focus on page load
- [X] gj and gk for vim. done in forked vim plugin
- [ ] remove the line numbers
- [ ] press tab to fold. look at how indent tab works
- [ ] a first widget
  - [ ] a dynamic widget, which has a user-defined interpretation for its content
    - [ ] date widget
- [ ] electron packaging
  - [ ] load file
  - [ ] save file

## beyond

- [ ] thing at point to test the ast
- [ ] structural editing start. move list items up and down
- [ ] BUG vim w moving into fold opens it, should act like l where it can't move
- [ ] shift tab to cycle vis
- [ ] org indent based on the existing indent solution https://discuss.codemirror.net/t/making-codemirror-6-respect-indent-for-wrapped-lines/2881
- [ ] org indent for lists
- [ ] org indent for headings
- [ ] look into storage options. how durable is local storage etc
- [ ] tabs/multiple buffers https://discuss.codemirror.net/t/cm6-multiple-docs-with-their-own-histories/3220/6
- [ ] transclusion like obsidian
- [ ] narrowing
  - [ ] go inside an extension lol
- [ ] hiding links
- [ ] scrolloff
- [ ] markdown bullets
- [ ] markdown checkbox trigger
- [ ] theme does not control normal mode it seems

## widget ideas

- list keywords
- list tags, to sort by
- dates which count days
- dynamic generic widget, prob an inline code with keyword, with a json object inside for the data

## asd
aasd
### asd
hahah
# sdk
asd
## asdkl
kalsjld
### asldj
kljhygyuguyd`;

// const checkboxPlugin = ViewPlugin.fromClass(
//   class {
//     // decorations: DecorationSet

//     constructor(view) {
//       //: EditorView) {
//       this.decorations = checkboxes(view);
//     }

//     update(update) {
//       //: ViewUpdate) {
//       if (
//         update.docChanged ||
//         update.viewportChanged ||
//         syntaxTree(update.startState) != syntaxTree(update.state)
//       )
//         this.decorations = checkboxes(update.view);
//     }
//   },
//   {
//     decorations: (v) => v.decorations,

//     eventHandlers: {
//       mousedown: (e, view) => {
//         let target = e.target; //as HTMLElement
//         if (
//           target.nodeName == "INPUT" &&
//           target.parentElement.classList.contains("cm-boolean-toggle")
//         )
//           return toggleBoolean(view, view.posAtDOM(target));
//       },
//     },
//   }
// );

const basicSetup = (() => [
  // lineNumbers(),
  // highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  // highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap,
  ]),
])();

const editor = new EditorView({
  doc,
  extensions: [
    // dracula,
    oneDark,
    // noctisLilac,
    EditorView.lineWrapping,
    basicSetup,
    // https://codemirror.net/examples/tab/
    keymap.of([indentWithTab]),
    // indentedLineWrap,
    theme,
    vim(),
    // html(),
    markdown(),
    // adds a ridiculous number of lines
    // scrollPastEnd(),
  ],
  parent: document.body,
});

document.body.onload = function () {
  editor.focus();
};

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
