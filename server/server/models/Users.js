module.exports = (sequelize, DataTypes) => {
 const Users = sequelize.define("Users", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    managerId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isValidate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
 });

 Users.associate = (models) => {

    Users.hasMany(models.Managers, {
        onDelete: "cascade",
    })

};



 return Users
};