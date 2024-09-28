module.exports = (sequelize, DataTypes) => {
    const mchat_getStarted = sequelize.define("mchat_getStarted", {
       salutationList: {
           type: DataTypes.STRING,
           allowNull: false,
       },
       nameField: {
           type: DataTypes.TEXT,
           allowNull: false,
       },
       trigger_flow_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        },
    })

    mchat_getStarted.associate = (models) => {
        mchat_getStarted.belongsTo(models.mchat_chat, {
            foreignKey: 'mchatChatId',
            constraints: false,
        })
    }
   
    return mchat_getStarted
   };