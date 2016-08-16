'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Coordinate = mongoose.model('Coordinate'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Coordinate
 */
exports.create = function(req, res) {
  var coordinate = new Coordinate(req.body);
  coordinate.user = req.user;

  coordinate.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(coordinate);
    }
  });
};

/**
 * Show the current Coordinate
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var coordinate = req.coordinate ? req.coordinate.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  coordinate.isCurrentUserOwner = req.user && coordinate.user && coordinate.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(coordinate);
};

/**
 * Update a Coordinate
 */
exports.update = function(req, res) {
  var coordinate = req.coordinate ;

  coordinate = _.extend(coordinate , req.body);

  coordinate.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(coordinate);
    }
  });
};

/**
 * Delete an Coordinate
 */
exports.delete = function(req, res) {
  var coordinate = req.coordinate ;

  coordinate.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(coordinate);
    }
  });
};

/**
 * List of Coordinates
 */
exports.list = function(req, res) { 
  Coordinate.find().sort('-created').populate('user', 'displayName').exec(function(err, coordinates) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(coordinates);
    }
  });
};

/**
 * Coordinate middleware
 */
exports.coordinateByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Coordinate is invalid'
    });
  }

  Coordinate.findById(id).populate('user', 'displayName').exec(function (err, coordinate) {
    if (err) {
      return next(err);
    } else if (!coordinate) {
      return res.status(404).send({
        message: 'No Coordinate with that identifier has been found'
      });
    }
    req.coordinate = coordinate;
    next();
  });
};
