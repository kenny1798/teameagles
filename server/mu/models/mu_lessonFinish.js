module.exports = (sequelize, DataTypes) => {
    const mu_lessonFinish = sequelize.define("mu_lessonFinish", {
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
        question: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        script: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    });

    return mu_lessonFinish
   };