// indent wrap

// import { vim, Vim } from "@replit/codemirror-vim";
import { vim, Vim } from "./vim/index.ts";

// import { EditorView } from "codemirror";
// import { html } from "@codemirror/lang-html";
import {
  markdown,
  markdownLanguage,
  insertNewlineContinueMarkupCommand,
} from "@codemirror/lang-markdown";

import { syntaxTree, foldedRanges } from "@codemirror/language";
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
  moveLineDown,
  moveLineUp,
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

- [ ] This is a checkbox list
- [ ] Press Ctrl+C or <Space>c with your cursor on an item to toggle its checkbox
- [ ] Pressing o in vim mode will extend lists too!
- [ ] Reorder items using Cmd+j and Cmd+k
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

function getThingAtPoint({ state }) {
  const pos = state.selection.ranges[0].from + 1;
  const tree = syntaxTree(state).resolveInner(pos);
  return tree;
}

export const thingAtPoint = (view) => {
  const tree = getThingAtPoint(view);
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

window.debugAST = function (node) {};

export const checkListItem = (view) => {
  const { state, dispatch } = view;
  const pos = state.selection.ranges[0].from + 1;
  const tree = syntaxTree(state).resolveInner(pos);
  const kind = tree.type.name;

  function handleTaskMarker(tree) {
    const checked =
      view.state.doc.sliceString(tree.from + 1, tree.to - 1) == "X";
    if (checked) {
      dispatch({
        changes: { from: tree.from + 1, to: tree.to - 1, insert: " " },
      });
    } else {
      dispatch({
        changes: { from: tree.from + 1, to: tree.to - 1, insert: "X" },
      });
    }
  }

  if (kind === "TaskMarker") {
    handleTaskMarker(tree);
  } else if (kind === "Task") {
    handleTaskMarker(tree.firstChild);
  }
  return true;
};

function reorderList(up) {
  return (view) => {
    const { state, dispatch } = view;
    const pos = state.selection.ranges[0].from + 1;
    const tree = syntaxTree(state).resolveInner(pos);
    const kind = tree.type.name;

    if (kind === "Task") {
      const thisItem = tree.parent;
      const otherItem = up ? thisItem.prevSibling : thisItem.nextSibling;
      if (otherItem) {
        const thisItemText = view.state.doc.sliceString(
          thisItem.from,
          thisItem.to
        );
        const otherItemText = view.state.doc.sliceString(
          otherItem.from,
          otherItem.to
        );
        const point = state.selection.ranges[0].from;
        const col = point - thisItem.from;
        const newCursorPos = up
          ? otherItem.from + col
          : thisItem.from + otherItemText.length + col + 1;
        dispatch({
          changes: [
            { from: thisItem.from, to: thisItem.to, insert: otherItemText },
            { from: otherItem.from, to: otherItem.to, insert: thisItemText },
          ],
          selection: { anchor: newCursorPos, head: newCursorPos },
        });
      }
    }
    return true;
  };
}

function defineVimBinding(keybinding, mode, command) {
  const indirect = false;
  const name = command.name;
  if (indirect) {
    Vim.defineEx(name, name, (cm) => {
      const editor = cm.cm6;
      command(editor);
    });
    Vim.map(keybinding, `:${name}<cr>`);
  } else {
    Vim.defineAction(name, (cm, _actionArgs, _vim) => {
      const editor = cm.cm6;
      command(editor);
    });
    Vim.mapCommand(
      keybinding,
      "action",
      name,
      {}, // actionArgs
      { context: mode }
    );
  }
}

const defineListAwareO = (function () {
  const mdContinueListCommand = insertNewlineContinueMarkupCommand({
    nonTightLists: false,
  });
  return () => {
    Vim.unmap("o", "normal");
    const name = "conditionalO";
    Vim.defineAction(name, function (cm, actionArgs, vim) {
      const kind = getThingAtPoint(cm.cm6).type.name;
      switch (kind) {
        case "Task":
        case "TaskMarker":
        case "BulletList":
        case "ListItem":
          Vim.handleKey(cm, "$", "macro");
          Vim.handleKey(cm, "a", "macro");
          mdContinueListCommand(cm.cm6);
          break;

        default:
          this.newLineAndEnterInsertMode(
            cm,
            { ...actionArgs, after: true },
            vim
          );
      }
    });
    Vim.mapCommand("o", "action", name, {}, { context: "normal" });
  };
})();

Vim.unmap("<Space>"); // default space mapping has no context property
defineVimBinding("<Space>c", "normal", checkListItem);
defineVimBinding("<Space>?", "normal", thingAtPoint);
defineListAwareO();

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
      // {
      //   key: "Space ?",
      //   run: thingAtPoint,
      // },
      {
        key: "Control-c", // Space c needs to be done in normal only
        run: checkListItem,
      },
      {
        key: "Mod-j",
        run: reorderList(false),
        // run: moveLineDown, // only works for single-line items
      },
      {
        key: "Mod-k",
        // run: moveLineUp,
        run: reorderList(true),
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
    EditorView.atomicRanges.of((v) => foldedRanges(v.state)),
  ],
  parent: document.body,
});

document.body.onload = function () {
  editor.focus();
};
