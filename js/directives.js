angular.module('starter.directives', [])
    .directive('allergixDailyTracker', function($ionicModal, Tracker, $window,  $ionicPopup) {
        return {
            restrict: 'E',
            templateUrl: 'templates/dailyTracker.html',
            link: function($scope, elem, attr) {
              $scope.shouldShowDelete = false;
              $scope.shouldShowReorder = false;
              $scope.listCanSwipe = true;
                Tracker.checkTrackerStatusForToday().then(function(response) {
                  if(response == false){
                    $window.localStorage.removeItem('trackerItems');
                  }
                  //if($window.localStorage.getItem('trackerItems')){
                  //  $scope.trackerItems = JSON.parse($window.localStorage.getItem('trackerItems'));
                  //} else {
                    $scope.trackerItems = {
                      consumables: [],
                      activities: [],
                      products: [],
                      dateCommitted: {},
                      otherFactors: {},
                      symptoms: [],
                      skin: [],
                      dailyTotal: 0,
                      trackerSlides: [

                        {

                          title: "Food/Drink",
                          data: {
                            items: []
                          },
                          input: true

                        }, {

                          title: "Products",
                          data: {
                            items: []
                          },
                          input: true

                        }, {

                          title: "Activities",
                          data: {
                            items: []
                          },
                          input: true

                        }, {

                          title: "Other Factors",
                          data: {

                            tree: false,
                            grass: false,
                            weed: false,
                            pollen: false,
                            mold: false,
                            cat: false,
                            dog: false,
                            stress: false


                          },
                          input: false

                        }, {

                          title: "Symptoms",
                          data: [
                            {
                              title:"Headache",
                              value: 0
                            },
                            {
                              title:"Nausea",
                              value: 0
                            },
                            {
                              title:"Bloating",
                              value: 0
                            },
                            {
                              title:"Constipation",
                              value: 0
                            },
                            {
                              title:"Diarrhea",
                              value: 0
                            },
                            {
                              title:"Vomiting",
                              value: 0
                            },
                            {
                              title:"Fatigue",
                              value: 0
                            },
                            {
                              title:"Congestion",
                              value: 0
                            },
                            {
                              title:"Sneezy",
                              value: 0
                            },
                            {
                              title:"Light Headed",
                              value: 0
                            },
                            {
                              title:"Irritable",
                              value: 0
                            },
                            {
                              title:"Post Nasal Drip",
                              value: 0
                            },
                            {
                              title:"Swollen Airway",
                              value: 0
                            },
                            {
                              title:"Wheezing",
                              value: 0
                            },
                            {
                              title:"Itchy Mouth",
                              value: 0
                            },
                            {
                              title:"Sore Throat",
                              value: 0
                            },
                            {
                              title:"Sinus Pressure",
                              value: 0
                            },
                            {
                              title:"Itchy Eyes",
                              value: 0
                            },
                            {
                              title:"Watery Eyes",
                              value: 0
                            },
                            {
                              title:"Other",
                              value: 0
                            },
                            {
                              title:"Other 2",
                              value: 0
                            },
                          ],
                          input: "rate"
                        },
                        {

                          title: "Skin",
                          data: [
                            {
                              title:"Bumps",
                              value: 0
                            },
                            {
                              title:"Swelling",
                              value: 0
                            },
                            {
                              title:"Bloating",
                              value: 0
                            },
                            {
                              title:"Cracks",
                              value: 0
                            },
                            {
                              title:"Red",
                              value: 0
                            },
                            {
                              title:"Dark Patches",
                              value: 0
                            },
                            {
                              title:"Thick Patches",
                              value: 0
                            },
                            {
                              title:"Itchy",
                              value: 0
                            },
                            {
                              title:"Blisters",
                              value: 0
                            },
                            {
                              title:"Dryness",
                              value: 0
                            },
                            {
                              title:"Oozing",
                              value: 0
                            },
                            {
                              title:"Scaly",
                              value: 0
                            },
                            {
                              title:"Pain",
                              value: 0
                            },
                            {
                              title:"Burning",
                              value: 0
                            },
                            {
                              title:"Waxy",
                              value: 0
                            },
                            {
                              title:"Yellowish",
                              value: 0
                            },
                            {
                              title:"Other",
                              value: 0
                            },
                            {
                              title:"Other 2",
                              value: 0
                            },
                            {
                              title:"Other 3",
                              value: 0
                            }
                          ],
                          input: "rate"
                        }

                      ]
                    };
                  //}
                    $scope.trackerStatus = response;
                })
                //declaring tracker variables
                $scope.today = new Date();
                $scope.currentTrackerSlide = 0;
                //if existing tracker get

               checkTrackerInProgress = function(){
                 if($window.localStorage.getItem('trackerItems'))
                  return true;
                 else
                  return false;
               }




                $scope.incrementSlide = function() {
                    if ($scope.currentTrackerSlide != $scope.trackerItems.trackerSlides.length - 1) {
                        $scope.currentTrackerSlide++;
                    }

                }
                $scope.decrementSlide = function() {
                    if ($scope.currentTrackerSlide != 0)
                        $scope.currentTrackerSlide--;
                }

              $scope.updateIndex = function (index) {
                $scope.currentTrackerSlide = index;
              }
                $scope.addTracker = function() {
                  $scope.trackerItems.dailyTotal = 0;
                  for (var x in $scope.trackerItems.trackerSlides[4].data) {
                    $scope.trackerItems.dailyTotal += parseInt($scope.trackerItems.trackerSlides[4].data[x].value);
                  }
                  for (var x in $scope.trackerItems.trackerSlides[5].data) {
                    $scope.trackerItems.dailyTotal += parseInt($scope.trackerItems.trackerSlides[5].data[x].value);
                  }
                    $scope.trackerItems.consumables = ($scope.trackerItems.trackerSlides[0].data.items);
                    $scope.trackerItems.products = ($scope.trackerItems.trackerSlides[1].data.items);
                    $scope.trackerItems.activities = ($scope.trackerItems.trackerSlides[2].data.items);
                    Tracker.updateTracker($scope.trackerItems);
                    trackerStatus = true;
                    $scope.closeModal();
                    $scope.trackerStatus = true;
                    //$window.localStorage.setItem("trackerItems", JSON.stringify($scope.trackerItems));

                }

                $scope.add = function(item) {
                  if(item)
                    $scope.trackerItems.trackerSlides[$scope.currentTrackerSlide].data.items.push(item);
                }
              $scope.removeItem = function(item, $index) {
                $scope.trackerItems.trackerSlides[$scope.currentTrackerSlide].data.items.splice($index, 1);

              }
                $scope.otherFactorsAdd = function(key, value) {
                  $scope.trackerItems.otherFactors[key] = value;
                  $scope.trackerItems.trackerSlides[$scope.currentTrackerSlide].data[key] = value;

                }
                $scope.symptomsAdd = function(key, value) {
                  //$scope.trackerItems.symptoms[key] = value;
                  $scope.trackerItems.trackerSlides[$scope.currentTrackerSlide].data[key].value = value;

                }
                // modal functions
                $ionicModal.fromTemplateUrl('templates/dailyTrackerModal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $scope.modal = modal;
                });
                $scope.openModal = function() {
                    $scope.modal.show();
                };
                $scope.closeModal = function() {
                    $scope.modal.hide();
                };
                //Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function() {
                    $scope.modal.remove();
                });
                // Execute action on hide modal
                $scope.$on('modal.hidden', function() {
                    // Execute action
                });
                // Execute action on remove modal
                $scope.$on('modal.removed', function() {
                    // Execute action
                });
              $scope.$on('$destroy', function() {
                console.log('Destroying modals...');
                $scope.modal.remove();
              });
              $scope.confirmTrackerSubmit = function() {
                var confirmPopup = $ionicPopup.confirm({
                  title: 'Commit Daily Tracker for ' + moment().format("MM/DD/YY"),
                  template: 'Ready to commit Daily Tracker? You can come back and edit during the day.'
                });

                confirmPopup.then(function(res) {
                  if(res) {
                    $scope.addTracker();
                  } else {
                    return;
                  }
                });
              };
            }
        }
    })

  .directive('newPost', function(Posts){
    return {
      restrict: 'E',
      templateUrl: 'templates/newPost.html',
      link: function($scope, elem, attr){
        $scope.submitPost = function(post){
          Posts.postTimeline(post);
        }
      }
    }
  })
  .directive('timelinePost', function($ionicPopup, $ionicModal, Posts){
    return {
      restrict: 'E',
      scope: {
        post: '=ngModel'
      },
      templateUrl: 'templates/timelinePostTemplate.html',
      link: function($scope, elem, attr){
        $scope.post.comments = $scope.post.comments ? $scope.post.comments: [] ;
        $scope.post.downvoteCount = $scope.post.downvoteCount ? $scope.post.downvoteCount: 0 ;
        $scope.post.upvoteCount = $scope.post.upvoteCount ? $scope.post.upvoteCount: 0 ;
        elem.bind('click', function(){
          console.log(elem);
          $scope.openModal();
        })
        $scope.upvote = function(){
          $scope.post.upvoteCount ++;
        }
        $scope.downvote = function(){
          $scope.post.downvoteCount ++;
        }
        $scope.addComment = function(comment) {
          if(comment)
            $scope.post.comments.push(comment);
        }
        // modal functions
        $ionicModal.fromTemplateUrl('templates/timelinePostModalTemplate.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });
        $scope.openModal = function() {
          $scope.modal.show();
        };
        $scope.closeModal = function() {
          $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {

          $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
          Posts.updatePost($scope.post, elem.attr('id'));
          // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
          // Execute action
        });

      }
    }
  })

.directive('dailyTrackerGraph', function(Tracker){
    return {
      restrict: 'A',
      scope: {

      },
      template: '<nvd3 options=\"options\" data=\"data\" config=\"config\" events=\"events\" api=\"api\"  on-ready=\"callback\"></nvd3>',
      link: function($scope, elem, attr){

        Tracker.getTotal().then(function(resp) {
          $scope.dailyTotals = resp;
          $scope.options = $scope.lineChartOptions();
          $scope.data = $scope.sinAndCos();
        });

        /*Random Data Generator */
        $scope.sinAndCos = function() {
          var dailyCount = [],
            symptoms = [],
            cos = [];

          //Data is represented as an array of {x,y} pairs.
          for (var x in $scope.dailyTotals) {
            dailyCount.push({
              x: moment($scope.dailyTotals[x].dateCommitted),
              y: $scope.dailyTotals[x].dailyTotal
            });
            // symptoms.push({
            //     x: moment($scope.dailyTotals[x].dateCommitted),
            //     y: $scope.dailyTotals[x].symptoms.total
            // });

          }

          //Line chart data should be sent as an array of series objects.
          return [{
            values: dailyCount, //values - represents the array of {x,y} data points
            key: 'Daily Allergen Severity Total', //key  - the name of the series.
            color: '#ff7f0e' //color - optional: choose your own line color.
          }];
        };

        $scope.lineChartOptions = function() {
          return {
            chart: {
              forceY: 35,
              type: 'lineChart',
              height: 450,
              margin: {
                top: 20,
                right: 35,
                bottom: 40,
                left: 55
              },
              x: function(d) {
                return d.x;
              },
              y: function(d) {
                return d.y;
              },
              useInteractiveGuideline: true,
              dispatch: {
                stateChange: function(e) {
                  console.log("stateChange");
                },
                changeState: function(e) {
                  console.log("changeState");
                },
                tooltipShow: function(e) {
                  console.log("tooltipShow");
                },
                tooltipHide: function(e) {
                  console.log("tooltipHide");
                }
              },
              xAxis: {
                axisLabel: 'Day of Week',
                tickFormat: function(d) {
                  return d3.time.format('%x')(new Date(d))
                }
              },
              yAxis: {
                axisLabel: 'Total',
                tickFormat: function(d) {
                  return d3.format()(d);
                },
                axisLabelDistance: -10
              },
              callback: function(chart) {
                console.log("!!! lineChart callback !!!");
              }
            },
            title: {
              enable: true,
              text: 'Daily Tracker Total Symptom Count'

            }
          }
        };
      }
    }
  })


  .directive('allergixPhoto', function(Camera, Tracker, $ionicModal){
    return {
      restrict: "A",
      scope:{},
      link: function($scope,elem,attr){
        elem.bind('click', function(event){

          Camera.getPicture().then(function(imageURI) {
            $scope.image = 'data:image/jpeg;base64,'+imageURI;
            $scope.openModal();
          }, function(err) {
            console.err(err);
          });
        });
        // modal functions
        $ionicModal.fromTemplateUrl('templates/addPhoto.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });
        $scope.openModal = function() {
          $scope.modal.show();
        };
        $scope.saveImage = function (photo, selectedPart) {
          Tracker.saveTrackerPhoto(photo);
          $scope.closeModal();
        }
        $scope.closeModal = function() {
          $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {

          $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
          // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
          // Execute action
        });
      }
    }
  })
  .directive('allergixGallery', function(Camera, Tracker, $ionicModal, Auth){
    return {
      restrict: "A",
      scope:{},
      link: function($scope,elem,attr){
          Tracker.getTrackerPhotos().then(function(response){
            $scope.photos = response;
            // find length of object
          })
        elem.bind('click', function(event){
          $scope.openModal();
        });
        // modal functions
        $ionicModal.fromTemplateUrl('templates/photoGallery.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });
        $scope.openModal = function() {
          $scope.modal.show();
        };
        $scope.saveImage = function (photo, selectedPart) {
          $scope.closeModal();
        }
        $scope.closeModal = function() {
          $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {

          $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
          // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
          // Execute action
        });
      }
    }
  });
