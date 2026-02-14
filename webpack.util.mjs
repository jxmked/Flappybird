import HTMLMinifier from 'html-minifier';
import jsonminify from 'jsonminify';

export function json_minifier(content, absoluteFrom) {
  content = content.toString('utf8');

  return Buffer.from(jsonminify(content));
}

export function html_minifier(content, absoluteFrom) {
  content = content.toString('utf8');

  const minified = HTMLMinifier.minify(content, {
    html5: true,
    keepClosingSlash: true,
    minifyCSS: true,
    quoteCharacter: '"',
    removeComments: true,
    minifyJS: true,
    removeTagWhitespace: true,
    caseSensitive: true
  });

  return Buffer.from(minified);
}