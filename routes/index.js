var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');
// Bring in our DB Models
const Models = require('../sequelize');

/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  // Get all of our current products
  const products = await Models.products.findAll({
    attributes: [
      'productName',
      'categories.categoryName',
      'description',
      'listPrice',
      'productID'
    ],
    raw: true,
    include: [{
        attributes: [],
        model: Models.categories,
        as: 'categories',
    }]
  });
  res.render('index', {
    title: 'Home',
    metaDescription: 'Guitar Shop',
    menuPath: req.baseUrl,
    products: products,
  });
}));

/* GET - View a Single Product */
router.get('/products/view/:productID', asyncHandler(async (req, res, next) => {
  // Get a product from the DB based on the Path Parameter
  const product = await Models.products.findOne({
    where: {
      productID: req.params.productID
    },
    raw: true,
    include: [{
        attributes: [],
        model: Models.categories,
        as: 'categories',
    }]
  });
  // Render the EJS View
  res.render('product_view', {
    title: (product)?product.productName:'Does Not Exist',
    metaDescription: 'Guitar Shop Products',
    menuPath: req.baseUrl,
    product: product
  });
}));

router.get('/about', asyncHandler(async (req, res, next) => {
  res.render('about', { title: 'About',
                        metaDescription: 'Guitar Shop About Page',
                        menuPath: req.baseUrl});
                        
}));
module.exports = router;
