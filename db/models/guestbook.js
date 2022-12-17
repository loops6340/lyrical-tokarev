const { DataTypes } = require("sequelize");

 module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("guestbook_comment", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    website: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
    },
    member: {
        type: DataTypes.STRING,
    },
    message: {
        type: DataTypes.STRING(5000),
    },
    pic: {
        type: DataTypes.STRING,
        allowNull: true,
        default: null
    }
 });
};