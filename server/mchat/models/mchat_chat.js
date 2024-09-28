module.exports = (sequelize, DataTypes) => {
    const mchat_chat = sequelize.define("mchat_chat", {
       uuid: {
           type: DataTypes.STRING,
           allowNull: false,
       },
       username: {
           type: DataTypes.STRING,
           allowNull: false,
       },
       link: {
           type: DataTypes.STRING(100),
           allowNull: false,
       },
       bot_name: {
        type: DataTypes.STRING,
        allowNull: false,
       }
    })

    mchat_chat.associate = (models) => {

        mchat_chat.hasMany(models.mchat_flow, {
            onDelete: "cascade",
        })

        mchat_chat.hasMany(models.mchat_linkButton, {
            onDelete: "cascade",
        })

        mchat_chat.hasMany(models.mchat_chatUser, {
            onDelete: "cascade",
        })

        mchat_chat.hasMany(models.mchat_userAnswer, {
            onDelete: "cascade",
        })

        mchat_chat.hasMany(models.mchat_getStarted, {
            onDelete: "cascade",
        })

        mchat_chat.hasMany(models.mchat_getStartedAnswers, {
            onDelete: "cascade",
        })


    }
   
    return mchat_chat
   };