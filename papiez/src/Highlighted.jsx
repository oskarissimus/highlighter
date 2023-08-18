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


function useTokenization(text, registry) {
    const [highlightedLines, setHighlightedLines] = useState([]);

    useEffect(() => {
        console.log('useTokenization');
        console.log(text);
        console.log(registry);
        if (registry && text) {
            registry.loadGrammar('source.python').then(grammar => {
                let ruleStack = vsctm.INITIAL;
                const lines = text.split('\n');
                const resultLines = [];

                for (const line of lines) {
                    const { tokens } = grammar.tokenizeLine(line, ruleStack);
                    const tokenizedLine = tokens.map(token => {
                        const content = line.substring(token.startIndex, token.endIndex);
                        const className = token.scopes.join(' '); // Using scopes as class names
                        return <span className={className}>{content}</span>;
                    });
                    resultLines.push(tokenizedLine);
                }

                setHighlightedLines(resultLines);
            });
        }
    }, [text, registry]);

    return highlightedLines;
}

export function Highlighted({ children }) {
    console.log(pythonGrammar)
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
