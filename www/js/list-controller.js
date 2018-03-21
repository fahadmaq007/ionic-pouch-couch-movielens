angular.module('controllers')
.controller('ListCtrl', ['$scope', '$state', 'PouchService', 'UI', function ($scope, $state, PouchService, UI) {
  
  console.debug("ListCtrl is initialized", $state.params);

	$scope.pageNumber = 1;
	$scope.pageSize = 15;
	$scope.totalCount = undefined;
	var type = $state.current.type;
	if (! type) {
		console.error("type is empty");
	}
	var collection = type + "s";
	if (type) {
		$scope[collection] = [];
	}

	$scope.init = function(params) {
	    PouchService.initialiseDB(type);
		if (params && params.indexes) {
			for (var i = 0; i < params.indexes.length; i++) {
				var indexField = params.indexes[i];
				PouchService.createIndex(type, indexField).then(function (result) {
			      console.log(result);
			    }).catch(function (err) {
			      console.error(err);
			    });
			}
		} 
	}

	$scope.search = function(field, searchText) {
		if (!searchText || searchText.length < 3) {
			return;
		}
		$scope[collection] = [];
		$scope.pageNumber = 1;
		var regexp = new RegExp(searchText, 'i');
		var selector = {
	  		_id: {$gte: null}
	  	}
	  	selector[field] = {$regex: regexp};

	  	var sort = undefined; //['id'];
	  	var skip = ($scope.pageNumber - 1) * $scope.pageSize;
	  	var limit = $scope.pageSize;
	  	
	  	PouchService.find(type, selector, sort, limit, skip).then(function (data) {
	        $scope[collection] = $scope[collection].concat(data.docs);
	        console.log("fetched " + data.docs.length + " records of " + type + ", total is " + $scope[collection].length);
	        $scope.$apply();
	    }).catch(function (error) {
	    	console.error(error);
	  	});
	  	$scope.searchText = undefined;
	}

	$scope.list = function() {
		console.debug("listing " + type);
		var selector = {
	  		
	  	}
		if (! angular.equals({}, $state.params)) {
			$scope[collection] = [];
			console.log("adding params to the selector", $state.params);
			for (var param in $state.params) {
				selector[param] = $state.params[param];
			}
		}
	  	console.log("selector is ", selector);
	  	var sort = undefined; //['id'];
	  	var skip = ($scope.pageNumber - 1) * $scope.pageSize;
	  	var limit = $scope.pageSize;
	  	
	  	PouchService.find(type, selector, sort, limit, skip).then(function (data) {
	        $scope[collection] = $scope[collection].concat(data.docs);
	        console.log("fetched " + data.docs.length + " records of " + type + ", total is " + $scope[collection].length);
	        $scope.$apply();
	    }).catch(function (error) {
	    	console.error(error);
	  	});
	};

	$scope.getTotalCount = function () {
	  	PouchService.totalCount(type).then( function(count) {
	  		$scope.totalCount = count.total_rows;
	  		console.log("fetched totalCount ", count);
	  		$scope.$apply();
	  	});
	}

	$scope.nextPage = function () {
		$scope.pageNumber++;
		$scope.list();
	}

	$scope.$on('$ionicView.beforeEnter', function () {
	    console.debug("ListCtrl::$ionicView.loaded" + type);
	    $scope.list();
	});

}]);
	

