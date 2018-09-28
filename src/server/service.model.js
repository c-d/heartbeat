const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
	id: {type: String, required: true, unique: true },
	url: {type: String, required: true, unique: true },
    name: String,
    saying: String,
	environment: String,
	status: String
  },
  {
    collection: 'services',
    read: 'nearest'
  }
);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
