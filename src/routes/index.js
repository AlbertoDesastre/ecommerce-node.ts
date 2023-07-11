const productsRouter = require('./products.route');

function routerApi(app) {
  app.use('/products', productsRouter);
}

module.exports = routerApi;
