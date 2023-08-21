const Parser = require('tree-sitter');
const JavaScript = require('tree-sitter-python');

const parser = new Parser();
parser.setLanguage(JavaScript);
const sourceCode = `
def foo():
    print("Hello World")

foo()
`;
const tree = parser.parse(sourceCode);
console.log(tree.rootNode.toString());
