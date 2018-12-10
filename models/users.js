const bcrypt = require('bcrypt');

module.exports = (sequelize, dataTypes) => {
   const users = sequelize.define('users', {
      userID: {
          type: dataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      userFirstName: {
          type: dataTypes.STRING,
          allowNull: false
      },
      userLastName: {
          type: dataTypes.STRING,
          allowNull: false
      },
      userEmail: {
          type: dataTypes.STRING,
          allowNull: false,
          unique: true
      },
      userPassword: {
          type: dataTypes.STRING,
          allowNull: false
      },userLevel: {
          type: dataTypes.ENUM('user', 'admin'),
          allowNull: false,
          defaultValue: 'user'
      },
   });
  
  users.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));  
  };
  
  users.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.dataValues.userPassword);  
  };
  
  return users; 
};

