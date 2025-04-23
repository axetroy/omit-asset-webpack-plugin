import test from "node:test";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import webpack, { Compiler, Configuration, Stats, Compilation } from "webpack";
import { createFsFromVolume, Volume } from "memfs";
import { Union } from "unionfs";

import OmitAssetPlugin from "../src/index";
import assert from "node:assert";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EmitAssetPlugin {
	constructor(private filename: string, private content: string) {}

	apply(compiler: Compiler) {
		compiler.hooks.thisCompilation.tap("EmitAssetPlugin", (compilation) => {
			compilation.hooks.processAssets.tap({ name: "EmitAssetPlugin", stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS }, () => {
				compilation.emitAsset(this.filename, new compiler.webpack.sources.RawSource(this.content));
			});
		});
	}
}

async function compile(entry: string, options: Configuration = {}) {
	const outDir = path.resolve(__dirname, "dist");

	const compiler = webpack({
		mode: "none",
		target: "node",
		context: path.resolve(__dirname, "fixtures"),
		entry: entry,
		output: {
			path: outDir,
			filename: "bundle.js",
		},
		...options,
	});

	const outputFileSystem = createFsFromVolume(new Volume());
	const inputFileSystem = new Union();
	// @ts-expect-error ignore
	inputFileSystem.use(fs).use(new Volume());

	// @ts-expect-error ignore
	compiler.outputFileSystem = outputFileSystem;
	compiler.inputFileSystem = inputFileSystem;
	compiler.resolverFactory.hooks.resolveOptions.for("normal").tap("OmitAssetPlugin", (resolveOptions) => {
		resolveOptions.fileSystem = inputFileSystem;
		return resolveOptions;
	});

	const stats = await new Promise<Stats | undefined>((resolve, reject) => {
		compiler.run((err, stats) => {
			if (err) {
				reject(err);
			} else {
				resolve(stats);
			}
		});
	});

	if (stats) {
		if (stats.hasErrors()) {
			throw new Error(`Webpack build failed`);
		}
	}

	const files = outputFileSystem.readdirSync(outDir);

	return files as string[];
}

test("webpack5 - empty options", async (t) => {
	const files = await compile("./index.js", {
		plugins: [new EmitAssetPlugin("LICENSE.txt", "hello world"), new OmitAssetPlugin()],
	});

	assert.ok(files.includes("LICENSE.txt"), "LICENSE.txt should be in the output");
});

test("webpack5 - ignore LICENSE.txt", async (t) => {
	const files = await compile("./index.js", {
		plugins: [
			new EmitAssetPlugin("LICENSE.txt", "hello world"),
			new OmitAssetPlugin({
				match: /LICENSE\.txt$/,
			}),
		],
	});

	assert.ok(!files.includes("LICENSE.txt"), "LICENSE.txt should not be in the output");
});
