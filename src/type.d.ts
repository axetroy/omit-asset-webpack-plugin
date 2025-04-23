import type { Compiler } from "webpack";

type MatchFunction = (filename: string) => boolean;

type MatchEntity = RegExp | MatchFunction;

export type Rule = MatchEntity | Array<MatchEntity>;

export interface OmitAssetPluginOptions {
	/**
	 * The name of the file to be excluded
	 */
	match?: Rule;
}

declare class OmitAssetPlugin {
	constructor(options?: OmitAssetPluginOptions);
	/**
	 * Apply the plugin
	 */
	apply(compiler: Compiler): void;
}

export { OmitAssetPlugin };
export default OmitAssetPlugin;
