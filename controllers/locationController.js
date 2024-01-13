const Location = require('../models/locationModel');
const factory = require('../handlers/factoryHandler');

const createLocation = factory.createOne(Location);
const getAllLocations = factory.getAll(Location);
const getLocation = factory.getOne(Location);
const updateLocation = factory.updateOne(Location);
const deleteLocation = factory.deleteOne(Location);

module.exports = {
	createLocation,
	getAllLocations,
	getLocation,
	updateLocation,
	deleteLocation,
};
