const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const GA4WebpackPlugin = require('ga4-webpack-plugin');
const package = require('./package.json');
const webpack = require('webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');



/**
 * First Webpack Config
 *
 * I just try to put too much effort for this to try and look
 * for other possibilities and to figure out other features
 * */

var devMode = process.env['NODE' + '_ENV'] !== 'production';
const CONFIG = {
  output: {
    name: '[name].[contenthash]',
    chunk: '[id].[contenthash]',
    dir: 'dist' // Do not include './' or '/'
  },
  input: {
    entry: './src/index.ts', // Typescript only
    dir: 'src'
  },

  // Changing this during runtime will not going to parse it.
  // Restart the webpack to load
  env: {
    APP_VERSION: package.version
  },
  windowResizeable: false,

  // Manifesting and information

  // For site.webmanifest
  appName: 'Flappy Bird',
  shortAppName: 'FlappyBird',
  description: package.description,
  colors: {
    background: '#3a3a3c',
    theme: '#272738' // also injected into html
  },
  favicon: 'favicon.ico', // Must be ends with .ico
  icons: {
    src: path.resolve('src/assets/icon.png'),
    sizes: [96, 128, 256, 512]
  }
};

/**
 * Production Plugins
 * */
let prodPlugins = [
  new WebpackPwaManifest({
    name: CONFIG.appName,
    short_name: CONFIG.shortAppName,
    description: CONFIG.description,
    orientation: 'portrait',
    start_url: '.',
    display: 'standalone',
    background_color: CONFIG.colors.background,
    theme_color: CONFIG.colors.theme,
    icons: [
      {
        src: CONFIG.icons.src,
        sizes: CONFIG.icons.sizes,
        purpose: 'maskable'
      }
    ],

    // Asset config
    fingerprints: false, // Remove hashed in filename
    publicPath: './', // Make sure the url starts with
    inject: true, // Insert html tag <link rel="manifest" ... />
    filename: 'site.webmanifest'
  }),

  new WebpackManifestPlugin({
    basePath: '',
    publicPath: 'Flappybird/',
    fileName: 'asset-manifest.json'
  }),

  new WorkboxPlugin.GenerateSW({
    // these options encourage the ServiceWorkers to get in there fast
    // and not allow any straggling "old" SWs to hang around
    clientsClaim: true,
    skipWaiting: true,
  })
];

