import { EditorState } from "@codemirror/state";

const preventDeletion = EditorState.transactionFilter.of((tr) => {
  let isDelete = false;

  tr.changes.iterChanges((fromA, toA, fromB, toB) => {
    // If the range being replaced (A) is larger than the
    // range replacing it (B), it's a deletion.
    if (toA > fromA && toB - fromB < toA - fromA) {
      isDelete = true;
    }
  });

  // Returning false cancels the entire transaction
  return isDelete ? [] : tr;
});

const noDeletionFirstLast = EditorState.transactionFilter.of((tr) => {
  // console.log("tr", tr);

  if (!tr.docChanged) return tr;

  const isEntireDoc = tr.changes.sections[0] === tr.startState.doc.length;
  if (isEntireDoc) return tr;

  const { doc } = tr.startState;
  const lineCount = doc.lines;
  const firstLine = doc.line(1);
  const lastLine = lineCount > 1 ? doc.line(lineCount) : null;

  const modifiedFirst = tr.changes.touchesRange(firstLine.from, firstLine.to);
  const modifiedLast =
    lastLine && tr.changes.touchesRange(lastLine.from, lastLine.to);
  // If the transaction modifies the firstLine or last line, reject it
  if (modifiedFirst) {
    console.log("first");
  }
  if (modifiedLast) {
    console.log("last");
  }
  if (modifiedFirst || modifiedLast) {
    return null;
  }

  return tr;
});

export { noDeletionFirstLast, preventDeletion };
