const fs = require('fs');
const path = require('path');
const vsctm = require('vscode-textmate');
const oniguruma = require('vscode-oniguruma');

function readFileAsync(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

function loadOnigurumaLibrary() {
    const wasmPath = path.join(__dirname, './node_modules/vscode-oniguruma/release/onig.wasm');
    const wasmBinary = fs.readFileSync(wasmPath).buffer;
    return oniguruma.loadWASM(wasmBinary).then(() => {
        return {
            createOnigScanner: patterns => new oniguruma.OnigScanner(patterns),
            createOnigString: s => new oniguruma.OnigString(s)
        };
    });
}

function grammarLoader(scopeName) {
    if (scopeName === 'source.python') {
        return readFileAsync('./Python.tmLanguage').then(data => vsctm.parseRawGrammar(data.toString()));
    }
    console.log(`Unknown scope name: ${scopeName}`);
    return null;
}

function setupRegistry() {
    return new vsctm.Registry({
        onigLib: loadOnigurumaLibrary(),
        loadGrammar: grammarLoader
    });
}

function tokenizeAndLog(grammar) {
    const sampleText = [
        `def sayHello(name):`,
        `    return "Hello, " + name`,
        `sayHello("World")`
    ];
    let ruleStack = vsctm.INITIAL;

    for (const line of sampleText) {
        const { tokens, ruleStack: newRuleStack } = grammar.tokenizeLine(line, ruleStack);
        console.log(`\nTokenizing line: ${line}`);
        tokens.forEach(token => {
            console.log(` - token from ${token.startIndex} to ${token.endIndex} ` +
                `(${line.substring(token.startIndex, token.endIndex)}) ` +
                `with scopes ${token.scopes.join(', ')}`
            );
        });
        ruleStack = newRuleStack;
    }
}

const registry = setupRegistry();
registry.loadGrammar('source.python').then(tokenizeAndLog);
