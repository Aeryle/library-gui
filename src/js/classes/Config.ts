import { promises as fs } from 'fs';
import { promisify } from 'util';
import { resolve } from 'path';
import * as phin from 'phin';

// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const regedit = require('regedit');

type TSteam = { 'HKCU\\Software\\Valve\\Steam': ISteamReg } | undefined;

export interface ISteamReg {
	keys: string[];
	values: ISteamKeys;
}

export interface ISteamKeys {
	Language: IAutoLoginUser;
	SteamExe: IAutoLoginUser;
	SteamPath: IAutoLoginUser;
	SuppressAutoRun: IAlreadyRetriedOfflineMode;
	Restart: IAlreadyRetriedOfflineMode;
	RunningAppID: IAlreadyRetriedOfflineMode;
	BigPictureInForeground: IAlreadyRetriedOfflineMode;
	IAutoLoginUser: IAutoLoginUser;
	RememberPassword: IAlreadyRetriedOfflineMode;
	SourceModInstallPath: IAutoLoginUser;
	Rate: IAutoLoginUser;
	IAlreadyRetriedOfflineMode: IAlreadyRetriedOfflineMode;
	DWriteEnable: IAlreadyRetriedOfflineMode;
	StartupMode: IAlreadyRetriedOfflineMode;
	SkinV5: IAutoLoginUser;
}

export interface IAlreadyRetriedOfflineMode {
	type: string;
	value: number;
}

export interface IAutoLoginUser {
	type: string;
	value: string;
}


export default class Config {
	public constructor(vbsDirectory: string) {
		regedit.setExternalVBSLocation(vbsDirectory);
	}

	// noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
	private darwin(): void {
		return void 0;
	}

	// noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
	private freebsd(): void {
		return void 0;
	}

	// noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
	private openbsd(): void {
		return void 0;
	}

	// noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
	private sunos(): void {
		return void 0;
	}

	// noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
	private aix(): void {
		return void 0;
	}

	// noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
	private android(): void {
		return void 0;
	}

	// noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
	private cygwin(): void {
		return void 0;
	}

	// noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
	private netbsd(): void {
		return void 0;
	}

	// noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
	private linux(): string {
		return '~/.steam/steam';
	}

	// noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
	private async win32(): Promise<string | undefined> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const key = 'HKCU\\Software\\Valve\\Steam';
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const reg: TSteam = await promisify(regedit.list)(key).catch(void 0);

		return reg!.hasOwnProperty(key) ? reg![key].values.SteamPath.value : void 0;
	}

	protected async readFile() {
		const path = await this.getPath();

		return fs.readFile(
			resolve(path, 'config.css'),
			'r'
		)
			.catch(async () => phin({
				url: 'https://aikomidori.github.io/steam-library/config.css',
				method: 'GET'
			}));
	}

	protected async getPath(): Promise<string> {
		const path = (await this[process.platform]());

		if (!path) {
			throw new Error(`OS ${process.platform} is not supported`);
		}

		return resolve(path, 'steamui');
	}
}
