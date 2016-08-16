'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Coordinate = mongoose.model('Coordinate'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, coordinate;

/**
 * Coordinate routes tests
 */
describe('Coordinate CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Coordinate
    user.save(function () {
      coordinate = {
        name: 'Coordinate name'
      };

      done();
    });
  });

  it('should be able to save a Coordinate if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Coordinate
        agent.post('/api/coordinates')
          .send(coordinate)
          .expect(200)
          .end(function (coordinateSaveErr, coordinateSaveRes) {
            // Handle Coordinate save error
            if (coordinateSaveErr) {
              return done(coordinateSaveErr);
            }

            // Get a list of Coordinates
            agent.get('/api/coordinates')
              .end(function (coordinatesGetErr, coordinatesGetRes) {
                // Handle Coordinate save error
                if (coordinatesGetErr) {
                  return done(coordinatesGetErr);
                }

                // Get Coordinates list
                var coordinates = coordinatesGetRes.body;

                // Set assertions
                (coordinates[0].user._id).should.equal(userId);
                (coordinates[0].name).should.match('Coordinate name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Coordinate if not logged in', function (done) {
    agent.post('/api/coordinates')
      .send(coordinate)
      .expect(403)
      .end(function (coordinateSaveErr, coordinateSaveRes) {
        // Call the assertion callback
        done(coordinateSaveErr);
      });
  });

  it('should not be able to save an Coordinate if no name is provided', function (done) {
    // Invalidate name field
    coordinate.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Coordinate
        agent.post('/api/coordinates')
          .send(coordinate)
          .expect(400)
          .end(function (coordinateSaveErr, coordinateSaveRes) {
            // Set message assertion
            (coordinateSaveRes.body.message).should.match('Please fill Coordinate name');

            // Handle Coordinate save error
            done(coordinateSaveErr);
          });
      });
  });

  it('should be able to update an Coordinate if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Coordinate
        agent.post('/api/coordinates')
          .send(coordinate)
          .expect(200)
          .end(function (coordinateSaveErr, coordinateSaveRes) {
            // Handle Coordinate save error
            if (coordinateSaveErr) {
              return done(coordinateSaveErr);
            }

            // Update Coordinate name
            coordinate.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Coordinate
            agent.put('/api/coordinates/' + coordinateSaveRes.body._id)
              .send(coordinate)
              .expect(200)
              .end(function (coordinateUpdateErr, coordinateUpdateRes) {
                // Handle Coordinate update error
                if (coordinateUpdateErr) {
                  return done(coordinateUpdateErr);
                }

                // Set assertions
                (coordinateUpdateRes.body._id).should.equal(coordinateSaveRes.body._id);
                (coordinateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Coordinates if not signed in', function (done) {
    // Create new Coordinate model instance
    var coordinateObj = new Coordinate(coordinate);

    // Save the coordinate
    coordinateObj.save(function () {
      // Request Coordinates
      request(app).get('/api/coordinates')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Coordinate if not signed in', function (done) {
    // Create new Coordinate model instance
    var coordinateObj = new Coordinate(coordinate);

    // Save the Coordinate
    coordinateObj.save(function () {
      request(app).get('/api/coordinates/' + coordinateObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', coordinate.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Coordinate with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/coordinates/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Coordinate is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Coordinate which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Coordinate
    request(app).get('/api/coordinates/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Coordinate with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Coordinate if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Coordinate
        agent.post('/api/coordinates')
          .send(coordinate)
          .expect(200)
          .end(function (coordinateSaveErr, coordinateSaveRes) {
            // Handle Coordinate save error
            if (coordinateSaveErr) {
              return done(coordinateSaveErr);
            }

            // Delete an existing Coordinate
            agent.delete('/api/coordinates/' + coordinateSaveRes.body._id)
              .send(coordinate)
              .expect(200)
              .end(function (coordinateDeleteErr, coordinateDeleteRes) {
                // Handle coordinate error error
                if (coordinateDeleteErr) {
                  return done(coordinateDeleteErr);
                }

                // Set assertions
                (coordinateDeleteRes.body._id).should.equal(coordinateSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Coordinate if not signed in', function (done) {
    // Set Coordinate user
    coordinate.user = user;

    // Create new Coordinate model instance
    var coordinateObj = new Coordinate(coordinate);

    // Save the Coordinate
    coordinateObj.save(function () {
      // Try deleting Coordinate
      request(app).delete('/api/coordinates/' + coordinateObj._id)
        .expect(403)
        .end(function (coordinateDeleteErr, coordinateDeleteRes) {
          // Set message assertion
          (coordinateDeleteRes.body.message).should.match('User is not authorized');

          // Handle Coordinate error error
          done(coordinateDeleteErr);
        });

    });
  });

  it('should be able to get a single Coordinate that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Coordinate
          agent.post('/api/coordinates')
            .send(coordinate)
            .expect(200)
            .end(function (coordinateSaveErr, coordinateSaveRes) {
              // Handle Coordinate save error
              if (coordinateSaveErr) {
                return done(coordinateSaveErr);
              }

              // Set assertions on new Coordinate
              (coordinateSaveRes.body.name).should.equal(coordinate.name);
              should.exist(coordinateSaveRes.body.user);
              should.equal(coordinateSaveRes.body.user._id, orphanId);

              // force the Coordinate to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Coordinate
                    agent.get('/api/coordinates/' + coordinateSaveRes.body._id)
                      .expect(200)
                      .end(function (coordinateInfoErr, coordinateInfoRes) {
                        // Handle Coordinate error
                        if (coordinateInfoErr) {
                          return done(coordinateInfoErr);
                        }

                        // Set assertions
                        (coordinateInfoRes.body._id).should.equal(coordinateSaveRes.body._id);
                        (coordinateInfoRes.body.name).should.equal(coordinate.name);
                        should.equal(coordinateInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Coordinate.remove().exec(done);
    });
  });
});
