const Service = require('./service.model');
const ReadPreference = require('mongodb').ReadPreference;
const Request = require('request');

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
  const originalService = { 
	url: req.body.url, 
	name: req.body.name, 
	environment: req.body.environment, 
	status: "UNCHECKED", 
	key: req.body.key, 
	detail: "Service has not been called yet."
  };
  const service = new Service(originalService);
  service.save(error => {
    if (checkServerError(res, error)) return;
    res.status(201).json(service);
    console.log('Service created successfully with id ' + service._id + '!');
  });
  updateEndpointStatus(service);
}

function putService(req, res) {
  const originalService = {
	_id: req.params.id,
    url: req.body.url,
    name: req.body.name,
    environment: req.body.environment,
	key: req.body.key
  };
  Service.findOne({ _id: originalService._id }, (error, service) => {
    if (checkServerError(res, error)) return;
    if (!checkFound(res, service)) return;

    service.name = originalService.name;
    service.url = originalService.url;
    service.environment = originalService.environment;
	if (originalService.key) service.key = originalService.key;
	
	updateEndpointStatus(service);
    service.save(error => {
      if (checkServerError(res, error)) return;
      res.status(200).json(service);
      console.log('Service updated successfully!');
    });
  });
}

function deleteService(req, res) {
  const id = req.params._id;
  Service.findOneAndRemove({ _id: id })
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

function updateEndpointStatus(service) {
	var options = {
		url: service.url,
		headers: {
			'Ocp-Apim-Subscription-Key': ''
		},
		strictSSL: false
	};
	Request.get(options, 
		function(error, response, body) {
			var status = '';
		    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
			if (error) {
				console.log('error:'); // Print the error if one occurred
				service.detail = error;
				service.status = "ERROR";
			}
			else {
				if (response.statusCode == 200 || response.statusCode == 201) {
					service.status = "AVAILABLE";
					service.detail = "Received response status " + response.statusCode;
				}
				else {
					service.status = "UNAVAILABLE";
					service.detail = "Received response status " + response.statusCode + ". Body was: " + body;
				}
			}
			service.save();
			console.log('Updated',service.url,'status to', service.status);
		}
	);

}

function checkServiceAvailability() {
  Service.find({}, function(err, services) {
	services.forEach(function(service) {
	  updateEndpointStatus(service);
    });
  })
}

setInterval(checkServiceAvailability, 10000);

module.exports = {
  getServices,
  postService,
  putService,
  deleteService
};
