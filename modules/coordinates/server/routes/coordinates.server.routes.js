'use strict';

/**
 * Module dependencies
 */
var coordinatesPolicy = require('../policies/coordinates.server.policy'),
  coordinates = require('../controllers/coordinates.server.controller');

module.exports = function(app) {
  // Coordinates Routes
  app.route('/api/coordinates').all(coordinatesPolicy.isAllowed)
    .get(coordinates.list)
    .post(coordinates.create);

  app.route('/api/coordinates/:coordinateId').all(coordinatesPolicy.isAllowed)
    .get(coordinates.read)
    .put(coordinates.update)
    .delete(coordinates.delete);

  // Finish by binding the Coordinate middleware
  app.param('coordinateId', coordinates.coordinateByID);
};
