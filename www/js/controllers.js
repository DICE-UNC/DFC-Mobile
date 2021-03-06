angular.module('app.controllers', [])
 

 //===================
 //*      HOME       *
 //*   CONTROLLER    *
 //=================== 
.controller('homeCtrl', ['$scope', '$rootScope', '$log', '$http', 'globals', '$state', 'Upload', 'profileService', '$ionicPopup', '$window', 'loginService', function($scope, $rootScope, $log, $http, $globals, $state, Upload, profileService, $ionicPopup, $window, $loginService) {
	$scope.collectionListingDropdown;

	$rootScope.$on('goHome', function(event, args) {
        $log.info("goHome broadcast recvd");
        if(args==0){
            $scope.listVirtualCollections();
        }else{
            $log.info("RECIEVED: "+args.description);
            var vcPath = args.uniqueName;
            $scope.goVC(vcPath);
        }	
	})

    $scope.$on('goHomeFromQuery', function(event, args) {
        $log.info("RECIEVED query#: "+args.description);
        $scope.goVC(args);        
    })

    $rootScope.cd = false; 
    $rootScope.$on('goHomeFromCD', function(event, args) {
        $scope.cd = true;    
    })

    $rootScope.$on("loggedIn", function(){
        $scope.landing();
    })

    $scope.searchDir = function(){
        var parPath = $scope.collectionListingDropdown.collectionAndDataObjectListingEntries[0].parentPath;
        var res = parPath.split("/");
        var i;
        var searchPath;
        searchPath = "";
        for(i=1; i<res.length; i++){
            searchPath += "/";
            searchPath += res[i];
        }
        $rootScope.searchDir = searchPath;
    }

    $scope.landing = function(){
        $log.info("ng-init done. Listing starred collection");
        $scope.listVirtualCollections();
    }

	$scope.listVirtualCollections = function () {

        $log.info("getting starred collection");

        return $http({
        	method: 'GET', 
        	url: $globals.backendUrl('collection/Starred%20Files?offset=0&path=')
        }).success(function (data) {
        	$log.info("Setting starred collection as view");
            $scope.collectionListingDropdown = data;
            $log.info($scope.collectionListingDropdown);
        }).error(function () {


            $state.go('login');
            $scope.plsLogInAlt();
            $scope.collectionListingDropdown = [];


            var localStg = $globals.getHost();
            $log.info("localStorage host is:"+localStg);
            if(localStg!="null"|localStg!=null){
                $log.info("Host localStorage is read as not null");
                $scope.autoLogin();
            }else{
                $state.go('login');
                $scope.plsLogInAlt();
                $scope.collectionListingDropdown = [];
            }
        });
    };

    $scope.autoLogin = function(){
        $log.info("autologin detected");
        var actval = {
            host: $globals.getHost(),
            port: $globals.getPort(),
            zone: $globals.getZone(),
            userName: $globals.getUN(),
            password: $globals.getPW(),
            authType: $globals.getAuth(),
            resource: ""
        }

        $log.info("autlogin creds are:" + actval);

        $http({
            method: 'POST',
            url: $globals.backendUrl('login/'),
            data: actval,
            headers: { 'Content-Type': 'application/json' }  // set the headers so angular passing info as request payload
        }).then(function(data){
            $scope.listVirtualCollections();
        });
    }

   	$scope.plsLogInAlt = function() {
	   var alertPopup = $ionicPopup.alert({
	    	title: 'Please log in',
	    	template: 'You are not currently logged in'
   		})
	}

    $scope.currentCollection = function(){
        if($scope.collectionListingDropdown == ""){
            return "Virtual Collection";
        }
        if($scope.collectionListingDropdown.collectionAndDataObjectListingEntries[0].description == "Starred from Cloud Browser"){
            document.getElementById("searchTerm").style.width = "100%";
            return "Starred Collection";
        }else{
            document.getElementById("searchTerm").style.width = "60%";
            document.getElementById("backBtn").style.display = "inline";

            var path = $scope.collectionListingDropdown.collectionAndDataObjectListingEntries[0].parentPath;
            var splt = path.split("/");
            var colName = splt[splt.length - 1];
            return colName;
        }
    } 

    $scope.goSubCol = function(path){
    	$log.info("getting "+path+" collection");
    	var url = $globals.subCollectionURL(path);

        return $http({
        	method: 'GET', 
        	url: url
        }).success(function (data) {
            $log.info("Subcol data: ");
            $log.info(data);
            $scope.collectionListingDropdown = data;
        }).error(function () {
            $scope.collectionListingDropdown = [];
        });
    }

    $scope.goVC = function(path){
        $log.info("getting "+path+" VC");
        var url = $globals.virtCollectionURL(path);
        $scope.isVC = true;
        
        return $http({
            method: 'GET', 
            url: url
        }).success(function (data) {
            $log.info("SUCCESS VC GET. Data: ");
            $log.info(data);
            $scope.collectionListingDropdown = data;
        }).error(function () {
            $log.info("FAIL VC GET");
            $scope.collectionListingDropdown = [];
        });
    }

    $scope.goBack = function(){
    	// $scope.collectionListingDropdown = $scope.prevData[$scope.prevData.length - 1];
        var parPath = $scope.collectionListingDropdown.collectionAndDataObjectListingEntries[0].parentPath;
        var res = parPath.split("/");
        var i;
        var backPath;
        backPath = "";
        for(i=1; i<res.length-1; i++){
            backPath += "/";
            backPath += res[i];
        }
        $scope.goSubCol(backPath);
    }

    $scope.doRefresh = function(){
    	$log.info("refreshing");
        if($scope.collectionListingDropdown == ""){
            $scope.listVirtualCollections();
            $scope.$broadcast('scroll.refreshComplete');
        }else{
            if($scope.collectionListingDropdown.collectionAndDataObjectListingEntries[0].description == "Starred from Cloud Browser"){
                $scope.listVirtualCollections();
                $scope.$broadcast('scroll.refreshComplete');
            }else{
                var path = $scope.collectionListingDropdown.collectionAndDataObjectListingEntries[0].parentPath;
                $log.info("current path is "+path);
                $scope.goSubCol(path);
                $scope.$broadcast('scroll.refreshComplete');
            }
        }
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
        $scope.$apply();
    }


    $scope.vcDelete = function(){
        var uqName = $rootScope.currentVC;
        $log.info("Deleting query");
        return $http({
            method: 'DELETE',
            url: $globals.backendUrl('virtualCollection' + "/" + encodeURI(uqName)),
            params: {

            }
        }).then(function (data) {
            $log.info("Deletion completed!");
            setTimeout(function(){
                $scope.listVirtualCollections();
            }, 200);
        })
    }


}])






      


 //===================
 //*     LOGIN       *
 //*   CONTROLLER    *
 //===================
