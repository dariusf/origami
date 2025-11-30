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
