import { remote } from 'electron';
import { promises as fs } from 'fs';
import { join } from 'path';
import { stripIndents } from 'common-tags';

interface ConstructorParams {
	path: string;
}

class Editor {
	public path: string;

	public constructor({ path }: ConstructorParams) {
		this.path = path;
	}

	public async start() {
		await this.read();
	}

	public async read() {
		const url = 'https://aikomidori.github.io/steam-library/config.css';
		// @ts-ignore
		const file: string = await fs.readFile(
			join(
				this.path,
				'css',
				'config.css'
			)
		)
			.then(f => f
				.join(' ')
				.split(' ')
			// @ts-ignore
				.map(c => String.fromCharCode(c))
				.join(''))
			.catch(() => null) ||
			(
				await (
					(
						(
							await window.fetch(url)
						).body!
					)
						.getReader()
						.read()
				)
			)
				.value
				// @ts-ignore
				.join(' ')
				.split(' ')
				// @ts-ignore
				.map((c: string) => String.fromCharCode(c))
				.join('');


		const parsed = this.parseProperties(file);

		const HTML = parsed
			.map(
				({ property, value, comment }) => stripIndents`
					<div class="values">
						<span>${property}</span>
						<span>
							<input type="${value.startsWith('#') ? 'color' : 'text'}"
								name="value"
								value="${value.replace(/"/g, '&quot;')}">
						</span>
						<span>${comment}</span>
						</div>
				`
			);

		document.getElementById('parser')!.innerHTML = HTML.join('\n');
		this.write(file.split('\n'));
	}

	public parseProperties(file: string) {
		const regex = /(--(\w|\d|-)+):\s*(.+);?(\/\*.+\*\/)?/;

		return file
			.split('\n')
			.filter(line => regex.test(line))
			.map(line => {
				const [, property, , value] = regex.exec(line)!;
				const comment = /\/\*(.*)\*\//.exec(value)
					? /\/\*(.*)\*\//.exec(value)![0]
					: '\u200B';

				return {
					property: property.replace(/^--/, ''),
					value: value
						.replace(/^\s*/g, '')
						.replace(/\/\*.+(\*\/|\/\*)\s*$/, '')
						.replace(/;\s*$/, ''),
					comment
				};
			});
	}

	public parseHTML() {
		return Array
			.from(document.getElementsByClassName('values'))
			.map(div => Array
				.from(div.children)
				.map(
					(span, i) => i === 1
						? [
							(
								span
									.children
									.item(0) as unknown as { value: string }
							).value.toUpperCase(),
							(
								span
									.children
									.item(0) as unknown as { defaultValue: string }
							).defaultValue.toUpperCase()
						]

						: span.innerHTML
				));
	}

	public write(lines: string[]) {
		document
			.getElementById('save')!
			.addEventListener('click', async e => {
				try {
					this.parseHTML()
						.filter(([, value]) => value[0] !== value[1])
						.forEach(
							([property, value, comment]) => {
								const regex = new RegExp(`(\\s*|\\t*)--(${property}):\\s*(${value[1]});?(\\s*(${comment}))?`);

								lines = lines.map(line => regex.test(line)
									? line.replace(regex, `$1--${property}: ${value[0].toUpperCase()};${comment === '\u200B' ? '' : ` ${comment}`}`)
									: line);
							}
						);

					await fs.writeFile(
						join(
							this.path,
							'css',
							'config.css'
						),
						Buffer.from(lines.join('\n')),
						{ flag: 'w+' }
					);

					const button = document.getElementById('save') as HTMLButtonElement;
					button.innerText = 'SAVED';
					button.setAttribute(
						'style',
						'background-color: #83373D; color: #767676;'
					);
					button.disabled = true;

					e.preventDefault();
				} catch (error) {
					process.stdout.write(error, 'error');
				}
			});
	}
}

new Editor({ path: remote.getGlobal('steamPath') })
	.start()
	.catch(e => process.stdout.write(e));