import React from 'react';
import ReactDOM from 'react-dom/client';
import Game from './component/chess/GameClient.tsx';

const rootEl = document.getElementById('body');
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
        <React.StrictMode>
            <Game />
        </React.StrictMode>,
    );
}
