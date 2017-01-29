const context = require.context('mocha-loader!../test', true, /\.ts$/)

context.keys().forEach(context)