// import laravel from "laravel-vite-plugin";
// import { defineConfig } from "vite";

// export default defineConfig({
//     plugins: [
//         laravel({
//             input: ["resources/css/app.css", 'resources/js/app.jsx'],
//             refresh: true,
//         }),
//     ],
// });

// vite.config.ts
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite'; // Import the Tailwind CSS Vite plugin

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        tailwindcss(), // Add the Tailwind CSS Vite plugin
    ],
});
