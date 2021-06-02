## This project is not dead, I had not yet time to work on it, I'm going back to it soon.

# Library Customizer

## What is it?
* This projet consists in an UI that allows to easily edit the `config.css` file that manages [Shiina's Steam Library](https://github.com/AikoMidori/steam-library) config file.
* A lot more things are incoming, stay tuned!

## Why not just edit file directly?
* Because it's easier and way more convenient than opening another software, writing, saving.
* Doesn't need to download the file, as this software will automatically fetch content


## What is used?
* [NodeJS](https://nodejs.org) - JavaScript but with more possibilities!
* [Electron](https://www.npmjs.com/package/electron) - A kind of browser using NodeJS
* [Electron-Builder](https://www.npmjs.com/package/electron-builder) - To get exe, deb, and some other files
* [TypeScript](https://typescriptlang.org) - JavaScript, but with types (basically just transpiles to JS)
* [Webpack](https://sorrynolinkyet) - Minifier for javascript and anything

## Developpers
* Pull Requests are welcome, don't hesitate

## Build from source
* `npm install` or `yarn` - Install all needed dependencies
##### Development usage
* `npm run dev:build` or `yarn dev:build` - Compile and setup everything
* `npm run dev:watch` or `yarn dev:watch` - Watch instead of building once

##### Production usage
* `npm run build` or `yarn build` - Build and start the application

#### Start application
`npm start` or `yarn start`

**You can pack your own version by using `electron-builder`**
