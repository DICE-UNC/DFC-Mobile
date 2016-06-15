angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.useXDomain = true;


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

    .state('menu.home', {
      url: '/page1',
      views: {
        'side-menu21': {
          templateUrl: 'templates/home.html',
          controller: 'homeCtrl'
        }
      },
      resolve: {
        // set vc name as selected
        // selectedVc: function ($route, virtualCollectionsService) {
        //   var vcData = virtualCollectionsService.listUserVirtualCollectionData($route.current.params.vcName);
        //   return vcData;
        // },


        // do a listing
        // pagingAwareCollectionListing: function ($route, collectionsService) {
        //   var vcName = 'starred' //$route.current.params.vcName;

        //   var path = $route.current.params.path;
        //   if (path == null) {
        //     path = "";
        //   }

        //   return collectionsService.listCollectionContents(vcName, path, 0);
        // }
      }
    })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl',
    abstract:true
  })

  .state('login', {
    url: '/page4',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('menu.profile', {
    url: '/page5',
    views: {
      'side-menu21': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/side-menu21/page1')

  

});