(function () {
  'use strict';

  describe('Coordinates Route Tests', function () {
    // Initialize global variables
    var $scope,
      CoordinatesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CoordinatesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CoordinatesService = _CoordinatesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('coordinates');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/coordinates');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CoordinatesController,
          mockCoordinate;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('coordinates.view');
          $templateCache.put('modules/coordinates/client/views/view-coordinate.client.view.html', '');

          // create mock Coordinate
          mockCoordinate = new CoordinatesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Coordinate Name'
          });

          //Initialize Controller
          CoordinatesController = $controller('CoordinatesController as vm', {
            $scope: $scope,
            coordinateResolve: mockCoordinate
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:coordinateId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.coordinateResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            coordinateId: 1
          })).toEqual('/coordinates/1');
        }));

        it('should attach an Coordinate to the controller scope', function () {
          expect($scope.vm.coordinate._id).toBe(mockCoordinate._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/coordinates/client/views/view-coordinate.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CoordinatesController,
          mockCoordinate;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('coordinates.create');
          $templateCache.put('modules/coordinates/client/views/form-coordinate.client.view.html', '');

          // create mock Coordinate
          mockCoordinate = new CoordinatesService();

          //Initialize Controller
          CoordinatesController = $controller('CoordinatesController as vm', {
            $scope: $scope,
            coordinateResolve: mockCoordinate
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.coordinateResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/coordinates/create');
        }));

        it('should attach an Coordinate to the controller scope', function () {
          expect($scope.vm.coordinate._id).toBe(mockCoordinate._id);
          expect($scope.vm.coordinate._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/coordinates/client/views/form-coordinate.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CoordinatesController,
          mockCoordinate;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('coordinates.edit');
          $templateCache.put('modules/coordinates/client/views/form-coordinate.client.view.html', '');

          // create mock Coordinate
          mockCoordinate = new CoordinatesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Coordinate Name'
          });

          //Initialize Controller
          CoordinatesController = $controller('CoordinatesController as vm', {
            $scope: $scope,
            coordinateResolve: mockCoordinate
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:coordinateId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.coordinateResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            coordinateId: 1
          })).toEqual('/coordinates/1/edit');
        }));

        it('should attach an Coordinate to the controller scope', function () {
          expect($scope.vm.coordinate._id).toBe(mockCoordinate._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/coordinates/client/views/form-coordinate.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
