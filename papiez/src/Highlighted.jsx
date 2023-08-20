import { useState, useEffect } from 'react';
import wasmURL from 'vscode-oniguruma/release/onig.wasm';
import pythonGrammar from './Python.tmLanguage';
import * as oniguruma from 'vscode-oniguruma';
import * as vsctm from 'vscode-textmate';
// useOniguruma Hook
function useOniguruma() {
    const [onigLib, setOnigLib] = useState(null);

    useEffect(() => {
        const loadLib = async () => {
            // Fetch the WASM binary using the URL
            const response = await fetch(wasmURL);
            const wasmBinary = await response.arrayBuffer();
            await oniguruma.loadWASM(wasmBinary);
            setOnigLib({
                createOnigScanner: patterns => new oniguruma.OnigScanner(patterns),
                createOnigString: s => new oniguruma.OnigString(s)
            });
        };

        loadLib();
    }, []);

    return onigLib;
}


function useGrammarRegistry(onigLib) {
    const [registry, setRegistry] = useState(null);

    useEffect(() => {
        if (onigLib) {
            const reg = new vsctm.Registry({
                onigLib,
                loadGrammar: (scopeName) => {
                    if (scopeName === 'source.python') {
                        return vsctm.parseRawGrammar(pythonGrammar);
                    }
                    console.log(`Unknown scope name: ${scopeName}`);
                    return null;
                }
            });
            setRegistry(reg);
        }
    }, [onigLib]);

    return registry;
}

function mapScopesToClasses(scopes) {
    const mapping ={
        'keyword.control.import.import.python': 'keyword',
        'meta.identifier.python': 'variable',
        "storage.type.function.python": 'special-keyword',
        "entity.name.function.python": 'function',
        "variable.parameter.function.keyword.python": "parameter",
        "string.quoted.single.python": "string",
        "keyword.control.flow.python": "keyword",
        "keyword.operator.logical.python": "special-keyword",
        "meta.function-call.generic.python": "function",
        "support.function.builtin.python": "builtin",
        "keyword.other.python": "keyword",
        "support.type.exception.python": "exception",
        "storage.type.class.python": "special-keyword",
        "entity.name.type.class.python": "class",
        "variable.parameter.function.language.python": "parameter",
        "variable.parameter.function.python": "parameter",
        "support.type.python": "type",
        "variable.language.python": "variable",
        "constant.numeric.integer.decimal.python": "number",
        "constant.other.caps.python": "constant",
        "constant.numeric.float.python": "number",
        "keyword.control.import.python": "keyword",
        "meta.function-call.arguments.python": "parameter",
        "variable.language.special.self.python": "variable",
        "meta.attribute.python": "attribute",
        "meta.function.python": "function",
        "punctuation.definition.parameters.begin.python": "bracket",
        "punctuation.definition.parameters.end.python": "bracket",
        "punctuation.definition.list.begin.python": "bracket",
        "punctuation.definition.list.end.python": "bracket",
        "punctuation.definition.arguments.begin.python": "bracket",
        "punctuation.definition.arguments.end.python": "bracket",
        "punctuation.definition.dict.begin.python": "bracket",
        "punctuation.definition.dict.end.python": "bracket",
        "punctuation.definition.decorator.python": "punctuation-decorator",
        "meta.fstring.python": "string",
        "punctuation.separator.arguments.python": "punctuation",
        "punctuation.separator.element.python": "punctuation",
    }
    const classes = scopes.map(scope => mapping[scope]).filter(Boolean);
    return classes.join(' ');

}
function useTokenization(text, registry) {
    const [highlightedLines, setHighlightedLines] = useState([]);
    
    useEffect(() => {
        const allScopes = [];
        if (registry && text) {
            registry.loadGrammar('source.python').then(grammar => {
                let ruleStack = vsctm.INITIAL;
                const lines = text.split('\n');
                const resultLines = [];

                for (const line of lines) {
                    console.log(ruleStack);
                    const { tokens } = grammar.tokenizeLine(line, ruleStack);
                    const tokenizedLine = tokens.map(token => {
                        console.log(token);
                        const content = line.substring(token.startIndex, token.endIndex);
                        allScopes.push(...token.scopes);
                        const classes = mapScopesToClasses(token.scopes);
                        return <span scopes={token.scopes} className={classes}>{content}</span>;
                    });
                    resultLines.push(tokenizedLine);
                }
                console.log([...new Set(allScopes)]);
                setHighlightedLines(resultLines);
            });
        }
    }, [text, registry]);

    return highlightedLines;
}

export function Highlighted({ children }) {
    const onigLib = useOniguruma();
    const registry = useGrammarRegistry(onigLib);
    const highlightedLines = useTokenization(children, registry);

    return (
        <pre>
            {highlightedLines.map((line, index) => (
                <div key={index}>
                    {line}
                </div>
            ))}
        </pre>
    );
}
