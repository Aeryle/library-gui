/* eslint-disable @typescript-eslint/indent */
import Config from './Config';
import * as phin from 'phin';
import { resolve } from 'path';
import { promises as fs } from 'fs';

interface IParsed {
	property: string;
	value: string;
	options?: string;
	description?: string;
}

export default class Parser extends Config {
	private file: string | Buffer | phin.IResponse = '';

	private readonly result: string[] = [];

	public async start(): Promise<string[]> {
		this.file = await super.readFile();
		this.file = this.file.hasOwnProperty('body')
			? (this.file as phin.IResponse).body.toString()
			: this.file.toString();

		const parsed = this.parseFile();
		parsed.forEach((v, c) => this.addPicker(c, v));

		return this.result;
	}

	private parseFile(): Map<string, IParsed[]> {
		// Prepare the file to be parsed
		const css: string[] = (this.file as string)
			.replace(/\/\* MODIFICATIONS DOWN BELOW \*\/((\r)?\n){2}/, '')
			.split('\n')
			.map(str => str.replace(/\r$/, ''))
			.filter(s => s !== '');

		// The Map object that will contain all parsed categories
		const categories: Map<string, string[] | IParsed[]> = new Map();

		// Regex to remove unwanted values
		const stripComments = /^(\s|\t)+\/\*.+\*\//i;
		const stripVars = /var\(--[a-z0-9-_]+\)/i;

		// Create an alternative array so we don't conflict with main one
		const _categories: string[][] = css
			.join('\n')
			.split('}')
			.map(c => c.split('\n').filter(s => s !== ''));

		// Remove an entry from the array
		_categories.pop();
		// Loop over alternative array to interact with the main categories one
		_categories.forEach(category => {
			// Get the name
			const name = category.shift()!.replace(/:root { \/\* (.+) \*\//, '$1');

			// Add the category
			categories.set(
				name,
				category
					.filter(c => !stripVars.test(c) && !stripComments.test(c))
					.map(c => c.replace(/^(\s|\t)+/, ''))
					.filter(c => c !== '')
			);
		});

		// Regex to get the property
		const property = '--(?<property>[a-z0-9-]+)';
		// Regex to get the value
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const value = '(?<value>.+)';
		// Regex to get the comments, or make an interactive dropdown
		const space = ' {0,2}';

		const options = '[a-z0-9,<>()|/ ]+';

		const text = '[a-z0-9$,/ ]+';

		const comments = [
			`(?<description>(?!${text}\\[${options}\\])+${text})`,
			`${text}(?<options>\\[${options}\\])${text}`
		].join('|');

		// Final regex that will loop over the Array & parse the CSS
		const regexParser = new RegExp([
			`${property}:${space}`,
			`${value};${space}`,
			`(\\/\\*${space}`,
			`(${comments})${space}`,
			`\\*\\/)?`
		].join(''), 'i');

		categories.forEach(
			(category, name) => {
				categories.set(
					name,
					// @ts-ignore
					(category as string[])
						.map(c => regexParser.exec(c)!.groups)
				);
			}
		);

		return categories as Map<string, IParsed[]>;
	}

	private getOption(option: string, v: IParsed): string {
		if (option.includes('>')) {
			const [min, max] = option.split(' > ').map(m => m.replace(/[^0-9]/g, ''));

			return `<div class="row mb-2">
								<!-- Property name -->
								<span class="col-sm-3 border-bottom border-left border-top border-light">${v.property}</span>
								
								<!-- Dropdown -->
								<input class="col-sm-5 px-1"
											 aria-details="px"
											 type="number"
											 min="${min}"
											 max="${max}"
											 value="${v.value.replace(/[^0-9]/g, '')}">
							</div>`;
		} else if (option.includes('|')) {
			return `
					<div class="row mb-2">
						<!-- Property name -->
						<span class="col-sm-3 border-bottom border-left border-top border-light">${v.property}</span>
						
						<!-- Dropdown -->
						<select name="${v.property}">
							${
				option
					.replace(/^\[/, '')
					.replace(/]$/, '')
					.split(' | ')
					.map(o =>
						`<option value="${o.replace(/ /, '')}" ${o.replace(/ /g, '') === v.value ? 'selected' : ''}>
							${o.replace(/ /, '')}
						</option>`)
					.join('\n')
			}
							</select>

					</div>`.replace(/^(\s|\t)+/gm, '');
		}

		return '';
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private addPicker(category: string, values: IParsed[]): void {
		const template = (v: IParsed): string => {
			if (!v.options) {
				return `
					<div class="row mb-2"
						<!-- Property name -->
						<span class="col-sm-3 border-bottom border-left border-top border-light">${v.property}</span>
						
						<!-- Values, transform into a picker if needed -->
						<input
							class="col-sm-5 px-1 ${/^(#|rgba?)/.test(v.value) ? 'color-picker' : ''}"
							type="text"
							value="${v.value.replace(/"/g, '&quot;')}">
							
						<!-- Description -->
						${v.description ? `<span class="ml-auto w-25">${v.description}</span>` : ''}
					</div>`.replace(/^(\s|\t)+/gm, '');
			} else if (v.options) {
				return this.getOption(v.options, v);
			}

			return '';
		};

		this.result.push(
			`<div class="category"
						id="${category.toLowerCase()}">
				<button class="text-center show-or-hide" type="button">${`${category.toUpperCase()} (click)`}</button>
				<div class="container-fluid pick">${values.map(v => template(v)).join('\n')}</div>
			</div>`
		);
	}

	// noinspection JSUnusedLocalSymbols
	private async writeFile(categories: [ [ string, string[] ] ]): Promise<any> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const file: string = resolve(await super.getPath(), 'config.css');
		const content = categories.map(c => Parser.makeCSS(c)).join('\n\n');

		await fs.writeFile(file, content);

		return '';
	}

	private static makeCSS(category: [ string, string[] ]): string {
		return `:root { /* ${category[0]} */\n${category[1].map(v => `\t--${v}`).join('\n')}\n}`;
	}
}
