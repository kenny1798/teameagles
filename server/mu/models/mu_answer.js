module.exports = (sequelize, DataTypes) => {
    const mu_answer = sequelize.define("mu_answer", {
        shortlink: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        vidOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        answer: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },

    });

    return mu_answer
   };