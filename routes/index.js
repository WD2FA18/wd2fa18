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
    menuPath: req.originalPath,
    products: products,
  });
}));

router.get('/about', asyncHandler(async (req, res, next) => {
  res.render('about', { title: 'About',
                        metaDescription: 'Guitar Shop About Page',
                        menuPath: req.originalPath});
                        
}));
module.exports = router;
