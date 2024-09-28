module.exports = (sequelize, DataTypes) => {
    const mchat_button = sequelize.define("mchat_button", {
       content: {
           type: DataTypes.STRING,
           allowNull: false,
       },
       trigger_flow_id: {
           type: DataTypes.INTEGER,
           allowNull: true,
       },
    })
   
    return mchat_button
   };