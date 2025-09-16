import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

export default defineConfig({
    plugins: [pluginReact(), pluginTypeCheck()],
    output: {
        distPath: {
            root: "../../resources/static/",
            html: "html/",
            js: "js/",
            css: "css/",
        },
        cleanDistPath: true,
    },
    html: {
        favicon: "./src/favicon/favicon.ico",
        appIcon: {
            name: "chess",
            icons: [
                { src: "./src/favicon/android-chrome-512x512.png", size: 512 },
                { src: "./src/favicon/android-chrome-192x192.png", size: 192 },
            ]
        },
    },
});
