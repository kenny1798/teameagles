module.exports = (sequelize, DataTypes) => {
    const mchat_linkButton = sequelize.define("mchat_linkButton", {
       content: {
           type: DataTypes.STRING,
           allowNull: false,
       },
       href: {
           type: DataTypes.TEXT,
           allowNull: true,
       },
    })
   
    return mchat_linkButton
   };