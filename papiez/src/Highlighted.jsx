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
        "punctuation.definition.parameters.begin.python": "bracket",
        "punctuation.definition.parameters.end.python": "bracket",
        "variable.parameter.function.keyword.python": "parameter",
        "string.quoted.double.single-line.python": "string",
        "punctuation.definition.list.begin.python": "bracket",
        "punctuation.definition.list.end.python": "bracket",
        // "meta.function.python": "bracket",
        "keyword.control.flow.python": "keyword",
        "keyword.operator.logical.python": "special-keyword",
    }
    for (const scope of scopes) {
        if (mapping[scope]) {
            return mapping[scope];
        }
    }
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
                    const { tokens } = grammar.tokenizeLine(line, ruleStack);
                    const tokenizedLine = tokens.map(token => {
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
