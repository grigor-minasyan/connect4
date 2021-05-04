const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
const path = require( 'path' );
module.exports = {
   mode: process.env.NODE_ENV,
   context: __dirname,
   entry: './src/index.js',
   output: {
      path: path.resolve( __dirname, 'build' ),
      filename: 'bundle.js',
      publicPath: '/',
   },
   devServer: {
      historyApiFallback: true,
      contentBase: path.resolve(__dirname, './dist'),
   },
   module: {
      rules: [
        {
            test: /\.jsx?/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react'
                    ]
                }
            }
        },
        {
            test: /\.s[ac]ss$/i,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        },
         {
            test: /\.(png|j?g|svg|gif)?$/,
            use: 'file-loader'
         }
      ]
   },
   resolve: {
     extensions: ['*', '.js', '.jsx'],
   },
   plugins: [
     new HtmlWebPackPlugin({
       template: path.resolve(__dirname, "public", "index.html")
     })
   ]
};
