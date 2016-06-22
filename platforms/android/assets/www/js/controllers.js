angular.module('app.controllers', [])
 

 //===================
 //*      HOME       *
 //*   CONTROLLER    *
 //=================== 
.controller('homeCtrl', ['$scope', '$log', '$http', 'globals', '$state', 'Upload', 'profileService', '$ionicPopup', function($scope, $log, $http, $globals, $state, Upload, profileService, $ionicPopup) {
	$scope.collectionListingDropdown;

	$scope.$on('goHome', function(event, args) {
		$scope.listVirtualCollections();
	});

	$scope.listVirtualCollections = function () {

        $log.info("getting starred collection");

        return $http({
        	method: 'GET', 
        	url: $globals.backendUrl('collection/Starred%20Files?offset=0&path=')
        }).success(function (data) {
        	$log.info("Setting starred collection as view");
            $scope.collectionListingDropdown = data;
            $log.info("Set");
            $log.info(data);
            $log.info($scope.collectionListingDropdown);
        }).error(function () {
        	$state.go('login');
        	$scope.plsLogInAlt();
            $scope.collectionListingDropdown = [];
        });
    };

   	$scope.plsLogInAlt = function() {
	   var alertPopup = $ionicPopup.alert({
	    	title: 'Please log in',
	    	template: 'You are currently not logged in'
   		})
	}

    $scope.currentCollection = function(){
    	if($scope.collectionListingDropdown.collectionAndDataObjectListingEntries[0].description == "Starred from Cloud Browser"){
    		document.getElementById("searchTerm").style.width = "100%";
    		// $('#searchTerm').css('width', '100%');
    		return "Starred Collection";
    	}else{
    		document.getElementById("searchTerm").style.width = "55%";
    		document.getElementById("backBtn").style.display = "inline";

    		var path = $scope.collectionListingDropdown.collectionAndDataObjectListingEntries[0].parentPath;
    		var splt = path.split("/");
    		var colName = splt[splt.length - 1];
    		return colName;
    	}
    } 

    $scope.prevData = [];

    // $scope.breadCrumb = [];

    $scope.goSubCol = function(path){
    	$log.info("getting "+path+" collection");
    	var url = $globals.subCollectionURL(path);

    	$scope.prevData.push($scope.collectionListingDropdown);

        return $http({
        	method: 'GET', 
        	url: url
        }).success(function (data) {
            $scope.collectionListingDropdown = data;
        }).error(function () {
            $scope.collectionListingDropdown = [];
        });
    }

    $scope.goBack = function(){
    	$scope.collectionListingDropdown = $scope.prevData[$scope.prevData.length - 1];
    	$scope.prevData.pop();
    }

    // $scope.breadCrumbGo = function(crumb){
    // 	var pathLength = $scope.breadCrumb.length;
    // 	for(i=0; i<pathLength; i++){
    // 		if($scope.breadCrumb[i] == crumb){
    // 			$scope.collectionListingDropdown = $scope.prevData[i];
    // 			$scope.prevData.slice(0,i-1);
    // 			$scope.breadCrumb.slice(0,i);
    // 			$log.info("clicked on "+i+"th item");
    // 			$log.info("Current BC is "+$scope.breadCrumb);
    // 		}
    // 	}
    // }

    $scope.doRefresh = function(){
    	$log.info("refreshing");
    	var path = $scope.collectionListingDropdown.collectionAndDataObjectListingEntries[0].parentPath;
    	$log.info("current path is "+path);
    	$scope.goSubCol(path);
    	$scope.$broadcast('scroll.refreshComplete');
    }

    $scope.openUpload = function(){
    	var file = document.getElementById('file-upload').files;
    	var fileName = file[0].name;
    	var cfm = confirm("Do you want to upload '" + fileName + "'");
    	if(cfm){
    		$log.info("confirmed");
    		$scope.upload(file);
    	}else{
    		document.getElementById('file-upload').value = "";
    	}
  	}

    $scope.upload = function(file){
    	$log.info(file);
    	Upload.upload({
            url: $globals.backendUrl('file'),
            fields: {collectionParentName: $scope.collectionListingDropdown.pagingAwareCollectionListingDescriptor.parentAbsolutePath},
            file: file
        })
        setTimeout(function() {
        	$scope.doRefresh();
		}, 1000);
    }

    // Profile
    $scope.profileObject;

    $scope.goProfile = function(object){
    	profileService.setProfileObj(object);
    	$log.info("Going to profile for object:");
    	$log.info(object);
		$state.go('menu.profile');
		$scope.$broadcast('goProfile', object);
    }


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










 //===================
 //*     Menu        *
 //*   CONTROLLER    *
 //===================
.controller('menuCtrl',['$scope', '$state', '$log', function($scope, $state, $log){
	$scope.goHome = function(){
		$log.info("Going Home");
		$scope.$broadcast('goHome', 0);
	}
}])












 //===================
 //*    Profile      *
 //*   CONTROLLER    *
 //===================   
.controller('profileCtrl',['$scope', '$state', '$log', 'profileService', '$http', 'globals', function($scope, $state, $log, profileService, $http, $globals){

	$scope.getFormattedPath = function(normURL){
		var URL = normURL.replace("/","%2F");
        return "http://dfcweb.datafed.org:8080/irods-cloud-backend/file?path="+URL;
	}

	$scope.response = profileService.getProfileObj();

	var path = $scope.response.formattedAbsolutePath;

	$scope.url = $scope.getFormattedPath(path);

	$scope.profileObject;

	$scope.getProfileObj = function(url){
		$log.info("getting " + url);

		return $http({
        	method: 'GET', 
        	url: url
        }).success(function (data) {
            $scope.profileObject = data;
            $log.info("got:");
            $log.info(data);
        }).error(function () {
            $scope.profileObject = [];
        });
	}

	$scope.getProfileObj($scope.url);

	$scope.hasComments = function(){
		if($scope.profileObject.domainObject.comments != ""){
			return true;
		}else{
			return false;
		}
	}

	$scope.getDownloadLink = function(){
		$log.info("getting download link for"+$scope.profileObject.parentPath + "/" + $scope.profileObject.childName);
		var url = $globals.backendUrl('download') + "?path=" + $scope.profileObject.parentPath + "/" + $scope.profileObject.childName;
		$log.info("Download link is:" + url);
		return url;
	}


}])
 