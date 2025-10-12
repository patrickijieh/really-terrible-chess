import React from 'react';
import ReactDOM from 'react-dom/client';
import ChessGame from './component/chess/ChessGame.tsx';

const rootEl = document.getElementById('body');
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
        <React.StrictMode>
            <ChessGame />
        </React.StrictMode>,
    );
}
