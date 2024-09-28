module.exports = (sequelize, DataTypes) => {
    const mu_userAnswer = sequelize.define("mu_userAnswer", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        shortlink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lesson: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        answeredId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    return mu_userAnswer
   };