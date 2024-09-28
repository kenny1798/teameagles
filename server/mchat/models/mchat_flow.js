module.exports = (sequelize, DataTypes) => {
    const mchat_flow = sequelize.define("mchat_flow", {
       flowName: {
           type: DataTypes.STRING,
           allowNull: false,
       },
       username: {
        type: DataTypes.STRING,
        allowNull: false,
       },
       blocks: {
        type: DataTypes.JSON,
       },
       actions: {
        type: DataTypes.JSON,
       },
    })

    mchat_flow.associate = (models) => {

        mchat_flow.hasMany(models.mchat_userInput, {
            onDelete: "cascade",
        })

        mchat_flow.hasMany(models.mchat_userAnswer, {
            onDelete: "cascade",
        })

    }
   
    return mchat_flow
   };