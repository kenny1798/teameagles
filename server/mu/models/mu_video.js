module.exports = (sequelize, DataTypes) => {
    const mu_video = sequelize.define("mu_video", {
        shortlink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        chapter: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        chapterTitle: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        lesson: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        lessonTitle: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        vidOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        vidFile: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return mu_video
   };