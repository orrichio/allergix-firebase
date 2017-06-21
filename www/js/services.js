angular.module('starter.services', [])

.factory('Auth', ["$firebaseAuth", "$ionicLoading", "$ionicHistory", "$state", "$timeout","$rootScope",
    function($firebaseAuth, $ionicLoading, $ionicHistory, $state, $timeout, $rootScope) {
        {
            var Auth = {};
            var ref = new Firebase("https://allergix.firebaseio.com/");
            var auth = $firebaseAuth(ref);
            var user = user ? null : auth.$getAuth();
            Auth.getUid = function() {
              if(user) {
                var uid = auth.$getAuth().uid;
                return uid;
              }
            };


            Auth.login = function(user) {

                var isAuth = auth.$authWithPassword({
                    email: user.email,
                    password: user.password
                });
                $ionicLoading.show({
                    template: 'Loading...'
                });
                isAuth
                    .then(function(data) {

                        $ionicLoading.hide();
                        user = data;
                        $state.go('tab.dash');
                        $rootScope.$broadcast("loggedIn");


                  }, function(err) {
                        console.log("failed " + err);
                        $ionicLoading.hide();

                    })
            }
            Auth.logout = function() {
                auth.$unauth();
                $ionicLoading.show({
                    template: 'Logging out....'
                });

                $timeout(function() {
                    $ionicLoading.hide();
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $ionicHistory.nextViewOptions({
                        disableBack: true,
                        historyRoot: true
                    });
                    $state.go('login');
                }, 30);
            }
            Auth.register = function() {
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
                                allergens: []
                            }
                        }
                        users[key] = userToCreate;
                        usersRef.update(users);
                        $scope.login(user);
                    }
                });


            }
            Auth.getUser = function() {
                return user;
            }
            return Auth;
        }
    }
])
    .service('User', ["$firebaseAuth", "Auth", "$firebaseObject",
        function($firebaseAuth, Auth, $firebaseObject) {
            this.addNewAllergen = function(allergens) {
                var uid = Auth.getUid();
                var allergenRef = new Firebase("https://allergix.firebaseio.com/users/" + uid + "/preferences/allergens");
                allergenRef.push(allergens);
            }

            this.removeAllergen = function(allergenId) {
                var uid = Auth.getUid();
                var allergenRef = new Firebase("https://allergix.firebaseio.com/users/" + uid + "/preferences/allergens/" + allergenId);
                allergenRef.remove();
            }
            this.getUser = function() {
                var uid = Auth.getUid();

                var userRef = new Firebase("https://allergix.firebaseio.com/users/" + uid);

                var userObject = $firebaseObject(userRef);

                // $loaded() returns a promise, so we can use the then() method to add
                // functionality when the array finishes loading and the promise resolves.
                var u = userObject.$loaded().then(function(data) {
                    // Now return the logo for the first matching opponent
                    return userObject;
                });

                return u;
            }

            this.findFriends = function(email) {
                var userRef = new Firebase("https://allergix.firebaseio.com/users/");
                var usersObject = $firebaseObject(userRef.orderByChild("email").startAt(email).endAt(email + "\uf8ff"));
                // $loaded() returns a promise, so we can use the then() method to add
                // functionality when the array finishes loading and the promise resolves.
                var u = usersObject.$loaded().then(function(data) {
                    // Now return the logo for the first matching opponent
                    return usersObject;
                });

                return u;
            }


        }

    ])

.service('Posts', ["$firebaseAuth", "Auth", "$firebaseObject",
    function($firebaseAuth, Auth, $firebaseObject) {
        this.getTimeline = function() {
            var postsRef = new Firebase("https://allergix.firebaseio.com/posts");
            var postsObject = $firebaseObject(postsRef);
            // $loaded() returns a promise, so we can use the then() method to add
            // functionality when the array finishes loading and the promise resolves.
            var p = postsObject.$loaded().then(function(data) {
                // Now return the logo for the first matching opponent
                return postsObject;
            });

            return p;
        }
        this.postTimeline = function(post) {

            var postsRef = new Firebase("https://allergix.firebaseio.com/posts");
            post.created = moment().format();
            post.createdBy = Auth.getUser().password.email;
            postsRef.push(post);
        }
      this.updatePost = function(post, id) {
        var postsRef = new Firebase("https://allergix.firebaseio.com/posts/" + id);
        post.created = moment().format();
        post.createdBy = Auth.getUser().password.email;
        postsRef.update(post);
      }

    }
])

.service('Tracker', ["$firebaseAuth", "Auth", "$firebaseObject",
    function($firebaseAuth, Auth, $firebaseObject) {
        this.updateTracker = function(tracker) {
            var uid = Auth.getUid()
                //formats new entry as 01011970 month.date.year
            var trackerRef = new Firebase("https://allergix.firebaseio.com/users/" + uid + "/dailyTracker/" + moment().format("MMDDYYY"));
            tracker.dateCommitted = moment().format();
            trackerRef.update(tracker);
        }
        //check if user has already done a daily status
        this.checkTrackerStatusForToday = function() {
            var uid = Auth.getUid()

            var trackerRef = new Firebase("https://allergix.firebaseio.com/users/" + uid + "/dailyTracker/");
            var trackerObject = $firebaseObject(trackerRef);

            var p = trackerObject.$loaded().then(function(data) {

                if (trackerObject[moment().format("MMDDYYY")]) {
                    return true;
                } else {
                    return false;
                }
            });

            return p;
        }
        this.get = function() {
            var uid = Auth.getUid()

            var trackerRef = new Firebase("https://allergix.firebaseio.com/users/" + uid + "/dailyTracker/");
            var trackerObject = $firebaseObject(trackerRef);

            var p = trackerObject.$loaded().then(function(data) {
                return trackerObject;

            });

            return p;
        };
                this.getTrackerToday = function() {
            var uid = Auth.getUid()

            var trackerRef = new Firebase("https://allergix.firebaseio.com/users/" + uid + "/dailyTracker/" + moment().format("MMDDYYY"));
            var trackerObject = $firebaseObject(trackerRef);

            var p = trackerObject.$loaded().then(function(data) {
                return trackerObject;

            });

            return p;
        };
      this.getTotal = function() {
        var uid = Auth.getUid()
        var dailyTotalArr = []
        var trackerRef = new Firebase("https://allergix.firebaseio.com/users/" + uid + "/dailyTracker/");
        var trackerObject = $firebaseObject(trackerRef);

        var p = trackerObject.$loaded().then(function(data) {

          angular.forEach(trackerObject, function(value, key) {

            dailyTotalArr.push(value);



          })
          return dailyTotalArr;

        });

        return p;
      };
      this.getTrackerPhotos = function() {
        var uid = Auth.getUid()
        var dailyTotalArr = []
        var trackerRef = new Firebase("https://allergix.firebaseio.com/users/" + uid + "/dailyTracker/"+ moment().format("MMDDYYY") + "/images");
        var trackerObject = $firebaseObject(trackerRef);

        var p = trackerObject.$loaded().then(function(data) {
          return data;
        });
        return p;
      };

      this.saveTrackerPhoto = function(photo) {
        var uid = Auth.getUid();
        var trackerRef = new Firebase("https://allergix.firebaseio.com/users/" + uid + "/dailyTracker/" + moment().format("MMDDYYY") + "/images");
        trackerRef.push(photo);
      }

    }
])
.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, {
        quality : 75,
        destinationType : Camera.DestinationType.DATA_URL,
        sourceType : Camera.PictureSourceType.CAMERA,
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
      });

      return q.promise;
    }
  }
}]);
