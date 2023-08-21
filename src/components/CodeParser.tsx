import React from "react";
import { useCodeParser } from "../hooks/use-code-parser";
import "./CodeParser.css";

type CodeParserProps = {
  children: string;
};

const CodeParser: React.FC<CodeParserProps> = ({ children }) => {
  const nodeInfos = useCodeParser(children);

  return (
    <pre>
      {nodeInfos.map((info, index) => (
        <span key={index} className={info.identifiers.join(" ")}>
          {info.text}
        </span>
      ))}
    </pre>
  );
};

export default CodeParser;
