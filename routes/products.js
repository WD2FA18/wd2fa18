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

router.get('/categories', asyncHandler(async (req, res, next) => {
  const categories =  await Models.categories.findAll({raw: true});
  res.render('products/categories', {
    title: 'Products Categories',
    metaDescription: 'Guitar Shop Product Categories',
    menuPath: req.originalPath,
    categories: tableRS(categories)
  });
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
