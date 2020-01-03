import { promisify } from 'util';
import { exec } from 'child_process';
import { join } from 'path';
import { app, BrowserWindow } from 'electron';

let win: BrowserWindow | null;

const child = promisify(exec);
const createWindow = async () => {
	// Create a new browser window
	win = new BrowserWindow({
		fullscreenable: false,
		enableLargerThanScreen: false,
		resizable: false,

		backgroundColor: '#191919',

		title: 'Library Customizer',

		width: 1300,
		height: 800,
		webPreferences: {
			nodeIntegration: true
		}
	});

	// Unreference win on close
	win.on('close', () => {
		win = null;
	});

	let steamPath;

	if (process.platform === 'win32') {
		const { stdout } = await child('reg query HKEY_CURRENT_USER\\Software\\Valve\\Steam /v SteamPath /t REG_SZ')
			.catch(() => Object({ stdout: void (0) }));

		steamPath = join(
			stdout
				.replace(
					/HKEY_CURRENT_USER\\Software\\Valve\\Steam\r\n(\s|\t)+SteamPath(\s|\t)+REG_SZ(\s|\t)+/,
					''
				)
				.replace(/\r\n|/g, '')
				.replace(/[A-Z].+/, '')
		);
	} else {
		steamPath = process.platform === 'darwin'
			? 'Not yet supported'
			: join(`/home/${process.env.USER}/.local/share/Steam`, '');
	}

	if (typeof steamPath === 'undefined') {
		return win.loadURL(`file://${join(__dirname, 'install.html')}`);
	}


	// Load HTML file to show and pass some variables
	// @ts-ignore
	global.steamPath = steamPath;

	win.loadURL(`file://${join(__dirname, 'index.html')}`)
		.catch(console.error);

	win.webContents.openDevTools();
};

app.on('ready', createWindow);
app.on('activate', () => win === null && createWindow());