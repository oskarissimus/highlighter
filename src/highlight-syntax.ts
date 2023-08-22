import React from "react";
import { parse } from "./parser";
import { applyStyles } from "./apply-styles";

export function highlightSyntax(code: string): React.ReactNode {
  const parsingResults = parse(code);
  return applyStyles(code, parsingResults);
}
