module.exports = (sequelize, DataTypes) => {
    const mchat_getStartedAnswers = sequelize.define("mchat_getStartedAnswers", {
       salutation: {
           type: DataTypes.STRING,
           allowNull: false,
       },
       name: {
           type: DataTypes.TEXT,
           allowNull: false,
       },
       trigger_flow_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        },
    })
   
    return mchat_getStartedAnswers
   };