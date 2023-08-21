import React from 'react';
import ReactDOM from 'react-dom';
import CodeParser from './components/CodeParser';

const App = () => {
    return (
        <div>
            <h1>Code Parser</h1>
            <CodeParser />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
