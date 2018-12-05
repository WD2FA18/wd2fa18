var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');
const Models = require('../sequelize');
/* GET users listing. */
router.get('/', asyncHandler(async (req, res, next) => {
  const products = await Models.products.findAll({
    attributes: [
      'productName',
      'categories.categoryName',
      'description',
      'listPrice'
    ],
    raw: true,
    include: [{
        attributes: [],
        model: Models.categories,
        as: 'categories',
    }]
  });
  res.render('products/products', { 
      title: 'Product Categories',
      metaDescription: 'Guitar Shop Products',
      menuPath: req.originalPath,
      products: tableRS(products)
  });
}));

router.get('/view/:productID', asyncHandler(async (req, res, next) => {
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
  res.render('products/product_view', {
    title: (product)?product.productName:'Does Not Exist',
    metaDescription: 'Guitar Shop Products',
    menuPath: req.originalPath,
    product: product
  });
}));

router.get('/categories', asyncHandler(async (req, res, next) => {
  const categories =  await Models.categories.findAll({raw: true});
  
  // If there is a flash message, please handle
  let flash;
  if (req.cookies.flashSuccess) {
    flash = {
      flashType: 'alert-success',
      flashMessage: req.cookies.flashSuccess
    };
    res.clearCookie('flashSuccess');
  } else if (req.cookies.flashError) {
    flash = {
              flashType: 'alert-danger',
              flashMessage: req.cookies.flashError
    };
    res.clearCookie('flashError');
  }
  
  res.render('products/categories', {
    title: 'Products Categories',
    metaDescription: 'Guitar Shop Product Categories',
    menuPath: req.originalPath,
    categories: categories,
    flash: flash
  });
}));

/* Path for Category Add to DB */
router.post('/categories/add', asyncHandler(async (req, res, next) => {
  const categoryRow = await Models.categories.create(req.body);
  res.cookie('flashSuccess', `${categoryRow.dataValues.categoryName} Created Successfully`);
  res.redirect('/products/categories');
}));

/* Path to Edit a Single Category */
router.get('/categories/edit/:categoryID', asyncHandler(async (req, res, next) => {
  const category = await Models.categories.findOne({
    where: {
      categoryID: req.params.categoryID
    },
    raw: true
  });
  if (category === null) {
    res.cookie('flashError', `That Category ID# ${req.params.categoryID} Doesn't Exist`);
    res.redirect('/products/categories');
  } else {
    // Display a form to edit the Category
    res.render('products/category_edit', {
      title: `Edit ${category.categoryName}`,
      metaDescription: 'Guitar Shop Categories',
      menuPath: req.originalPath,
      category: category,
    });
  }
}));

/* Path for Category Edit to DB */
router.post('/categories/edit/:categoryID', asyncHandler(async (req, res, next) => {
  // Find the Category to Update
  const category = await Models.categories.findOne({
    where: {
      categoryID: req.params.categoryID
    }
  });
  // Handle if the categoryID doesn't exist
  if (category == null) {
    res.cookie('flashError', `A category with an ID of ${req.params.categoryID} does not exist!`);
    res.redirect('/products/categories');
  } else {
    // Store the original name for later
    let origName = category.dataValues.categoryName;
    // Handle the update on our category
    await category.update({
      categoryName: req.body.categoryName
    });
    // Add a flash message
    res.cookie('flashSuccess', `Changed ${origName} -> ${category.dataValues.categoryName}`);
    res.redirect('/products/categories');
  }
}));

/* Path to Delete a Single Category */
router.get('/categories/delete/:categoryID', asyncHandler(async (req, res, next) => {
  // Get the info for the category
  const category = await Models.categories.findOne({
    where: {
      categoryID: req.params.categoryID
    },
    raw: true
  });
  // An empty set comes back as null, handle please!
  if (category == null) {
    res.cookie('flashError', `A category with an ID of ${req.params.categoryID} does not exist!`);
    res.redirect('/products/categories');
  } else {
    // Display a form to delete the Category
    res.render('products/category_delete', {
      title: `Delete ${category.categoryName}`,
      metaDescription: 'Guitar Shop Categories',
      menuPath: req.originalPath,
      category: category,
    });
  }
}));

/* Path for Category Delete from DB */
router.post('/categories/delete/:categoryID', asyncHandler(async (req, res, next) => {
  // Find the Category to Update
  const category = await Models.categories.findOne({
    where: {
      categoryID: req.params.categoryID
    }
  });
  // Handle if the categoryID doesn't exist
  if (category == null) {
    res.cookie('flashError', `A category with an ID of ${req.params.categoryID} does not exist!`);
    res.redirect('/products/categories');
  } else {
    // Store the original name for later
    let origName = category.dataValues.categoryName;
    // Handle the deletion of the category
    await category.destroy();
    // Add a flash message
    res.cookie('flashSuccess', `Deleted ${origName}!`);
    res.redirect('/products/categories');
  }
}));

function tableRS(rs) {
    let htmlTable = `<table class="table">
                       <thead>
                         <tr>`;
    // Add Table Headers
    for (let key in rs[0]) {
        htmlTable += `<th scope="col">
                        ${key}
                      </th>`;
    }
    // Add Table Body
    htmlTable += `</thead><tbody>`;
    for (let row of rs) {
        htmlTable += '<tr>';
        for (let column in row) {
            htmlTable += `<td>${row[column]}</td>`;
        }
        htmlTable += '</tr>';
    }

    return htmlTable + '</tbody></table>';
}




module.exports = router;
