module.exports = (sequelize, dataTypes) => {
    // Define our Categories Table Structure (Model)
    const products = sequelize.define('products', {
      // Our CategoryID, Types come from: http://docs.sequelizejs.com/variable/index.html#static-variable-DataTypes
      productID: {
           type: dataTypes.INTEGER,
           primaryKey: true,
           autoIncrement: true
       },
       categoryID: {
           type: dataTypes.INTEGER,
           allowNull: false
       },
       productCode: {
           type: dataTypes.STRING,
           allowNull: false
       },
       productName: {
           type: dataTypes.STRING,
           allowNull: false
       },
       description: {
           type: dataTypes.TEXT,
           allowNull: false
       },
       listPrice: {
           type: dataTypes.DECIMAL(10, 2),
           allowNull: false
       },
       discountPercent: {
           type: dataTypes.DECIMAL(10, 2),
           allowNull: false
       },
       dateAdded: {
           type: dataTypes.DATE,
           allowNull: false
       }
    });
    
    // Associate out Foreign Key
    products.associate = (categories) => {
        products.belongsTo(categories, {
            foreignKey: 'categoryID',
            as: 'categories'
        });
    };
    
    // Return our Model
    return products;
};