module.exports = (sequelize, dataTypes) => {
   const categories = sequelize.define('categories', {
      categoryID: {
          type: dataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      categoryName: {
          type: dataTypes.STRING,
          allowNull: false
      }
   });
   return categories;
};