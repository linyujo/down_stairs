module.exports = {
    root          : true,
    env           : {
        node : true
    },
    extends       : [
        "plugin:vue/essential",
        "@vue/prettier"
	],
    rules         : {
        "no-console"  : process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger" : process.env.NODE_ENV === "production" ? "error" : "off",
		"indent": [
			"warn",
			"tab",
			{
				"SwitchCase": 1
			}
		],
		"quotes": ["warn", "double"],
		"semi": ["warn", "always"],
		"prettier/prettier": [
			"warn",
			{
				useTabs: true,
				tabWidth: 4
			}
		]
	},
    parserOptions : {
		parser : "babel-eslint",
		sourceType: "module"
    }
};
