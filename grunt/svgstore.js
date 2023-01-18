// svgstore.js
module.exports = {
	options: {
		prefix: 'icon-',
		cleanup: false,
		includeTitleElement: false,
		preserveDescElement: false,
		svg: {
			xmlns: 'http://www.w3.org/2000/svg',
			'xmlns:xlink': 'http://www.w3.org/1999/xlink'
		}
	},

	'default': {
		files: {
			'./assets/img/icon-sprite.svg': ['./assets/icons/**/*.svg'],
			'./templates/components/amp/common/icon-defs.html': ['./assets/icons/**/*.svg']
		}
	}
};