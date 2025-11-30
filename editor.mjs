// indent wrap

import { vim, Vim } from "@replit/codemirror-vim";

// import { EditorView } from "codemirror";
// import { html } from "@codemirror/lang-html";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";

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

import { checkboxPlugin } from "./experiments/checkbox.mjs";
import { placeholders } from "./experiments/placeholder.mjs";

// window.syntaxTree = syntaxTree;
// paste in console
// syntaxTree(state).iterate({from:0, to:100, enter: node => console.log(node.name, node.from, node.to)})

let doc = `# todos
a very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long line

## mvp

- [X] enable line wrapping
- [X] vite
- [X] focus on page load
- [X] gj and gk for vim. done in forked vim plugin
- [X] remove the line numbers
- [ ] press tab to fold. look at how indent tab works
- [X] a first widget
- [ ] obsidian-like widgets
- [ ] electron packaging
  - [ ] load file
  - [ ] save file

## beyond

- [ ] stop cursor from flashing
- [ ] thing at point to test the ast
  - [ ] structural editing start. move list items up and down
- [ ] date widget
- [ ] a dynamic widget, which has a user-defined interpretation for its content, taken from another part of doc
- [ ] distraction-free mode
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
- [ ] which-key?
- [ ] command palette?

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

doc = `
- [ ] a
- [ ] b
`;

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
    markdown({ base: markdownLanguage }), // GFM
    // adds a ridiculous number of lines
    // scrollPastEnd(),
    // checkboxPlugin,
    // placeholders,
  ],
  parent: document.body,
});

document.body.onload = function () {
  editor.focus();
};
