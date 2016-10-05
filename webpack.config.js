var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Autoprefixer = require('autoprefixer');
var merge = require('webpack-merge');
var webpack = require('webpack');

module.exports = function(env) {
  var cwd = process.cwd();
  var stylePaths = [
    path.join(cwd, 'styles', 'reset.css'),
    path.join(cwd, 'styles', 'icons.css'),
    path.join(cwd, 'styles', 'index.scss')
  ];

  switch(env) {
    case 'start':
      return merge(
        commonConfig(stylePaths),
        developmentConfig(stylePaths)
      );
    case 'interactive':
      return merge(
        commonConfig(stylePaths),
        buildConfig(stylePaths),
        interactiveConfig()
      );
    case 'build':
      return merge(
        commonConfig(stylePaths),
        buildConfig(stylePaths)
      );
  }
};

function commonConfig(stylePaths) {
  return {
    entry: {
      style: stylePaths
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.scss']
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel!eslint',
          include: [
            path.join(__dirname, 'components')
          ]
        },
        {
          test: /\.woff$/,
          loaders: ['url?prefix=font/&limit=5000&mimetype=application/font-woff']
        },
        {
          test: /\.ttf$|\.eot$/,
          loaders: ['file?prefix=font/']
        },
        {
          test: /\.jpg$/,
          loaders: ['file']
        },
        {
          test: /\.png$/,
          loaders: ['file']
        },
        {
          test: /\.svg$/,
          loaders: ['raw']
        },
        {
          test: /\.html$/,
          loaders: ['raw']
        }
      ]
    },
    eslint: {
      fix: true,
      configFile: require.resolve('./.eslintrc')
    },
    postcss: function() {
      return [ Autoprefixer ];
    }
  };
}

function interactiveConfig() {
  return {
    resolve: {
      alias: {
        react: 'preact-compat',
        'react-dom': 'preact-compat'
      }
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ],
    // Patch webpack module resolution (this bit probably needs to go to antwar core)
    resolve: {
      modulesDirectories: [
        path.join(__dirname, 'node_modules')
      ]
    },
    resolveLoader: {
      modulesDirectories: [
        path.join(__dirname, 'node_modules')
      ]
    }
  };
}

function developmentConfig(stylePaths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          include: stylePaths
        },
        {
          test: /\.scss$/,
          loaders: ['style', 'css', 'postcss', 'sass'],
          include: stylePaths
        }
      ]
    }
  };
}

function buildConfig(stylePaths) {
  return {
    output: {
      publicPath: '/assets/'
    },
    plugins: [
      new ExtractTextPlugin('[name].css', {
        allChunks: true
      })
    ],
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract(
            'style',
            'css'
          ),
          include: stylePaths
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract(
            'style',
            'css!postcss!sass'
          ),
          include: stylePaths
        }
      ]
    }
  };
}
