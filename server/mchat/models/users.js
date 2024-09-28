module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define("users", {
       username: {
           type: DataTypes.STRING,
           allowNull: false,
       },
       password: {
           type: DataTypes.STRING,
           allowNull: false,
       },
    })
   
    return user
   };