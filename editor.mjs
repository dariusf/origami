// indent wrap

// import { vim, Vim } from "@replit/codemirror-vim";
import { vim, Vim } from "./vim/index.ts";

// import { EditorView } from "codemirror";
// import { html } from "@codemirror/lang-html";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";

import { syntaxTree } from "@codemirror/language";
import {
  // ViewUpdate,
  // DecorationSet,
  EditorView,
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
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
  toggleFold,
} from "@codemirror/language";

// import { dracula, noctisLilac } from "thememirror";
import { oneDark } from "@codemirror/theme-one-dark";

import {
  indentWithTab,
  defaultKeymap,
  history,
  historyKeymap,
  indentMore,
  indentLess,
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

import { checkboxPlugin } from "./experiments/checkbox.mjs";
import { placeholders } from "./experiments/placeholder.mjs";
import { obsidian } from "./experiments/obsidian.mjs";
import { bullets } from "./experiments/bullets.mjs";

import {
  noDeletionFirstLast,
  preventDeletion,
} from "./experiments/txfilter.mjs";

// window.syntaxTree = syntaxTree;
// paste in console
// syntaxTree(state).iterate({from:0, to:100, enter: node => console.log(node.name, node.from, node.to)})

let doc = `# todos
a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long line

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

doc = `Move your cursor into a widget to reveal the underlying text:

[[a]]

# This is a heading

Press Tab while your cursor is on a heading to fold it.

When not on a heading, Tab indents/dedents (try it here).

- [ ] a
- [ ] b
`;

const basicSetup = (() => [
  // lineNumbers(),
  // highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection({ cursorBlinkRate: 0 }),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  // bracketMatching(),
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

export const thingAtPoint = ({ state }) => {
  const pos = state.selection.ranges[0].from + 1;
  const tree = syntaxTree(state).resolveInner(pos);
  const kind = tree.type.name;
  console.log(kind);
  return true;
};

export function foldConditionally(indent) {
  return (view) => {
    const { state } = view;
    const pos = state.selection.ranges[0].from + 1;
    const tree = syntaxTree(state).resolveInner(pos);
    const kind = tree.type.name;
    if (kind.startsWith("ATXHeading")) {
      toggleFold(view);
    } else {
      if (indent) {
        indentMore(view);
      } else {
        indentLess(view);
      }
    }
    return true;
  };
}

const editor = new EditorView({
  doc,
  extensions: [
    // dracula,
    oneDark,
    // noctisLilac,
    EditorView.lineWrapping,
    basicSetup,
    // https://codemirror.net/examples/tab/

    keymap.of([
      {
        key: "Tab",
        run: foldConditionally(true),
        shift: foldConditionally(false),
      },
      {
        key: "Control-q",
        run: thingAtPoint,
      },
    ]),
    // indentedLineWrap,
    // theme,
    vim(),
    // html(),
    markdown({ base: markdownLanguage }), // GFM
    // adds a ridiculous number of lines
    // scrollPastEnd(),
    // checkboxPlugin,
    placeholders,
    // noDeletionFirstLast,
    // preventDeletion,

    // obsidian,
    // bullets,
  ],
  parent: document.body,
});

document.body.onload = function () {
  editor.focus();
};