module.exports = function (env, config) {
  if (process.env['NODE' + '_ENV'] === void 0) {
    // From flag '--mode'
    devMode = config.mode !== 'production';
    CONFIG.env['NODE_ENV'] = config.mode;
  } else {
    CONFIG.env['NODE_ENV'] = process.env['NODE' + '_ENV'];
  }

  console.log('DEV MODE: ' + String(devMode) + '\n');

  if (devMode) {
    CONFIG.output.name = '[name]';
    CONFIG.output.chunk = '[id]';
    prodPlugins = [];
  }
  const DateToday = new Date().toISOString().substring(0, 10);

  return {
    entry: CONFIG.input.entry,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(jpe?g|png|gif|svg|webp)$/i,
          loader: 'file-loader'
        },
        {
          test: /\.(woff|ttf|otf|eot|woff2)$/i,
          loader: 'file-loader'
        },
        {
          test: /\.(wav|mp3|mp4|avi|ogg)$/i,
          loader: 'file-loader'
        },
        {
          test: /\.((s[ca]|c)ss)$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.scss', '.sass', '.css']
    },

    output: {
      filename: CONFIG.output.name + '.js',
      chunkFilename: CONFIG.output.chunk + '.js',
      path: path.resolve(__dirname, './' + CONFIG.output.dir),
      clean: true
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': Object.fromEntries(
          Object.entries(CONFIG.env).map((x) => [x[0], JSON.stringify(x[1])])
        )
      }),
      new GA4WebpackPlugin({
        id: 'G-TFPC622JKX',
        inject: !devMode, // Only inject in build mode
        callPageView: true
      }),

      new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        server: {
          baseDir: [CONFIG.output.dir]
        },

        files: ['./' + CONFIG.output.dir + '/*'],
        notify: false,
        ui: false, // Web UI for BrowserSyncPlugin
        open: false // Open browser after initiation
      }),

      new HtmlWebpackPlugin({
        filename: 'index.html',
        favicon: './' + path.join(CONFIG.input.dir, CONFIG.favicon),
        template: './' + path.join(CONFIG.input.dir, 'index.html'),
        //   manifest: './src/site.webmanifest',
        showErrors: devMode, // Include html error on emitted file
        lang: 'en',
        meta: {
          'viewport':
            'width=device-width, initial-scale=1, shrink-to-fit=no' +
            (CONFIG.windowResizeable ? '' : ',user-scalable=no'),
          'robots': 'index,follow',
          'referrer': 'origin',
          'charset': { charset: 'UTF-8' },
          'http-equiv': {
            'http-equiv': 'Content-Type',
            'content': 'text/html; charset=UTF-8'
          },
          'http-equiv-IE': {
            'http-equiv': 'X-UA-Compatible',
            'content': 'IE=edge'
          },
          'color-scheme': 'light dark',
          'description': package.description,

          // Extended
          'version': package.version,
          'author': package.author,
          'dc.creator': package.author,
          'keywords': package.keywords.join(','),

          // Open Graph
          'og:title': {
            property: 'og:title',
            content: CONFIG.appName
          },
          'og:description': {
            property: 'og:description',
            content: package.description
          },
          'og:url': {
            property: 'og:url',
            content: package.homepage
          },
          'og:type': {
            property: 'og:type',
            content: 'app'
          },
          'og:site_name': {
            property: 'og:site_name',
            content: 'jxmked page'
          },
          'og:image:url': {
            property: 'og:image:url',
            content:
              'https://raw.githubusercontent.com/jxmked/resources/xio/assets/icons/light/Windows/Square310x310Logo.scale-400.png'
          },
          'og:image:width': {
            property: 'og:image:width',
            content: '1240'
          },
          'og:image:height': {
            property: 'og:image:height',
            content: '1240'
          },
          'og:image:alt': {
            property: 'og:image:alt',
            content: 'Logo'
          },
          'apple-meta-01': {
            name: 'apple-mobile-web-app-capable',
            content: 'yes'
          },
          'apple-meta-02': {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black-translucent'
          },
          'apple-meta-03': {
            name: 'apple-touch-icon',
            content: './favicon.ico'
          },
          'apple-meta-04': {
            name: 'apple-mobile-web-app-title',
            content: CONFIG.appName
          },
          'tel-meta': {
            name: 'format-detection',
            content: 'telephone=no'
          },
          'twitter:card': {
            name: 'twitter:card',
            content: 'app'
          },
          'twitter:title': {
            name: 'twitter:title',
            content: CONFIG.appName
          },
          'twitter:description': {
            name: 'twitter:description',
            content: package.description
          },
          'twitter:image': {
            name: 'twitter:image',
            content:
              'https://raw.githubusercontent.com/jxmked/resources/xio/assets/icons/light/Windows/Square310x310Logo.scale-400.png'
          },
          'geo.country': {
            name: 'geo.country',
            content: 'PH'
          },
          'date': {
            name: 'date',
            content: DateToday
          },
          'dcterms.created': {
            name: 'dcterms.created',
            content: DateToday
          },
          'dcterms.modified': {
            name: 'dcterms.modified',
            content: DateToday
          }
        }
      }),

      new MiniCssExtractPlugin({
        filename: CONFIG.output.name + '.css',
        chunkFilename: CONFIG.output.chunk + '.css'
      }),

      new InterpolateHtmlPlugin({
        CDN: '',
        PUBLIC_URL: '',
        TITLE: CONFIG.appName,
        APP_VERSION: package.version,
        APP_MODE: devMode ? 'development' : 'production'
      })
    ].concat(prodPlugins)
  };
};
