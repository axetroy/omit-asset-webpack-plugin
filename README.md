# omit-asset-webpack-plugin

[![Badge](https://img.shields.io/badge/link-996.icu-%23FF4D5B.svg?style=flat-square)](https://996.icu/#/en_US)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg?style=flat-square)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
![Node](https://img.shields.io/badge/node-%3E=14-blue.svg?style=flat-square)
[![npm version](https://badge.fury.io/js/omit-asset-webpack-plugin.svg)](https://badge.fury.io/js/omit-asset-webpack-plugin)

A Webpack plugin to omit asset from output and it is compatible with `webpack@5`.

## Installation

```bash
npm install omit-asset-webpack-plugin --save-dev
```

## Usage

```js
// import via esm
import { OmitAssetPlugin } from "omit-asset-webpack-plugin";

// import via cjs
const { OmitAssetPlugin } = require("omit-asset-webpack-plugin");
```

```js
const { OmitAssetPlugin } = require("omit-asset-webpack-plugin");

/** @type {import('webpack').Configuration} */
module.exports = {
	plugins: [
		new OmitAssetPlugin({
			match: /LICENSE\.txt$/,
		}),
	],
};
```

## License

The [Anti 996 License](LICENSE)
