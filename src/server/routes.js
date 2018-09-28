const express = require('express');
const router = express.Router();

const serviceService = require('./service.service');

router.get('/services', (req, res) => {
  serviceService.getServices(req, res);
});

router.post('/service', (req, res) => {
  serviceService.postService(req, res);
});

router.put('/service/:id', (req, res) => {
  serviceService.putService(req, res);
});

router.delete('/service/:id', (req, res) => {
  serviceService.deleteService(req, res);
});

router.get('/environments', (req, res) => {
  serviceService.getEnvironments(req, res);
});

module.exports = router;
