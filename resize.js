/**
 * This script resizes all
 * images to the desired
 * dimensions. (32x32 by default)
 */

const sharp = require('sharp');
const chalk = require('chalk');
const { readdirSync } = require('fs');
const { readFile, writeFile } = require('fs/promises');
const { join } = require('path');

const size = [32, 32];
const custom = process.argv[2];
if (custom) {
	const [width, height] = custom.split('x');
	if (isNaN(width)) {
		console.log(chalk.red('Invalid width provided:', width || '[none]'));
		process.exit(1);
	}
	if (isNaN(height)) {
		console.log(chalk.red('Invalid height provided:', height || '[none]'));
		process.exit(1);
	}

	size[0] = parseInt(width);
	size[1] = parseInt(height);
}

console.log(
	chalk.blue(`Resizing to dimensions ${chalk.yellow(`${size[0]}x${size[1]}`)}`)
);

const FOLDER = 'icons';
const start = Date.now();
Promise.all(
	readdirSync(FOLDER)
		.sort()
		.map(async name => {
			const start = Date.now();
			const path = join(FOLDER, name);
			const icon = await readFile(path);

			const resized = await sharp(icon).resize(size[0], size[1]).toBuffer();
			await writeFile(path, resized);
			console.log(
				chalk.cyan(
					`Resized ${chalk.blue(name)} in ${chalk.bold(
						`${Date.now() - start}ms`
					)}`
				)
			);
		})
).then(() => {
	console.log(
		chalk.green(
			`Finished process in ${chalk.magenta(`${Date.now() - start}ms`)}`
		)
	);
});
