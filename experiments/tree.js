var tree = [
  {
    title: "hello",
    body: "empty",
    children: [
      {
        title: "child1",
        body: "lol",
        children: [],
      },
    ],
  },
];
var main = document.querySelector("#main");

var focused = null;
function render() {
  main.innerText = "";
  function walk(tree, node, depth) {
    for (let t of tree) {
      let elt = document.createElement("details");
      elt.tabIndex = 0; // TODO
      let title = document.createElement("summary");
      // let body = document.createElement("textarea");
      let body = createEditor("txt", elt);
      // body._parent = elt;
      // top.appendChild(body);
      elt.appendChild(title);
      body.style = "margin-left: 10px";
      elt.style = `margin-left: ${depth * 10}px`;
      title.innerText = t.title;
      body.value = t.body;
      node.appendChild(elt);
      walk(t.children, elt, depth + 1);
    }
  }
  walk(tree, main, 0);
}

function initTree() {
  render();
}
