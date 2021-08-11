const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

//mix.js('resources/js/app.js', 'public/js')
//   .sass('resources/sass/app.scss', 'public/css');

mix.options({
   extractVueStyles: 'public/css/app.css',
})

mix.js('resources/assets/js/vue/entry-client.js', 'public/js/vue')
   .js('resources/assets/js/vue/entry-server.js', 'public/js/vue')
   .sass('resources/sass/app.scss', 'public/css')
   .webpackConfig(() => {
      const config = {};

      config.resolve = {
          alias: {
              vue$: 'vue/dist/vue.runtime.common.js',
          },
      };

      if (mix.inProduction()) {
          config.plugins = [
              new PurgecssPlugin({
                  paths: glob.sync([
                      path.join(__dirname, 'app/**/*.php'),
                      path.join(__dirname, 'resources/views/**/*.blade.php'),
                      path.join(__dirname, 'resources/assets/js/**/*.vue'),
                      path.join(__dirname, 'resources/assets/js/**/*.js'),
                  ]),
                  extractors: [
                      {
                          extractor: class {
                              static extract(content) {
                                  return content.match(/[A-z0-9-:\/]+/g) || [];
                              }
                          },
                          extensions: ['html', 'js', 'php', 'vue'],
                      },
                  ],
              }),
          ];
      }

      return config;
  });