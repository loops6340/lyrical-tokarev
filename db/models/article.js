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
        allowNull: true
    },
    thumbnail_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    thumbnail_size: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    thumbnail_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tweet_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    pleroma_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    hidden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
 },
 {
    timestamps: true,
    underscored: true
 });
};