enum TokenType {
  Keyword = "keyword",
  String = "string",
  Number = "number",
  Comment = "comment",
  Bracket = "bracket",
}

export type Token = {
  beginIndex: number;
  endIndex: number;
  tokenType: TokenType;
};

export function parse(code: string): Token[] {
  const tokens: Token[] = [];
  const regexes: { [key in TokenType]: RegExp } = {
    [TokenType.Keyword]:
      /\b(and|as|assert|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/g,
    [TokenType.String]: /('|")(.*?)(\1)/g,
    [TokenType.Number]: /\b\d+(\.\d*)?\b/g,
    [TokenType.Comment]: /#.*$/gm,
    [TokenType.Bracket]: /[\[\]{}()]/g,
  };

  for (const tokenType of Object.values(TokenType)) {
    let match: RegExpExecArray | null;

    while ((match = regexes[tokenType].exec(code)) !== null) {
      tokens.push({
        beginIndex: match.index,
        endIndex: match.index + match[0].length,
        tokenType: tokenType,
      });
    }
  }

  return tokens.sort((a, b) => a.beginIndex - b.beginIndex);
}
