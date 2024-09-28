module.exports = (sequelize, DataTypes) => {
    const mchat_userAnswer = sequelize.define("mchat_userAnswer", {
       content: {
           type: DataTypes.TEXT,
           allowNull: false,
       },
       trigger_flow_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        },
    })
   
    return mchat_userAnswer
   };