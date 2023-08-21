import { useState, useEffect } from "react";
import Parser from "web-tree-sitter";

export const useCodeParser = (sourceCode: string): string => {
  const [parsedOutput, setParsedOutput] = useState<string>("");
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
      setParsedOutput(tree.rootNode.toString());
    }
  }, [sourceCode, parser, language]);

  return parsedOutput;
};
