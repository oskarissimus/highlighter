import React from "react";
import "./CodeParser.css";
import { highlightSyntax } from "../highlight-syntax";

type CodeParserProps = {
  children: string;
};

const CodeParser: React.FC<CodeParserProps> = ({ children }) => {
  return (
    <pre>
      <code className="code-parser">{highlightSyntax(children)}</code>
    </pre>
  );
};

export default CodeParser;
