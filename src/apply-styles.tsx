import React from "react";
import { Token } from "./parser";

export function applyStyles(
  code: string,
  parsingResults: Token[]
): React.ReactNode {
  let currentIndex = 0;
  const reactNodes: React.ReactNode[] = [];

  for (const token of parsingResults) {
    if (currentIndex < token.beginIndex) {
      reactNodes.push(code.substring(currentIndex, token.beginIndex));
    }
    reactNodes.push(
      <span key={currentIndex} className={token.tokenType}>
        {code.substring(token.beginIndex, token.endIndex)}
      </span>
    );
    currentIndex = token.endIndex;
  }

  if (currentIndex < code.length) {
    reactNodes.push(code.substring(currentIndex));
  }

  return reactNodes;
}
