module.exports = (sequelize, DataTypes) => {
    const mu_userScript = sequelize.define("mu_userScript", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        shortlink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        vidOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        answer: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

    });

    return mu_userScript
   };