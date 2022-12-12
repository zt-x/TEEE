const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
	publicPath:"/",
	transpileDependencies: [
	'vuetify'
	],
	devServer: {
		port: 443,
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				pathRewrite: {
					'^/api':'/'
				}
			}
		}
	}
})
