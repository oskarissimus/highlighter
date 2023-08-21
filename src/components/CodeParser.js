import React, { useState, useEffect } from 'react';

const useCodeParser = (sourceCode) => {
    const [parsedOutput, setParsedOutput] = useState('');
    const [parser, setParser] = useState(null);
    const [language, setLanguage] = useState(null);

    useEffect(() => {
        // Initialize the web-tree-sitter library
        const Parser = require('web-tree-sitter');
        Parser.init().then(async () => {
            const newParser = new Parser();
            setParser(newParser);

            const PythonLanguage = await Parser.Language.load('./tree-sitter-python.wasm');
            newParser.setLanguage(PythonLanguage);
            setLanguage(PythonLanguage);
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


const CodeParser = ({ children }) => {
    const parsedOutput = useCodeParser(children);

    return (
        <div>
            <pre>{parsedOutput}</pre>
        </div>
    );
};

export default CodeParser;
