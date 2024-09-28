module.exports = (sequelize, DataTypes) => {
    const Managers = sequelize.define("Managers", {
       pos: {
           type: DataTypes.STRING,
           allowNull: false,
       },
    })
   
    return Managers
   };