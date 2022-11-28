const { DataTypes } = require("sequelize");

 module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("article", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    createdAt: { 
        type: DataTypes.DATE, 
        field: 'date' 
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thumbnail_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thumbnail_size: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    thumbnail_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tweet_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    }
 },
 {
    timestamps: true,
    underscored: true
 });
};