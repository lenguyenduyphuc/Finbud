import webpack from 'webpack';
import path from 'path';
import Dotenv from 'dotenv-webpack';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default {
    transpileDependencies: [],
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
    pages: {
        index: {
            entry: 'src/main.js', // Correct path to main.js relative to the frontend directory
            template: 'public/index.html',
            filename: 'index.html',
            title: 'Finbud',
        },
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                'vue$': 'vue/dist/vue.esm.js'
            },
            fallback: {
                process: 'process/browser',
            }
        },
        module: {
            rules: [
                {
                    test: /\.csv$/,
                    use: 'raw-loader'
                }
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                process: 'process/browser',
                Buffer: ['buffer', 'Buffer']
            }),
            new webpack.DefinePlugin({
                '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': false, // Ensure it's set to false for production
                '__VUE_OPTIONS_API__': true,
            }),
            new Dotenv(),
            new NodePolyfillPlugin(),
            new CopyWebpackPlugin({
            patterns: [
                {
                from: 'node_modules/pdfjs-dist/build/pdf.worker.min.js',
                to: 'pdf.worker.min.js'
                }
            ]
            }),
        ]
    }
};
