import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './component/Home';
import CreateRoom from './component/CreateRoom';
import JoinRoom from './component/JoinRoom';
import Game from './component/Game';

const rootEl = document.getElementById('root');
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create-room" element={<CreateRoom />} />
                    <Route path="/join-room" element={<JoinRoom />} />
                    <Route path="/game" element={<Game />} />
                </Routes>
            </BrowserRouter>
        </React.StrictMode>,
    );
}
