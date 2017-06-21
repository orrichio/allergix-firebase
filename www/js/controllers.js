angular.module('starter.controllers', [])

  .controller('MainCtrl', function($scope,Tracker, Auth, $rootScope, Camera, $state){

    vm = this;
   vm.state = $state;
    console.log(vm.state);
  })
.controller('DashCtrl', function($scope, Posts, Tracker) {

    Posts.getTimeline().then(function(data) {
        $scope.posts = data;
    });

    Tracker.getTrackerToday().then(function(resp){
      $scope.tracker = resp;
    })


})

.controller("AccountCtrl", function($scope, $firebaseObject, $firebaseAuth, $state, $rootScope, $ionicLoading, User, $timeout, $ionicHistory, Auth, Posts, Tracker, Camera) {


    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true;
    Tracker.get().then(function(resp) {
        $scope.trackers = resp;
    })
    $scope.addAllergen = function(allergen) {
        User.addNewAllergen(allergen);
    }

    $scope.logout = function() {

        Auth.logout();
    }
    $scope.removeAllergen = function(allergenId) {
        User.removeAllergen(allergenId);
    }
    $scope.login = function(user) {
        var isAuth = $scope.auth.$authWithPassword({
            email: user.email,
            password: user.password
        });
        $ionicLoading.show({
            template: 'Loading...'
        });
        isAuth
            .then(function(data) {

                $ionicLoading.hide();
                $scope.user = data;
                $state.go('tab.dash');

            }, function(err) {
                console.log("failed " + err);
                $ionicLoading.hide();

            })

    };
    User.getUser().then(function(data) {
        $scope.user = data;
    })

    $scope.searchFriends = function(email) {
        User.findFriends(email).then(function(result) {
            $scope.searchResults = result;
        })
    }

    $scope.postToTimeline = function(postData) {
        Posts.postTimeline(postData);
    }
})

.controller("LoginCtrl", function($scope, $firebaseObject, $firebaseAuth, $state, $rootScope, $ionicLoading, User, Auth) {

    var ref = new Firebase("https://allergix.firebaseio.com/");
    $scope.auth = $firebaseAuth(ref);
    $scope.login = function(user) {
        Auth.login(user);
    };
    $scope.register = function(user) {
        $ionicLoading.show({
            template: 'Loading...'
        });
        ref.createUser({
            email: user.email,
            password: user.password
        }, function(error, userData) {
            if (error) {
                switch (error.code) {
                    case "EMAIL_TAKEN":
                        console.log("The new user account cannot be created because the email is already in use.");
                        break;
                    case "INVALID_EMAIL":
                        console.log("The specified email is not a valid email.");
                        break;
                    default:
                        console.log("Error creating user:", error);
                }
            } else {

                console.log("Successfully created user account with uid:", userData.uid);

                var usersRef = ref.child("users");
                users = {};
                var key = userData.uid;
                var userToCreate = {
                    email: user.email,
                    preferences: {
                        allergens: ["placeholder"]
                    }
                }
                users[key] = userToCreate;
                usersRef.update(users);
                $scope.login(user);
            }
        });

    }
})
    .controller('TrackerCtrl', ['$scope', 'Tracker',
        function($scope, Tracker) {

        }
    ])

.controller('PostsCtrl', ['$scope',
    function($scope) {

    }
])
