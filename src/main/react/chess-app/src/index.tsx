import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './home';
import CreateRoom from './create_room';
import JoinRoom from './join_room';
import Game from './game';

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
