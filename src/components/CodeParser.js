import React from 'react';
import { useCodeParser } from '../hooks/use-code-parser';



const CodeParser = ({ children }) => {
    const parsedOutput = useCodeParser(children);

    return (
        <div>
            <pre>{parsedOutput}</pre>
        </div>
    );
};

export default CodeParser;
