var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');
const Models = require('../sequelize');

/* GET - Products Home Page */
router.get('/', asyncHandler(async (req, res, next) => {
  // Get all products
  const products = await Models.products.findAll({
    raw: true,
    include: [{
        attributes: ['categoryName'],
        model: Models.categories,
        as: 'categories',
    }]
  });
  // Get all categories
  const categories = await Models.categories.findAll({raw: true});
  // Render the EJS View
  res.render('products/products', { 
      title: 'Product Categories',
      metaDescription: 'Guitar Shop Products',
      menuPath: req.baseUrl,
      products: products,
      categories: categories,
      flashMessage: req.flash('message'),
      flashType: req.flash('type')
  });
}));

/* POST - Product Add to DB */
router.post('/add', asyncHandler(async (req, res, next) => {
  // Get the current time to update dateAdded DB Field
  req.body.dateAdded = new Date();
  // Add the new product to the DB. No validation is occuring here!
  const productRow = await Models.products.create(req.body);
  // Setup a flash message
  req.flash('message', `${productRow.dataValues.productName} Created Successfully`);
  req.flash('type', 'alert-success');
  // Redirect back to products home page.
  res.redirect(req.baseUrl);
}));

/* GET - Edit a Single Product */
router.get('/edit/:productID', asyncHandler(async (req, res, next) => {
  // Find the product to edit
  const product = await Models.products.findOne({
    where: {
      productID: req.params.productID
    },
    raw: true
  });
  // Handle if the product doesn't exist
  if (product === null) {
    req.flash('message', `A product with an ID of ${req.params.productID} does not exist!`);
    req.flash('type', 'alert-danger');
    // Redirect to Products Home Page on Error
    res.redirect(req.baseUrl);
  } else {
    // Get all categories to make a form dropdown
    const categories = await Models.categories.findAll({raw: true});
    // Display a form to edit the Product
    res.render('products/product_edit', {
      title: `Edit ${product.productName}`,
      metaDescription: 'Guitar Shop Products',
      menuPath: req.baseUrl,
      product: product,
      categories: categories,
    });
  }
}));

/* POST - Edit a Single Product */
router.post('/edit/:productID', asyncHandler(async (req, res, next) => {
  // Find the Product to Update
  const product = await Models.products.findOne({
    where: {
      productID: req.params.productID
    }
  });
  // Handle if the Product doesn't exist
  if (product == null) {
    req.flash('message', `A Product with an ID of ${req.params.productID} does not exist!`);
    req.flash('type', 'alert-danger');
  } else {
    // Handle the update of our Product
    await product.update(req.body);
    // Add a flash message
    req.flash('message', `Updated ${product.dataValues.productName}`);
    req.flash('type', 'alert-success');
  }
  // Redirect regardless of Success or Error
  res.redirect(req.baseUrl);
}));

/* GET - Delete a Single Product */
router.get('/delete/:productID', asyncHandler(async (req, res, next) => {
  // Get the info for the product from the DB
  const product = await Models.products.findOne({
    where: {
      productID: req.params.productID
    },
    raw: true
  });
  // Handle if the Product does not exist
  if (product == null) {
    // Setup a flash error message
    req.flash('message', `A Product with an ID of ${req.params.productID} does not exist!`);
    req.flash('type', 'alert-danger');
    // Redirect to products home page
    res.redirect(req.baseUrl);
  } else {
    // Display a form to delete the Category
    res.render('products/product_delete', {
      title: `Delete ${product.categoryName}`,
      metaDescription: 'Guitar Shop Products',
      menuPath: req.baseUrl,
      product: product,
    });
  }
}));

/* POST - Delete a Single Product */
router.post('/delete/:productID', asyncHandler(async (req, res, next) => {
  // Find the Product to Delete
  const product = await Models.products.findOne({
    where: {
      productID: req.params.productID
    }
  });
  // Handle if the Product Doesn't Exist
  if (product == null) {
    req.flash('message', `A Product with an ID of ${req.params.productID} does not exist!`);
    req.flash('type', 'alert-danger');
  } else {
    // Store the original name for later
    let origName = product.dataValues.productName;
    // Delete the Product from the DB
    await product.destroy();
    // Add a flash message
    req.flash('message', `Deleted ${origName}!`);
    req.flash('type', 'alert-success');
  }
  // Redirect on success or error
  res.redirect(req.baseUrl);
}));

module.exports = router;
