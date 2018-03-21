// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('movielens', ['ionic', 'controllers', 'services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.users', {
    url: '/users',
    type: 'user',
    views: {
      'tab-users': {
        templateUrl: 'templates/tab-users.html',
        controller: 'ListCtrl'
      }
    }
  })

  .state('tab.user', {
      url: '/users/:id',
      type: 'user',
      views: {
        'tab-users': {
          templateUrl: 'templates/tab-users.html',
          controller: 'ListCtrl'
        }
      }
    })

  .state('tab.ratings', {
      url: '/ratings',
      type: 'rating',
      views: {
        'tab-ratings': {
          templateUrl: 'templates/tab-ratings.html',
          controller: 'ListCtrl'
        }
      }
    })
    .state('tab.userratings', {
      url: '/ratings/user/:userId',
      type: 'rating',
      views: {
        'tab-ratings': {
          templateUrl: 'templates/tab-ratings.html',
          controller: 'ListCtrl'
        }
      }
    })
    .state('tab.movieratings', {
      url: '/ratings/movie/:movieId',
      type: 'rating',
      views: {
        'tab-ratings': {
          templateUrl: 'templates/tab-ratings.html',
          controller: 'ListCtrl'
        }
      }
    })

  .state('tab.movies', {
    url: '/movies',
    type: 'movie',
    views: {
      'tab-movies': {
        templateUrl: 'templates/tab-movies.html',
        controller: 'ListCtrl'
      }
    }
  })
  .state('tab.movie', {
      url: '/movies/:id',
      type: 'movie',
      views: {
        'tab-movies': {
          templateUrl: 'templates/tab-movies.html',
          controller: 'ListCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/users');

});
