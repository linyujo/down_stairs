// 插件(plugin)，可以用來處理各種各樣的任務
// use 屬性，表示進行轉換時，應該使用哪個 loader
// require 屬性，用來引入插件
module.exports = {
	chainWebpack: config => {
		config
			.plugin("webpack-bundle-analyzer")
			.use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
	}
};
