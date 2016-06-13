angular.module('app.controllers', [])
 

 //===================
 //*      HOME       *
 //*   CONTROLLER    *
 //=================== 
.controller('homeCtrl', ['$scope', '$log', '$http', 'globals', function($scope, $log, $http, $globals) {
	// $scope.pagingAwareCollectionListing = pagingAwareCollectionListing;
	$scope.title = "testName";

	$scope.listVirtualCollections = function () {

        $log.info("getting starred collection");

        return $http({
        	method: 'GET', 
        	url: $globals.backendUrl('collection/Starred%20Files?offset=0&path=')
        }).success(function (data) {
            $scope.collectionListingDropdown = data;
        }).error(function () {
            $scope.collectionListingDropdown = [];
        });
    };
}])






      


 //===================
 //*     LOGIN       *
 //*   CONTROLLER    *
 //===================
.controller('loginCtrl', ['$scope', '$log', '$http', '$location', 'globals', '$state', function($scope, $log, $http, $location, $globals, $state) {
	$scope.host;
	$scope.port;
	$scope.zone;
	$scope.userName;
	$scope.password;
	$scope.authType;

	$scope.submitLogin = function(){
		//var actval = irodsAccount($scope.login.host, $scope.login.port, $scope.login.zone, $scope.login.userName, $scope.login.password, $scope.login.authType, "");
		var actval = {
			host: $scope.host,
		    port: $scope.port,
		    zone: $scope.zone,
		    userName: $scope.userName,
		    password: $scope.password,
		    authType: $scope.authType,
		    resource: ""
		}

		$log.info("irodsAccount for host:" + actval);
		$log.info("POST to "+$globals.backendUrl('login/'));


        $http({
            method: 'POST',
            url: $globals.backendUrl('login/'),
            data: actval,
            headers: { 'Content-Type': 'application/json' }  // set the headers so angular passing info as request payload
        }).then(function(data){
        	$log.info(data);
        	$log.info("successful POST" + data);
        }).then(function(path) {
        	$state.go('menu.home');
            $log.info("end login success processing");
        });

        ;


	}

}])
   
.controller('profileCtrl', function($scope) {


})
 