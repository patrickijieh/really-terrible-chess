import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './component/Home';
import CreateRoom from './component/CreateRoom';
import JoinRoom from './component/JoinRoom';

const rootEl = document.getElementById('body');
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create-room" element={<CreateRoom />} />
                    <Route path="/join-room" element={<JoinRoom />} />
                </Routes>
            </BrowserRouter>
        </React.StrictMode>,
    );
}
