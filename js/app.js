// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives', 'firebase', 'nvd3'])
//.constant(FURL, "https://allergix.firebaseio.com")
.run(function($ionicPlatform, $rootScope, $firebaseAuth, $state) {
    $rootScope.Utils = {
      keys : Object.keys
    }

    $ionicPlatform.ready(function() {
      var ref = new Firebase("https://allergix.firebaseio.com/");
      auth = $firebaseAuth(ref);
      if(auth.$getAuth()) {
        var authData = auth.$getAuth();
        if (!authData) {
          window.location.href="#login"

        }
        else {
          $state.go('tab.dash');
        }
      }

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
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            var ref = new Firebase("https://allergix.firebaseio.com/");
            auth = $firebaseAuth(ref);

            var authData = auth.$getAuth();
            if (!authData) {
              window.location.href="#login"


            }

        })
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {
    //$ionicConfigProvider.views.maxCache(0);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);

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

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.chats', {
        url: '/chats',
        views: {
            'tab-chats': {
                templateUrl: 'templates/tab-chats.html',
                //controller: 'ChatsCtrl'
            }
        }
    })
        .state('tab.chat-detail', {
            url: '/chats/:chatId',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/chat-detail.html'
                    //controller: 'ChatDetailCtrl'
                }
            }
        })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    })
        .state('tab.account-allergens', {
            url: '/allergens',
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab-account-allergens.html',
                    controller: 'AccountCtrl'
                }
            }


        })
        .state('tab.account-friends', {
            url: '/friends',
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab-account-friends.html',
                    controller: 'AccountCtrl'
                }
            }


        })
        .state('tab.account-preferences', {
            url: '/preferences',
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab-account-preferences.html',
                    controller: 'AccountCtrl'
                }
            }


        })

        .state('tab.posts', {
            url: '/posts',
            views: {
                'tab-posts': {
                    templateUrl: 'templates/tab-posts.html',
                    controller: 'PostsCtrl'
                }
            }
        })
      .state('tab.tracker', {
        url: '/tracker',
        views: {
          'tab-tracker': {
            templateUrl: 'templates/tab-account-tracker.html',
            controller: 'TrackerCtrl'
          }
        }


      })
    .state('login', {
        url: '/login',

        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'


    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

});
