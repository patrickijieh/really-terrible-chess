import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './component/Home';
import CreateRoom from './component/CreateRoom';
import JoinRoom from './component/JoinRoom';
import SignupPage from './component/Signup';
import LoginPage from './component/Login';

const rootEl = document.getElementById('body');
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<CreateRoom />} />
                    <Route path="/join" element={<JoinRoom />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </BrowserRouter>
        </React.StrictMode>,
    );
}
