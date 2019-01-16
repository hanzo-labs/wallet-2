const withBabelMinify  = require('next-babel-minify')

const withStylus   = require('@zeit/next-stylus')
const postcss      = require('poststylus')
const autoprefixer = require('autoprefixer')
const comments     = require('postcss-discard-comments')
const rupture      = require('rupture')

module.exports = withStylus({
  stylusLoaderOptions: {
    use: [
      rupture(),
      postcss([
        autoprefixer({ browsers :'> 1%' }),
        'rucksack-css',
        'css-mqpacker',
        comments({ removeAll: true })
      ])
    ]
  },
  webpack: (config, options) => {
    config.plugins.push(
      new withBabelMinify({
        comments: false
      })
    )
    return config
  }
})

// module.exports = withCss({
//   webpack(config, options) {
//     const { dev } = options
//     config.plugins = config.plugins.filter(plugin => {
//       return plugin.constructor.name !== 'UglifyJsPlugin';
//     });

//     if (!dev) {
//       // add Babili plugin
//       config.plugins.push(
//         new BabiliPlugin()
//       );
//     }
//     return config
//   }
// });
