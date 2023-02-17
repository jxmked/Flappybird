// https://stackoverflow.com/a/28374344
export const openInNewTab = (href: string): void => {
  Object.assign(document.createElement('a'), {
    target: '_blank',
    rel: 'noopener noreferrer',
    href: href
  }).click();
};
