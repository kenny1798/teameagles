module.exports = (sequelize, DataTypes) => {
    const mu_script = sequelize.define("mu_script", {
        shortlink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        vidOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        instruction: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        script: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

    });

    return mu_script
   };