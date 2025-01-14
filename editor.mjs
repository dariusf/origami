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
// // import {} from "@codemirror/view";
// // import view from "@codemirror/view";
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

window.Vim = Vim;

// Vim.defineAction("togglefold", toggleFold);
// Vim.mapCommand("Tab", "action", "togglefold");

// indent wrap

// CodeMirror as CM
import { vim, Vim, getCM } from "@replit/codemirror-vim";

import { EditorView } from "codemirror";
// import { html } from "@codemirror/lang-html";
import { markdown } from "@codemirror/lang-markdown";

import { Decoration } from "@codemirror/view";
import { ViewUpdate, ViewPlugin, DecorationSet } from "@codemirror/view";
import { StateField } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";

// basicsetup
import {
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  lineNumbers,
  highlightActiveLineGutter,
} from "@codemirror/view";
import { Extension, EditorState } from "@codemirror/state";
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from "@codemirror/language";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";
import { KeyBinding } from "@codemirror/view";

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

//   const theme = EditorView.theme({
//     ".indented-wrapped-line": {
//       borderLeft: "transparent solid calc(var(--indented))",
//     },
//   // ".indented-wrapped-line:before": {
//   //   content: '""',
//   //   marginLeft: "calc(-1 * var(--indented))",
//   // },
//   ".cm-gutters, .cm-activeLineGutter": {
//     background: "transparent",
//   },
// });

// const doc = `  <!-- this line is deliberately indented without problems :) --><!doctype html>
// <body>
//   <h2 id="overview">Overview</h2>

//   <p>CodeMirror is a code-editor component that can be embedded in Web pages. The core library provides <em>only</em> the editor component, no accompanying buttons, auto-completion, or other IDE functionality. It does provide a rich API on top of which such functionality can be straightforwardly implemented. See the <a href="#addons">add-ons</a> included in the distribution, and the <a href="https://github.com/jagthedrummer/codemirror-ui">CodeMirror UI</a> project, for reusable implementations of extra features.</p>

//   <p>CodeMirror works with language-specific modes. Modes are JavaScript programs that help color (and optionally indent) text written in a given language. The distribution comes with a number of modes (see the <a href="../mode/"><code>mode/</code></a> directory), and it isn't hard to <a href="#modeapi">write new ones</a> for other languages.</p>
// </body>
// `;

const doc = `# asd
asd
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

function focusChange(parent) {
  return EditorView.focusChangeEffect.of((state, focusing) => {
    if (focusing) {
      focused = parent;
    } else {
      focused = null;
    }
  });
}

// let oldJ = Vim.findKey(CM, "j");
Vim.defineAction("moveOut", (view, args, vim) => {
  const { state, dispatch } = view;
  // debugger;
  // state.doc.lineAt(state.selection.main.head).number
  //
  // view.state.doc;
  // view.state.doc;
  let cursorAt = view.cm6.state.doc.lineAt(
    view.cm6.state.selection.main.head
  ).number;
  let atEnd = cursorAt === view.cm6.state.doc.lines;
  // console.log(view, state, dispatch);
  // console.log("normal mode");
  if (atEnd) {
    // focusParent();
    focused.focus(); // this is the parent
    // window.main.focus();
  } else {
    console.log("dispatched");
    // oldJ();
    debugger;
    Vim.handleKey(view, "j");
    // debugger;
    // view.cm6.dispatch(view, view.state.vim, {
    //   keys: "",
    //   type: "motion",
    //   motion: "moveByLines",
    //   motionArgs: { forward: true, linewise: true },
    // });
  }
});
Vim.mapCommand("j", "action", "moveOut");

export const moveOutCmd /*: StateCommand*/ = ({ state, dispatch }) => {
  console.log("j pressed");
  debugger;
  if (state.readOnly) return false;
  let conf = config(state, state.selection.main.head);
  let tokens = conf.brackets || defaults.brackets;
  let dont = null,
    changes = state.changeByRange((range) => {
      if (range.empty) {
        let before = prevChar(state.doc, range.head);
        for (let token of tokens) {
          if (
            token == before &&
            nextChar(state.doc, range.head) == closing(codePointAt(token, 0))
          )
            return {
              changes: {
                from: range.head - token.length,
                to: range.head + token.length,
              },
              range: EditorSelection.cursor(range.head - token.length),
            };
        }
      }
      return { range: (dont = range) };
    });
  if (!dont)
    dispatch(
      state.update(changes, {
        scrollIntoView: true,
        userEvent: "delete.backward",
      })
    );
  return !dont;
};

const moveOutKeyMap = [{ key: "j", run: moveOutCmd }];

export const basicSetup = (() => [
  // lineNumbers(),
  // highlightActiveLineGutter(),
  // highlightSpecialChars(),
  history(),
  // foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  // rectangularSelection(),
  // crosshairCursor(),
  // highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    moveOutKeyMap,
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    // ...foldKeymap,
    ...completionKeymap,
    // ...lintKeymap,
  ]),
])();

function createEditor(txt, parent) {
  let editor = new EditorView({
    doc: txt,
    extensions: [
      // EditorView.lineWrapping,
      basicSetup,
      focusChange(parent),
      // indentedLineWrap,
      // theme,
      vim(),
      // html(),
      markdown(),
    ],
    // parent: document.body,
    parent,
  });
  editor._parent = parent;
  return editor;
}

window.createEditor = createEditor;
initTree();
