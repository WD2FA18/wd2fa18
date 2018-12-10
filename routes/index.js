var express = require('express');
var router = express.Router();
const passport = require('passport');
const asyncHandler = require('express-async-handler');
// Bring in our DB Models
const Models = require('../sequelize');
// Add authentication function
const redirectIfLoggedIn = require('../authentication.js').redirectIfLoggedIn;


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
    flashMessage: req.flash('message'),
    flashType: req.flash('type')
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

// Signup Page
router.get('/signup', redirectIfLoggedIn, asyncHandler(async (req, res, next) => {
  res.render('signup', { title: 'Sign Up',
                        metaDescription: 'Guitar Shop SignUp Page',
                        menuPath: req.baseUrl});
}));

router.post('/signup', redirectIfLoggedIn, asyncHandler(async (req, res, next) => {
  const origPassword = req.body.userPassword;
  // Encrypt the Password
  req.body.userPassword = Models.users.generateHash(req.body.userPassword);
  console.log(origPassword);
  console.log(req.body.userPassword);
  // Add the user to the DB
  const user = await Models.users.create(req.body);
  // Change password back to plaintext for authentication
  req.body.userPassword = origPassword;
  // Login the new user and send them to /
  passport.authenticate('local')(req, res, function () {
    // Setup our flash message
    req.flash('message', `${user.dataValues.userFirstName} ${user.dataValues.userLastName} your Account was Created Successfully`);
    req.flash('type', 'alert-success');
    
    res.redirect('/');
  });
}));

// Login Page
router.get('/login', redirectIfLoggedIn, asyncHandler(async (req, res, next) => {
  res.render('login', { title: 'Login',
                        metaDescription: 'Guitar Shop Login Page',
                        menuPath: req.baseUrl,
                        flashMessage: req.flash('loginMessage')
  });
}));

router.post('/login', redirectIfLoggedIn, passport.authenticate('local',
  {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }
));

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});



module.exports = router;
