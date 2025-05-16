import type { Compiler } from "webpack";
import { OmitAssetPluginOptions, Rule } from "./type";

/**
 * A plugin to omit assets from the output.
 * eg. omit the license file from the output.
 * Some security tools scan license files and treat the links in them as risky links.
 */
class OmitAssetPlugin {
	constructor(private options?: OmitAssetPluginOptions) {}

	apply(compiler: Compiler) {
		const match = this.options?.match;

		if (match) {
			const logger = compiler.getInfrastructureLogger("OmitAssetPlugin");

			compiler.hooks.thisCompilation.tap("OmitAssetPlugin", (compilation) => {
				compilation.hooks.processAssets.tap(
					{
						name: "OmitAssetPlugin",
						stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
					},
					() => {
						for (const filename in compilation.assets) {
							if (this.#match(filename, match)) {
								logger.info(`Omitting asset: ${filename}`);
								compilation.deleteAsset(filename);
							}
						}
					}
				);
			});
		}
	}

	#match(filename: string, rule: Rule): boolean {
		if (Array.isArray(rule)) {
			for (const item of rule) {
				if (this.#match(filename, item)) {
					return true;
				}
			}

			return false;
		} else {
			if (rule instanceof RegExp) {
				return rule.test(filename);
			} else if (typeof rule === "function") {
				return rule(filename);
			} else {
				return false;
			}
		}
	}
}

export { OmitAssetPlugin };
export default OmitAssetPlugin;
