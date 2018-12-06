var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');
const Models = require('../sequelize');

/* GET - Categories Home Page */
router.get('/', asyncHandler(async (req, res, next) => {
  // Get ALL categories from the DB
  const categories =  await Models.categories.findAll({raw: true});
  // Render our EJS View
  res.render('categories/categories', {
    title: 'Product Categories',
    metaDescription: 'Guitar Shop Product Categories',
    menuPath: req.baseUrl,
    categories: categories,
    flashMessage: req.flash('message'),
    flashType: req.flash('type')
  });
}));

/* POST - Add Category to DB */
router.post('/add', asyncHandler(async (req, res, next) => {
  // Add the New Category to the DB
  const categoryRow = await Models.categories.create(req.body);
  // Setup a flash message
  req.flash('message', `${categoryRow.dataValues.categoryName} Created Successfully`);
  req.flash('type', 'alert-success');
  // Redirect back to categories main page
  res.redirect(req.baseUrl);
}));

/* GET - Edit a Single Category */
router.get('/edit/:categoryID', asyncHandler(async (req, res, next) => {
  // Get the Category to Edit from the DB
  const category = await Models.categories.findOne({
    where: {
      categoryID: req.params.categoryID
    },
    raw: true
  });
  // Handle if the category doesn't exist
  if (category === null) {
    // Setup a Flash Error Message
    req.flash('message', `A category with an ID of ${req.params.categoryID} does not exist!`);
    req.flash('type', 'alert-danger');
    // Redirect to Main Categories Page
    res.redirect(req.baseUrl);
  } else {
    // Display a form to edit the Category via EJS Views
    res.render('categories/category_edit', {
      title: `Edit ${category.categoryName}`,
      metaDescription: 'Guitar Shop Categories',
      menuPath: req.baseUrl,
      category: category,
    });
  }
}));

/* POST - Edit a Single Category */
router.post('/edit/:categoryID', asyncHandler(async (req, res, next) => {
  // Find the Category to Update from the DB
  const category = await Models.categories.findOne({
    where: {
      categoryID: req.params.categoryID
    }
  });
  // Handle if the Category doesn't exist
  if (category == null) {
    // Setup the Flash Error Message
    req.flash('message', `A category with an ID of ${req.params.categoryID} does not exist!`);
    req.flash('type', 'alert-danger');
  } else {
    // Store the original category name for later
    let origName = category.dataValues.categoryName;
    // Update our Category in the DB
    await category.update({
      categoryName: req.body.categoryName
    });
    // Add a Flash Success Message
    req.flash('message', `Changed ${origName} -> ${category.dataValues.categoryName}`);
    req.flash('type', 'alert-success');
  }
  // Redirect on Success or Failure
  res.redirect(req.baseUrl);
}));

/* GET - Delete a Single Category */
router.get('/delete/:categoryID', asyncHandler(async (req, res, next) => {
  // Get the info for the category from the DB
  const category = await Models.categories.findOne({
    where: {
      categoryID: req.params.categoryID
    },
    raw: true
  });
  // Handle if the Category Doesn't Exist
  if (category == null) {
    // Setup Flash Error Message
    req.flash('message', `A category with an ID of ${req.params.categoryID} does not exist!`);
    req.flash('type', 'alert-danger');
    // Redirect to Main Categories Page
    res.redirect(req.baseUrl);
  } else {
    // Display a form to delete the Category via EJS View
    res.render('categories/category_delete', {
      title: `Delete ${category.categoryName}`,
      metaDescription: 'Guitar Shop Categories',
      menuPath: req.baseUrl,
      category: category,
    });
  }
}));

/* POST - Delete a Single Category */
router.post('/delete/:categoryID', asyncHandler(async (req, res, next) => {
  // Find the Category to Delete in the DB
  const category = await Models.categories.findOne({
    where: {
      categoryID: req.params.categoryID
    }
  });
  // Handle if the Category doesn't exist
  if (category == null) {
    // Setup the Flash Error Message
    req.flash('message', `A category with an ID of ${req.params.categoryID} does not exist!`);
    req.flash('type', 'alert-danger');
  } else {
    // Store the original category name for later
    let origName = category.dataValues.categoryName;
    // Delete the Category from the DB
    await category.destroy();
    // Add a flash message
    req.flash('message', `Deleted ${origName}!`);
    req.flash('type', 'alert-success');
  }
  // Redirect on Success or Error
  res.redirect(req.baseUrl);
}));

module.exports = router;