.controller('loginCtrl', ['$scope', '$rootScope', '$log', '$http', '$location', 'globals', '$state', '$window', '$ionicPopup', 'loginService', function($scope, $rootScope, $log, $http, $location, $globals, $state, $window, $ionicPopup, $loginService) {
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
            var lclStgHst = $globals.getHost();
            if(lclStgHst=="null"|lclStgHst==null){
                var myPopup = $ionicPopup.show({
                    title: 'Would you like to save your login credentials?',
                    subTitle: 'You will not have to enter credentials again until cache is cleared by OS. Each time the app is opened, you will be routed home.',
                    scope: $scope,
                    buttons: [
                        { text: 'No', type: 'button-clear button-assertive' },
                        {
                            text: '<b>Yes</b>',
                            type: 'button-clear button-positive',
                            onTap: function(e) {
                                $log.info($globals.getHost());
                                $globals.setLoginVars($scope.host, $scope.port, $scope.zone, $scope.userName, $scope.password, $scope.authType);
                            }       
                        }
                    ]
                });
            }

        	$state.go('menu.home');
            $log.info("end login success processing");
            $rootScope.$emit("loggedIn", {});
        });
	}

}])










 //===================
 //*     Menu        *
 //*   CONTROLLER    *
 //===================
.controller('menuCtrl',['$scope', '$state', '$log', '$http', 'globals', '$window', '$rootScope', function($scope, $state, $log, $http, $globals, $window, $rootScope){
	$scope.goHome = function(){
		$log.info("Going Home");
		$rootScope.$broadcast('goHome', 0);
	}

    $scope.goVC = function(vc){
        $log.info("Going to query: "+vc.description);
        setTimeout(function(){
            $rootScope.$broadcast('goHome', vc);
        }, 200);
        
    }

    $scope.newSearch = function(){
        $rootScope.searchDir = '';
    }

    $scope.listVirtualCollections = function () {
        $log.info("getting virtual colls");
        return $http({method: 'GET', url: $globals.backendUrl('virtualCollection')}).success(function (data) {
            $rootScope.virtualCollections = data;
        }).error(function () {
            $rootScope.virtualCollections = [];
        });
    };

    $scope.logOut = function(){
         var promise = $http({
            method: 'POST',
            url: $globals.backendUrl('logout')
        }).then(function () {
            $globals.logOut();
            $state.go('login');
        });
        return promise;
    }
}])








 //===================
 //*     Search      *
 //*   CONTROLLER    *
 //===================
 .controller('searchCtrl',['$scope', '$location', '$http', 'globals', '$log', '$rootScope', function($scope, $location, $http, $globals, $log, $rootScope){
    $scope.url_query_name = uuid.v1();
    $scope.display_name = "";
    $scope.attr_names = "";
    $scope.attr_vals  = "";
    $scope.attr_evals = "EQUAL";
    $scope.searchPath = '';
    
    $scope.querySearch = function(){
        $log.info("Performing search POST");
        $log.info($scope.url_query_name);
        var query_val = '{"targetZone":"","queryType":"'+ 'BOTH' +'","pathHint":"'+$rootScope.searchDir+'","metadataQueryElements":[';
        query_val += '{"attributeName":"'+$scope.attr_names+'","operator":"'+$scope.attr_evals+'","attributeValue":["'+$scope.attr_vals+'"],"connector":"AND"},]}';
        return $http({
            method: 'POST',
            url: $globals.backendUrl('metadataQuery'),
            data: query_val,
            dataType: "json",
            params:{uniqueName:$scope.url_query_name, description:$scope.display_name}
        }).success(function (data) {
            $log.info("success search POST");
            
            setTimeout(function(){
                $rootScope.$broadcast('goHomeFromQuery', $scope.url_query_name);
            }, 0);
            
        }) 
    }

    $scope.cd = function(){
        $rootScope.cd = true;
        $rootScope.$broadcast('goHomeFromCD', "");
    }
                    
 }])





 //===================
 //*       VC        *
 //*   CONTROLLER    *
 //===================  
