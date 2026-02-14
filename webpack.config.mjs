import url from 'url';
import path from 'path';
import fs from 'fs';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import InterpolateHtmlPlugin from 'interpolate-html-plugin';
import GA4WebpackPlugin from 'ga4-webpack-plugin';
import webpack from 'webpack';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import dotenv from 'dotenv';
import ENTRIES from './entries.mjs';
import WorkboxPlugin from 'workbox-webpack-plugin';
import entries from './entries.mjs';
import * as webpack_util from './webpack.util.mjs';

dotenv.config();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const __read_file__ = fs.readFileSync(path.join(__dirname, './package.json'), { encoding: "utf8" });
const packageJson = JSON.parse(__read_file__);

let devMode = process.env['NODE' + '_ENV'] !== 'production';
const CONFIG = {
  output: {
    // We're having an issue with mismatch hash
    // During build mode. Better to remove it "Pansamantagal"?
    // name: '[name].[contenthash]',
    // chunk: '[id].[contenthash]',
    name: '[name]',
    chunk: '[id]',
    dir: 'dist' // Do not include './' or '/'
  },
  input: {
    entry: {}, // Do not fill
    dir: 'src'
  },

  // Changing this during runtime will not going to parse it.
  // Restart the webpack to load
  env: {},
  windowResizeable: entries.MISC_CONF.windowResizeable,

  // Manifesting and information

  // For site.webmanifest
  appName: ENTRIES.appName,
  shortAppName: ENTRIES.shortAppName,
  description: packageJson.description,
  colors: {
    background: ENTRIES.PWA.background,
    theme: ENTRIES.PWA.theme_color // also injected into html
  },
  icons: {
    src: path.resolve('src/assets/icon.png'),
    sizes: [96, 128, 256, 512]
  },
  appType: 'app'
};

/**
 * Production Plugins
 * */
const prodPlugins = [
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
    publicPath: '/', // Make sure the url starts with
    inject: true, // Insert html tag <link rel="manifest" ... />
    filename: 'site.webmanifest'
  }),
  new WebpackManifestPlugin({
    basePath: '',
    publicPath: ENTRIES.publicPath,
    fileName: 'asset-manifest.json'
  })
];

/**
 * Handle App Repository Url
 * */
const APP_REPOSITORY = packageJson.repository.url.replace(/^git\+/i, '');

// Make the app work offline via caching
if (entries.MISC_CONF.availableOffline) {
  prodPlugins.push(new WorkboxPlugin.GenerateSW({
    // these options encourage the ServiceWorkers to get in there fast
    // and not allow any straggling "old" SWs to hang around
    clientsClaim: true,
    skipWaiting: true,
    mode: "production",
    additionalManifestEntries: ["site.webmanifest"]
  }))
}

