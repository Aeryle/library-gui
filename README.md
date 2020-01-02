# Library Customizer

## What is it?
* This projet consists in an UI that allows to easily edit the `config.css` file that manages [Shiina's Steam Library](https://github.com/AikoMidori/steam-library) config file.

## Why not just edit file directly?
* Because it's easier and way more convenient than opening another software, writing, saving.
* Doesn't need to download the file, as this software will automatically fetch content


## What is used?
* [NodeJS](https://nodejs.org) - JavaScript but with more possibilities!
* [Electron](https://www.npmjs.com/package/electron) - A kind of browser using NodeJS
* [Electron-Builder](https://www.npmjs.com/package/electron-builder) - To get exe, deb, and some other files
* [TypeScript](https://typescriptlang.org) - JavaScript, but with types (basically just transpiles to JS)

## Developpers
* Pull Requests are welcome, don't hesitate

## Build from source
* `npm install` or `yarn` - Install all needed dependencies
##### Windows Users
* `npm run win:compile` or `yarn win:compile` - Compile and setup everything

##### Linux users
* `npm run compile` or `yarn compile` - Same as for windows

#### Start application
`npm start` or `yarn start`

**OPTIONAL** You can pack the APP in Windows, Linux & Darwin applications [MacOS is not supported yet inside the Customizer]
* `npm run prod:pack` or `yarn prod:pack`