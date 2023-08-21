import React from 'react';
import { useCodeParser } from '../hooks/use-code-parser';

export default function CodeParser({ children }) {
    const parsedOutput = useCodeParser(children);
    return <pre>{parsedOutput}</pre>
};
