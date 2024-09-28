module.exports = (sequelize, DataTypes) => {
    const mchat_userInput = sequelize.define("mchat_userInput", {
       type: {
           type: DataTypes.STRING,
           allowNull: false,
       },
       content: {
           type: DataTypes.TEXT,
           allowNull: false,
       },
       trigger_flow_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        },
    })
   
    return mchat_userInput
   };