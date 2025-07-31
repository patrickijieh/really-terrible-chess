import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
    plugins: [pluginReact()],
    output: {
        distPath: {
            root: "../../resources/static/",
            html: "html/",
            js: "js/",
            css: "css/",
        },
        cleanDistPath: true,
    }
});
