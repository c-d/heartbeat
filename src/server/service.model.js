const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
	url: {type: String, required: true },
    name: String,
    saying: String,
	environment: String,
	status: String,
	key: {type: String, select: false},
	detail: String
  },
  {
    collection: 'services',
    read: 'nearest'
  }
);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
