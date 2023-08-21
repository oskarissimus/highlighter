import { useState, useEffect } from "react";
import Parser from "web-tree-sitter";

type NodeTypeInformation = {
  text: string;
  identifiers: string[];
};

function collectLeafNodes(node: Parser.SyntaxNode): Parser.SyntaxNode[] {
  if (node.children.length === 0) {
    return [node];
  }

  let nodes: Parser.SyntaxNode[] = [];
  for (const child of node.children) {
    nodes = nodes.concat(collectLeafNodes(child));
  }

  return nodes;
}

function collectParentIdentifiers(node: Parser.SyntaxNode): string[] {
  const brackets = /[{}()\[\]]/;
  const operators = /[\+\-\*\/\=]/;
  const identifiers: string[] = [];
  let currentNode: Parser.SyntaxNode | null = node;
  while (currentNode) {
    // if (currentNode.type === "expression_statement") {
    //   break;
    // }

    let identifier = currentNode.type;
    if (brackets && brackets.test(identifier)) {
      identifier = "bracket";
    } else if (operators && operators.test(identifier)) {
      identifier = "operator";
    }
    identifiers.push(identifier);
    currentNode = currentNode.parent;
  }
  return identifiers;
}
function getNodeInfo(
  source: string,
  node: Parser.SyntaxNode,
  lastEndPosition?: Parser.Point
): NodeTypeInformation {
  let exactText = node.text;

  if (lastEndPosition) {
    const newLines = Math.max(0, node.startPosition.row - lastEndPosition.row);
    const spaces =
      node.startPosition.row === lastEndPosition.row
        ? Math.max(0, node.startPosition.column - lastEndPosition.column)
        : node.startPosition.column;

    const whitespacePrefix = "\n".repeat(newLines) + " ".repeat(spaces);
    exactText = whitespacePrefix + exactText;
  }

  return {
    text: exactText,
    identifiers: collectParentIdentifiers(node),
  };
}

export function getLeafNodesFromTree(tree: Parser.Tree): Parser.SyntaxNode[] {
  return collectLeafNodes(tree.rootNode);
}

export const useCodeParser = (sourceCode: string): NodeTypeInformation[] => {
  const [nodeInfos, setNodeInfos] = useState<NodeTypeInformation[]>([]);

  const [parser, setParser] = useState<Parser | null>(null);
  const [language, setParserLanguage] = useState<Parser.Language | null>(null);

  useEffect(() => {
    Parser.init().then(async () => {
      const newParser = new Parser();
      setParser(newParser);
      const PythonLanguage = await Parser.Language.load(
        "./tree-sitter-python.wasm"
      );
      newParser.setLanguage(PythonLanguage);
      setParserLanguage(PythonLanguage);
    });
  }, []);

  useEffect(() => {
    if (parser && language) {
      const tree = parser.parse(sourceCode);
      const nodes = getLeafNodesFromTree(tree);

      let lastEndPosition: Parser.Point | undefined;
      const infos = nodes.map((node) => {
        const info = getNodeInfo(sourceCode, node, lastEndPosition);
        lastEndPosition = node.endPosition;
        return info;
      });

      setNodeInfos(infos);
    }
  }, [sourceCode, parser, language]);

  return nodeInfos;
};
