const { favicons } = require('favicons');
const path = require('path');
const fs = require('fs');

// Only generate a few types of icons
const templates = [
  'favicon.ico',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
];

async function generate() {
  const source = path.resolve(__dirname, '../public/assets/favicon.svg');

  const config = {
    path: '/assets',
    appName: 'React 2048',
    appShortName: '2048',
    icons: {
      appleStartup: false,
      windows: false,
      yandex: false,
    },
  };

  const response = await favicons(source, config);

  for (const image of response.images) {
    if (!templates.includes(image.name)) continue;

    const imageDir = path.resolve(__dirname, `../public/assets/${image.name}`);
    fs.writeFile(imageDir, image.contents, (err) => {
      if (err) return console.error(err.message);
      console.log(`Save image <${image.name}> in file.`);
    });
  }
}

generate();
