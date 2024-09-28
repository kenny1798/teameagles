module.exports = (sequelize, DataTypes) => {
    const mu_chapter = sequelize.define("mu_chapter", {
        shortlink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        chapter: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        lessonId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastLessonCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    return mu_chapter
   };