import React from 'react';
import ReactDOM from 'react-dom/client';
import Profile from "./pages/Profile.tsx";

const rootEl = document.getElementById('body');
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
        <React.StrictMode>
            <Profile />
        </React.StrictMode>,
    );
}