.controller('vcCtrl',['$scope', '$location', '$http', 'globals', '$log', '$rootScope', function($scope, $location, $http, $globals, $log, $rootScope){

    $rootScope.virtualCollections;

    $scope.listVirtualCollections = function () {
        $log.info("getting virtual colls");
        return $http({method: 'GET', url: $globals.backendUrl('virtualCollection')}).success(function (data) {
            $rootScope.virtualCollections = data;
        }).error(function () {
            $rootScope.virtualCollections = [];
        });
    };

    $scope.querySearchText = {};
    $scope.querySearchText.edited;
    $scope.querySearch = function(){
        var filter = $scope.querySearchText.edited.toUpperCase();
        var list = document.getElementById("queryList");
        var insideDiv = list.getElementsByClassName('queryItem');


        for (i = 0; i<insideDiv.length; i++) {
            var a = insideDiv[i].getElementsByClassName("queryItemName")[0].innerHTML.toUpperCase();
            if (a.indexOf(filter) > -1) {
                insideDiv[i].style.display = "";
            } else {
                insideDiv[i].style.display = "none";
            }
        }
    }

    $scope.doRefresh = function(){
        $log.info("refreshing");
        $scope.listVirtualCollections();
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.goVC = function(vc){
        $log.info("Going to query: "+vc.description);
        $rootScope.currentVC = vc.uniqueName;
        setTimeout(function(){
            $rootScope.$broadcast('goHome', vc);
        }, 0);
        
    }

    $scope.queryDelete = function(vc){
        $log.info("Deleting query");
        return $http({
            method: 'DELETE',
            url: $globals.backendUrl('virtualCollection' + "/" + encodeURI(vc.uniqueName)),
            params: {

            }
        }).then(function (data) {
            $log.info("Deletion completed!");
            setTimeout(function(){
                $scope.listVirtualCollections();
            }, 200);
        })
    }
                    
 }])







 //===================
 //*    Profile      *
 //*   CONTROLLER    *
 //===================   
.controller('profileCtrl',['$scope', '$state', '$log', 'profileService', '$http', 'globals', '$ionicPopup', function($scope, $state, $log, profileService, $http, $globals, $ionicPopup){

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

    $scope.updateProfile = function(){
        var udPath = $scope.getFormattedPath($scope.profileObject.domainObject.absolutePath);
        $scope.getProfileObj(udPath);
    }

    $scope.doRefresh = function(){
        $log.info("refreshing");
        $scope.updateProfile();
        $scope.$broadcast('scroll.refreshComplete');
    }


    $scope.metadata_add_action = function(){
        var new_Attr = document.getElementById('new_metadata_attribute').value;
        var new_Val = document.getElementById('new_metadata_value').value;
        var new_Unit = document.getElementById('new_metadata_unit').value;

        $log.info("adding md");
        var data_path = $scope.profileObject.domainObject.absolutePath;

        $http({
            method: 'PUT',
            url: $globals.backendUrl('metadata'),
            params: {
                irodsAbsolutePath: data_path, 
                attribute: new_Attr, 
                value: new_Val, 
                unit: new_Unit
            }
        }).then(function (response) {
            // The then function here is an opportunity to modify the response
            $log.info(response);
            // The return value gets picked up by the then in the controller.
            // return response.data;
        });

        $log.info("md added");
        var new_Attr = document.getElementById('new_metadata_attribute').value = "";
        var new_Val = document.getElementById('new_metadata_value').value = "";
        var new_Unit = document.getElementById('new_metadata_unit').value = "";
        $scope.doRefresh();
    }

    $scope.metadata_delete_action = function(attribute, value, unit){
        var data_path = $scope.profileObject.domainObject.absolutePath;

        $http({
            method: 'DELETE',
            url: $globals.backendUrl('metadata'),
            params: {
                irodsAbsolutePath: data_path, 
                attribute: attribute, 
                value: value, 
                unit: unit
            }
        }).then(function (response) {
            // The then function here is an opportunity to modify the response
            $log.info(response);
            $scope.doRefresh();
        });
    }

    $scope.shouldShowImg = function(){
        var fileType = $scope.mimeType;
        fileType = fileType.substring(0,5)
        if($scope.profileObject.mimeType == "image"){
            return true;
        }else{
            return false;
        }
    }

    // File Action -- RENAME
    $scope.renamePopup = function(){
        $scope.data = {};

        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="newName" id="newName">',
            title: 'Rename Object',
            subTitle: 'Be sure to include file type and keep same type as original',
            scope: $scope,
            buttons: [
                { text: 'Cancel', type: 'button-clear button-positive' },
                {
                    text: '<b>Save</b>',
                    type: 'button-clear button-positive',
                    onTap: function(e) {
                        var newName = document.getElementById('newName').value;
                        $scope.rename_Action(newName);
                    }       
                }
            ]
        });

        myPopup.then(function(res) {
            var newName = document.getElementById('newName').value;
            $log.info("Button tapped. New name is " +newName);
            $log.info("New path is "+$scope.newPath);
            setTimeout(function() {
                var newFormatPath = $scope.getFormattedPath($scope.newPath)
                $scope.getProfileObj(newFormatPath);
            }, 750);
        });
    }

    $scope.newPath;

    $scope.rename_Action = function(newName){
        var rename_path = $scope.profileObject.parentPath + "/" + $scope.profileObject.childName;
        var new_name = newName;
        $scope.newPath = $scope.profileObject.parentPath + "/" + newName;

        $log.info('Renaming:'+rename_path);
        return $http({
            method: 'PUT',
            url: $globals.backendUrl('rename'),
            params: {
                path: rename_path, 
                newName: new_name
            }
        }).success(function (data) {
        })
    }

    // File Action -- DELETE
    $scope.deletePopup = function(){

        var myPopup = $ionicPopup.show({
            title: 'Confirm Delete',
            subTitle: 'Are you sure you want to delete this object?',
            scope: $scope,
            buttons: [
                { text: 'Cancel', type: 'button-clear button-positive' },
                {
                    text: '<b>Delete</b>',
                    type: 'button-clear button-assertive',
                    onTap: function(e) {
                        $log.info("DLT button clicked");
                        $scope.delete_Action()
                    }       
                }
            ]
        });
    }

    $scope.delete_Action = function(){
        var delete_paths = $scope.profileObject.domainObject.absolutePath;
            $log.info('Deleting:'+delete_paths);
            return $http({
                method: 'DELETE',
                url: $globals.backendUrl('file'),
                params: {
                    path : delete_paths
                }
            }).then(function (data) {
                window.history.back();
            })
    }

}])
 