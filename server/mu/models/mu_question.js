module.exports = (sequelize, DataTypes) => {
    const mu_question = sequelize.define("mu_question", {
        shortlink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        vidOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        question: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        answerOptionId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        correctAnswerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }

    });

    return mu_question
   };