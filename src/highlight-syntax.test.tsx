import { highlightSyntax } from "./highlight-syntax";
import { parse } from "./parser";
import { applyStyles } from "./apply-styles";
import React from "react";

// Mocking the 'parse' and 'applyStyles' functions
jest.mock("./parser");
jest.mock("./apply-styles");

describe("highlightSyntax", () => {
  it("should process and style code correctly", () => {
    const mockCode = "const a = 10;";
    const mockParsingResults = {}; // This should match the expected shape of the parsing results

    (parse as jest.Mock).mockReturnValue(mockParsingResults);
    (applyStyles as jest.Mock).mockReturnValue(<span>{mockCode}</span>); // Mock React node

    const result = highlightSyntax(mockCode);

    expect(result).toEqual(<span>{mockCode}</span>);
    expect(parse).toHaveBeenCalledWith(mockCode);
    expect(applyStyles).toHaveBeenCalledWith(mockCode, mockParsingResults);
  });
});
