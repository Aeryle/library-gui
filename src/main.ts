import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import * as dotenv from 'dotenv';

import Parser from './js/classes/Parser';

// @ts-ignore
global.Parser = Parser;

dotenv.config({ path: join(process.cwd(), 'config', '.env') });

/* Import CSS files */
import './scss/main.scss'; // Main file

let win: BrowserWindow | undefined;

const isDev = process.env.ELECTRON_ENV === 'development';

const createWindow = () => {
	win = new BrowserWindow({
		backgroundColor: '#121212',
		darkTheme: true,
		height: 500,
		width: 1000,
		resizable: false,
		title: 'Lib\'s Editor',
		webPreferences: {
			devTools: isDev,
			nodeIntegration: true
		}
	});

	win.loadURL(`file://${join(__dirname, 'index.html')}`)
		.catch(undefined);
};

app.on('ready', createWindow);

app.on('activate', () => win === null ? createWindow() : undefined);