export default function (env, config) {
  // DANGER!!!
  Object.assign(CONFIG.env, process.env);

  if (process.env['NODE' + '_ENV'] === void 0) {
    // From flag '--mode'
    devMode = config.mode !== 'production';
    CONFIG.env['NODE_ENV'] = config.mode;
  } else {
    CONFIG.env['NODE_ENV'] = process.env['NODE' + '_ENV'];
  }

  console.log('\nDEV MODE: ' + String(devMode) + '\n');

  Object.assign(CONFIG.env, ENTRIES.SHARED_ENV);

  if (devMode) {
    CONFIG.output.name = '[name]';
    CONFIG.output.chunk = '[id]';
    prodPlugins.splice(0, prodPlugins.length);
  }

  const iso_date_time = new Date().toISOString();
  const current_year = new Date().getFullYear();

  /**
   * This one wasnt efficient since if the port is taken, BrowserSyncPlugin will
   * use other port and this one will remain unchanged.
   * */
  const DYNAMIC_HOMEPAGE_URL = (
    devMode
      ? `http://${ENTRIES.DEV_ADDR.host}:${ENTRIES.DEV_ADDR.port}`
      : packageJson.homepage
  ).replace(/\/+$/gi, ''); // Remove / at the end

  CONFIG.env.APP_NAME = CONFIG.appName;
  CONFIG.env.APP_SHORT_NAME = CONFIG.shortAppName;
  CONFIG.env.APP_DESCRIPTION = CONFIG.description;
  CONFIG.env.APP_HOMEPAGE = DYNAMIC_HOMEPAGE_URL;
  CONFIG.env.APP_REPOSITORY = APP_REPOSITORY;
  CONFIG.env.AUTHOR = packageJson.author;
  CONFIG.env.PROJECT_NAME = packageJson.name;
  CONFIG.env.BUILD_DATE = iso_date_time.substring(0, 10);
  CONFIG.env.APP_VERSION = packageJson.version;

  const HTMLEntries = ENTRIES.pages.map(({ title, folder, output_folder }) => {
    CONFIG.input.entry[title] = './' + path.join(CONFIG.input.dir, folder, 'index.ts');

    return new HtmlWebpackPlugin({
      title: title,
      filename: output_folder === '' ? 'index.html' : `${output_folder}/index.html`,
      template: './' + path.join(CONFIG.input.dir, folder, `index.html`),
      //   manifest: './src/site.webmanifest',
      showErrors: devMode, // Include html error on emitted file
      lang: 'en',
      chunks: [title],
      meta: {
        'viewport':
          'width=device-width, initial-scale=1, shrink-to-fit=no,user-scalable=' +
          (CONFIG.windowResizeable ? 'yes' : 'no'),
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
        'color-scheme': 'light',
        'description': packageJson.description,

        // Extended
        'version': packageJson.version,
        'author': packageJson.author,
        'dc.creator': packageJson.author,
        'keywords': packageJson.keywords.join(','),

        // Open Graph
        'og:title': {
          property: 'og:title',
          content: CONFIG.appName
        },
        'og:description': {
          property: 'og:description',
          content: packageJson.description
        },
        'og:url': {
          property: 'og:url',
          content: packageJson.homepage
        },
        'og:type': {
          property: 'og:type',
          content: 'website'
        },
        'og:site_name': {
          property: 'og:site_name',
          content: ENTRIES.SITE_NAME
        },
        'og:image:url': {
          property: 'og:image:url',
          content: ENTRIES.PRODUCT_ICON.href
        },
        'og:image:width': {
          property: 'og:image:width',
          content: ENTRIES.PRODUCT_ICON.width
        },
        'og:image:height': {
          property: 'og:image:height',
          content: ENTRIES.PRODUCT_ICON.height
        },
        'og:image:alt': {
          property: 'og:image:alt',
          content: 'Logo'
        },
        'apple-meta-00': {
          name: 'apple-touch-fullscreen',
          content: 'no'
        },
        'apple-meta-01': {
          name: 'mobile-web-app-capable',
          content: 'yes'
        },
        'apple-meta-02': {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent'
        },
        'apple-meta-03': {
          name: 'apple-touch-icon',
          content: '/favicon.ico'
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
          content: packageJson.description
        },
        'twitter:image': {
          name: 'twitter:image',
          content: ENTRIES.PRODUCT_ICON.href
        },
        'geo.country': {
          name: 'geo.country',
          content: 'PH'
        },
        'date': {
          name: 'date',
          content: iso_date_time.toString()
        },
        'dcterms.created': {
          name: 'dcterms.created',
          content: iso_date_time.toString()
        },
        'dcterms.modified': {
          name: 'dcterms.modified',
          content: iso_date_time.toString()
        }
      }
    });
  });

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
          test: /\.(jpe?g|png|gif|svg|webp)$/,
          type: 'asset/resource'
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
            {
              loader: 'css-loader',
              options: {
                url: {
                  filter: url => !((/\.(jpe?g|png|gif|svg|webp)$/).test(url))
                }
              }
            },
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
      path: path.resolve(path.join(__dirname, CONFIG.output.dir)),
      clean: true
    },
    optimization: {
      runtimeChunk: 'single'
      /* splitChunks: {
        chunks: 'all'
      } */
    },

    plugins: [
      ...HTMLEntries,

      new webpack.DefinePlugin({
        'process.env': Object.fromEntries(
          Object.entries(CONFIG.env).map((x) => [x[0], JSON.stringify(x[1])])
        )
      }),

      new GA4WebpackPlugin({
        id: ENTRIES.GA4_MEASUREMENT_ID,
        inject: ENTRIES.GA4_MEASUREMENT_ID === false ? false : !devMode, // Only inject in build mode
        callPageView: true
      }),

      new MiniCssExtractPlugin({
        filename: CONFIG.output.name + '.css',
        chunkFilename: CONFIG.output.chunk + '.css'
      }),

      new BrowserSyncPlugin({
        host: ENTRIES.DEV_ADDR.host,
        port: ENTRIES.DEV_ADDR.port,
        server: {
          baseDir: [CONFIG.output.dir]
        },

        files: ['./' + CONFIG.output.dir + '/*'],
        notify: false,
        ui: false, // Web UI for BrowserSyncPlugin
        open: false // Open browser after initiation
      }),

      new InterpolateHtmlPlugin({
        CDN: '',
        PUBLIC_URL: DYNAMIC_HOMEPAGE_URL,
        TITLE: CONFIG.env.APP_NAME,
        APP_MODE: devMode ? 'development' : 'production',
        BASE_URL: DYNAMIC_HOMEPAGE_URL,
        CURRENT_YEAR: current_year,
        CURRENT_DATE: iso_date_time.substring(0, 10),
        APP_TITLE_LENGTH: CONFIG.env.APP_NAME.length,
        APP_NAME: CONFIG.env.APP_NAME,
        APP_SHORT_NAME: CONFIG.env.APP_SHORT_NAME,
        APP_DESCRIPTION: CONFIG.env.APP_DESCRIPTION,
        APP_HOMEPAGE: DYNAMIC_HOMEPAGE_URL,
        APP_REPOSITORY: CONFIG.env.APP_REPOSITORY,
        AUTHOR: CONFIG.env.AUTHOR,
        PROJECT_NAME: CONFIG.env.PROJECT_NAME,
        BUILD_DATE: CONFIG.env.BUILD_DATE,
        APP_VERSION: CONFIG.env.APP_VERSION
      }),

      new CopyPlugin({
        patterns: [
          {
            from: 'public/',
            transform: {
              transformer(content, absoluteFrom) {
                if (absoluteFrom.endsWith('.html')) {
                  return webpack_util.html_minifier(content, absoluteFrom);
                } else if (absoluteFrom.endsWith('.json')) {
                  return webpack_util.json_minifier(content, absoluteFrom);
                }

                return content;
              }
            }
          }
        ]
      })
    ].concat(prodPlugins)
  };
}
