"use strict";

module.exports = function(sequelize, DataTypes) {
	var Settings = sequelize.define("Settings", {
    	host: DataTypes.STRING,
		port: DataTypes.INTEGER,
		login: DataTypes.STRING,
		password: DataTypes.STRING
	});

	return Settings;
};