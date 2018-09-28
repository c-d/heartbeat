const Service = require('./service.model');
const ReadPreference = require('mongodb').ReadPreference;

require('./mongo').connect();

function getServices(req, res) {
  const docquery = Service.find({}).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(services => {
      res.status(200).json(services);
    })
    .catch(error => {
      res.status(500).send(error);
      return;
    });
}

function postService(req, res) {
  const originalService = { id: req.body.url, url: req.body.url, name: req.body.name, environment: req.body.environment, status: "Unknown" };
  const service = new Service(originalService);
  service.save(error => {
    if (checkServerError(res, error)) return;
    res.status(201).json(service);
    console.log('Service created successfully!');
  });
}

function putService(req, res) {
  const originalService = {
    url: req.params.url,
    name: req.body.name,
    environment: req.body.environment
  };
  Service.findOne({ url: originalService.url }, (error, service) => {
    if (checkServerError(res, error)) return;
    if (!checkFound(res, service)) return;

    service.name = originalService.name;
    service.environment = originalService.environment;
    service.save(error => {
      if (checkServerError(res, error)) return;
      res.status(200).json(service);
      console.log('Service updated successfully!');
    });
  });
}

function deleteService(req, res) {
  const url = req.params.url;
  Service.findOneAndRemove({ url: url })
    .then(service => {
      if (!checkFound(res, service)) return;
      res.status(200).json(service);
      console.log('Service deleted successfully!');
    })
    .catch(error => {
      if (checkServerError(res, error)) return;
    });
}

function checkServerError(res, error) {
  if (error) {
    res.status(500).send(error);
    return error;
  }
}

function checkFound(res, service) {
  if (!service) {
    res.status(404).send('Service not found.');
    return;
  }
  return service;
}

module.exports = {
  getServices,
  postService,
  putService,
  deleteService
};
