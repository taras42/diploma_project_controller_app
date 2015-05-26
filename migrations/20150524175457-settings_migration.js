'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable("Settings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      host: {
        type: Sequelize.STRING
      },
	  port: {
        type: Sequelize.INTEGER
      },
	  login: {
	  	type: Sequelize.STRING
	  },
	  password: {
	  	type: Sequelize.STRING
	  }
  },

  down: function (queryInterface, Sequelize) {
	  return queryInterface.dropTable('Settings');
  }
};
