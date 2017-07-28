angular.module('AtmsNearbyModule', [])

    .directive('atmsNearbyDirective', function($timeout) {
        return {
            restrict: 'AE',
            replace: true,
            require: 'ngModel',
            template: '<div id="map"></div>',
            scope: {
                ngModel: '=',
            },
            link: function(scope, elem, attr) {

                var map;
                //var myLocation;
                //Belgrade center, default value
                var myLocation = {
                    lat: 44.815804,
                    lng: 20.460223
                };

                function initMap() {

                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            myLocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            console.log("User Location", myLocation); //detected user location coordinates
                            setPos(myLocation);

                        }, function() {
                            //If navigator has a error show map with default coordinates for user location   
                            setPos(myLocation);
                        });
                    } else {
                        //if navigator is not supported also show map, with default coordinates for user location    
                        setPos(myLocation);
                    }
                }

                function setPos(myLocation) {
                    //init map and set user location as center
                    map = new google.maps.Map($('#map')[0], {
                        center: myLocation,
                        zoom: 10,
                        minZoom: 11,
                    });

                    marker = new google.maps.Marker({
                        map: map,
                        position: myLocation,
                        icon: 'http://maps.google.com/mapfiles/kml/shapes/man.png'
                    });

                    //init service fot places 
                    var service = new google.maps.places.PlacesService(map);

                    //return array of results
                    service.nearbySearch({
                        location: myLocation,
                        radius: 10000,
                        types: ['atm']
                    }, processResults);
                }

                function processResults(results, status, pagination) {

                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                        return;
                    } else {

                        var newResult = []; //new array for results
                        var dataForController = []; //just for showing how to transver data to controller from directive

                        for (var i = 0, result; result = results[i]; i++) {
                            //multi-currency atms , for parametar taht define them used icon, example Telenor bank	
                            var iconArryCaracters = result.icon.split("/");

                            if (iconArryCaracters[iconArryCaracters.length - 1] == 'bank_dollar-71.png') {
                                //calculcating distance
                                result.distanceFromCurrentLocation = calcDistance(myLocation.lat, myLocation.lng, result.geometry.location.lat(), result.geometry.location.lng());
                                newResult.push(result);
                                dataForController.push({ name: result.name, distance: Math.round(result.distanceFromCurrentLocation), address: result.vicinity });
                            }
                        }
                        //sort array by distance for map
                        newResult.sort(function(a, b) {
                            return a["distanceFromCurrentLocation"] - b["distanceFromCurrentLocation"];
                        });

						//sort array by distance for controller
                        dataForController.sort(function(a, b) {
                            return a["distance"] - b["distance"];
                        });                        

                        scope.$apply(function() {
                            scope.ngModel = dataForController.slice(0,10);
                        });
                        //draw markers on map for first 10 elemetnts
                        createMarkers(newResult.slice(0,10));
                    }
                }

                function createMarkers(places) {
                    var bounds = new google.maps.LatLngBounds();
                    var placesList = document.getElementById('places');

                    for (var i = 0, place; place = places[i]; i++) {
                        //here need to recalculate distance between current location and evrey atm, define multicurrency atm
                        //after taht need to be showed only 10 closest
                        var image = {
                            url: place.icon,
                            size: new google.maps.Size(30, 30),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(10, 27),
                            scaledSize: new google.maps.Size(25, 25)
                        };

                        var marker = new google.maps.Marker({
                            map: map,
                            icon: image,
                            title: place.name,
                            //animation: google.maps.Animation.DROP,
                            position: place.geometry.location
                        });

                        //adding name to be visible on top of pin
                        addInfoWindow(marker, place.name, Math.round(place.distanceFromCurrentLocation));

                        bounds.extend(place.geometry.location);
                    }

                    map.fitBounds(bounds);
                }

                function addInfoWindow(marker, message, distance) {
                    //add info window to map marker
                    var infoWindow = new google.maps.InfoWindow({
                        content: '<div>' + message + '</div><div>' + distance + 'm</div>'
                    });
                    infoWindow.open(map, marker);
                };

                //calculate distance from user current locarion to ATM
                function calcDistance(fromLat, fromLng, toLat, toLng) {
                    return google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
                }

                initMap();
            }
        }
    });