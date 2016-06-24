angular.module('app.services', [])



.factory('globals',['$rootScope', '$log', '$location', '$injector', '$window', function ($rootScope, $log, $location,  $injector, $window) {

        var f = {};

        /*
         NB put the trailing slash in the HOST variable!
         */

        // var HOST = "http://localhost:8080/irods-cloud-backend/";
        var HOST = "http://dfcweb.datafed.org:8080/irods-cloud-backend/";


        f.backendUrl = function(relativeUrl) {
            return HOST + relativeUrl;
        };

        f.subCollectionURL = function(normURL){
            var URL = normURL.replace("/","%2F");
            return "http://dfcweb.datafed.org:8080/irods-cloud-backend/collection/Starred%20Files?offset=0&path="+URL;
        }

        /**
         * Saved path in case an auth exception required a new login
         * @type {null}
         */
        f.lastPath = null;
        f.loggedInIdentity = null;



        /**
         * Saved path when a not authenticated occurred
         * @param newLastPath
         */
        f.setLastPath = function (newLastPath) {
            this.lastPath = newLastPath;
        };


        /**
         * Retrieve a path to re-route when a login screen was required
         * @returns {null|*|f.lastPath}
         */
        f.getLastPath = function () {
            return this.lastPath;
        };

        /**
         * Retrieve the user identity, server info, and options for the session
         * @returns {null|*}
         */
        f.getLoggedInIdentity = function() {
            return this.loggedInIdentity;
        }

        /**
         * Set the user identity, server info, and options for the session
         * @param inputIdentity
         */
        f.setLoggedInIdentity = function(inputIdentity) {
            this.loggedInIdentity = inputIdentity;
        }

        f.setLoginVars = function(host, port, zone, userName, password, authType){
            $window.localStorage.setItem("host",host);
            $window.localStorage.setItem("port",port);
            $window.localStorage.setItem("zone",zone);
            $window.localStorage.setItem("userName",userName);
            $window.localStorage.setItem("password",password);
            $window.localStorage.setItem("authType",authType);
        }

        f.getHost = function(){
            return $window.localStorage.getItem("host");
        }

        f.getPort = function(){
            return $window.localStorage.getItem("port");
        }

        f.getZone = function(){
            return $window.localStorage.getItem("zone");
        }

        f.getUN = function(){
            return $window.localStorage.getItem("userName");
        }

        f.getPW = function(){
            return $window.localStorage.getItem("password");
        }

        f.getAuth = function(){
            return $window.localStorage.getItem("authType");
        }

        f.logOut = function(){
            $window.localStorage.setItem("host",null);
            $window.localStorage.setItem("port",null);
            $window.localStorage.setItem("zone",null);
            $window.localStorage.setItem("userName",null);
            $window.localStorage.setItem("password",null);
            $window.localStorage.setItem("authType",null);
        }

        return f;

}])

.factory('collectionsService', ['$http', '$log', 'globals', function ($http, $log, $globals) {

        var pagingAwareCollectionListing = {};

        return {

            selectVirtualCollection: function (vcName) {
                //alert(vcName);
            },

            /**
             * List the contents of a collection, based on the type of virtual collection, and any subpath
             * @param reqVcName
             * @param reqParentPath
             * @param reqOffset
             * @returns {*|Error}
             */
            listCollectionContents: function (reqVcName, reqParentPath, reqOffset) {
                $log.info("doing get of the contents of a virtual collection");

                if (!reqVcName) {
                    $log.error("recVcName is missing");
                    throw "reqMcName is missing";
                }

                if (!reqParentPath) {
                    reqParentPath = "";
                }

                if (!reqOffset) {
                    reqOffset = 0;
                }

                $log.info("requesting vc:" + reqVcName + " and path:" + reqParentPath);
                return $http({
                    method: 'GET',
                    url: $globals.backendUrl('collection/Starred%20Files?offset=0&path='),
                    params: {path: reqParentPath, offset: reqOffset}
                }).success(function (response) {
                    pagingAwareCollectionListing = response.data;

                }).error(function () {
                    pagingAwareCollectionListing = {};

                });

            },
            addNewCollection: function (parentPath, childName) {
                $log.info("addNewCollection()");
            }
        };
}])

.factory('virtualCollectionsService', ['$http', '$log', 'globals','$window', function ($http, $log, globals, $window) {
        var virtualCollections = [];
        var virtualCollectionContents = [];
        var selectedVirtualCollection = {};

        return {


            listUserVirtualCollections: function () {
                $log.info("getting virtual colls");
                return $http({
                    method: 'GET', 
                    url: globals.backendUrl('virtualCollection')
                }).success(function (data) {
                    virtualCollections = data;
                }).error(function () {
                    virtualCollections = [];
                });
            },

            listUserVirtualCollectionData: function (vcName) {
                $log.info("listing virtual collection data");

                if (!vcName) {
                    virtualCollectionContents = [];
                    return;
                }

                return $http({
                    method: 'GET',
                    url: globals.backendUrl('virtualCollection/') + vcName
                }).success(function (data) {
                    virtualCollections = data;
                }).error(function () {
                    virtualCollections = [];
                });

            }

        };



}])

.service('loginService', ['$window', function($window){
    var loginService = [];


        var setStarredColData = function(){
            return $http({
                method: 'GET', 
                url: $globals.backendUrl('collection/Starred%20Files?offset=0&path=')
            }).success(function (data) {
                loginService = data;
            });
        }

        var getStarredColData = function(){
            return loginService;
        }


        var setLoginVars = function(host, port, zone, userName, password, authType){
            $window.localStorage.setItem("host",host);
            $window.localStorage.setItem("port",port);
            $window.localStorage.setItem("zone",zone);
            $window.localStorage.setItem("userName",userName);
            $window.localStorage.setItem("password",password);
            $window.localStorage.setItem("authType",authType);
        }

        var getHost = function(){
            return $window.localStorage.getItem("host");
        }

        var getPort = function(){
            return $window.localStorage.getItem("port");
        }

        var getZone = function(){
            return $window.localStorage.getItem("zone");
        }

        var getUN = function(){
            return $window.localStorage.getItem("userName");
        }

        var getPW = function(){
            return $window.localStorage.getItem("password");
        }

        var getAuth = function(){
            return $window.localStorage.getItem("authType");
        }
    

    
}])

.service('profileService', [ function(){
    var profileObject = [];

    var setProfileObj = function(profObj){
        profileObject = profObj;
    };

    var getProfileObj = function(){
        if(profileObject != []){
            return profileObject;
        }
    };

    return{
        setProfileObj: setProfileObj,
        getProfileObj: getProfileObj
    };
}]);

