const { Sequelize } = require('sequelize');
const { conexion } = require('../configs/ds');

const FilesModel = conexion.define('files', {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,
    required: true
  },
  filename:{
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    required: true
  },
  name:{
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
    required: true
  },
}, {
  paranoid: true,
  underscored: true,
  timestamps: false,
  freezeTableName: true,
  tableName: 'files'
});

module.exports = { FilesModel };