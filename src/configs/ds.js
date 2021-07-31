const { Sequelize } = require('sequelize');

const conexion = new Sequelize('spring_boot', 'antrax', 'antrax123', {
  port: 3306,
  host: '45.58.56.194',
  dialect: 'mysql',
  define:{
    timestamps: true
  },
  pool:{
    min: 0,
    max:5,
    acquire: 30000,
    idle: 10000
  }
});

conexion.sync({ force: false });

module.exports = { conexion };