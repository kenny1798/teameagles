module.exports = (sequelize, DataTypes) => {
    const mchat_chatUser = sequelize.define("mchat_chatUser", {
       uuid: {
           type: DataTypes.STRING,
           allowNull: false,
       },
       timeStamp: {
           type: DataTypes.STRING,
           allowNull: false,
       },
       username: {
        type: DataTypes.STRING,
        allowNull: false,
       },
       chat: {
        type: DataTypes.JSON,
       },
    })
   
    return mchat_chatUser
   };