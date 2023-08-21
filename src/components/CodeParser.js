import React, { useState, useEffect } from 'react';

const CodeParser = () => {
    const [sourceCode, setSourceCode] = useState('');
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

    const handleParse = () => {
        if (parser && language) {
            const tree = parser.parse(sourceCode);
            setParsedOutput(tree.rootNode.toString());
        }
    };

    return (
        <div>
            <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                placeholder="Enter your code here..."
                rows="10"
                cols="50"
            ></textarea>
            <br />
            <button onClick={handleParse}>Parse Code</button>
            <pre>{parsedOutput}</pre>
        </div>
    );
};

export default CodeParser;
