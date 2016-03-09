var MyApp = angular.module('MyApp', ['ui.router']);

MyApp.config(function ($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
    
        .state('home', {
            url: '/',
            templateUrl: 'pages/main.html',
            controller: 'mainCtrl'            
        })

        .state('weather', {
            url: '/weather',
            templateUrl: 'pages/weather.html',
            controller: 'mainCtrl'
        })
});


MyApp.controller('mainCtrl', function($scope, WeatherService, $timeout, HttpRequesterForWeather){

    $scope.allothercities = function(){

        HttpRequesterForWeather.getWeatherData($scope.lat, $scope.lon)
            .then(function(dd){
                //console.log(123);
                $scope.citiesdata = [];
                $scope.currentCityNames = dd.city.name;
                console.log($scope.currentCityNames);
                angular.forEach(dd.list, function(value){
                    if(value.dt_txt.indexOf("12:00:00")> -1){
                        this.push(value);
                    }                            
                }, $scope.citiesdata); 

                return $scope.citiesdata;               
            })
            .then(function(data){
                $scope.finalDataOtherCities = [];
                $scope.finalDataOtherCities.push(
                                {   otherstemper: (((data[0].main.temp - 273.15) * 1.8)+32).toString().substr(0,4),
                                    otherslayer: data[0].dt_txt.substr(0,10),
                                    othersimager: "http://openweathermap.org/img/w/"+data[0].weather[0].icon+".png",
                                    othercurrentDayWeatherDesc: data[0].weather[0].description
                                });

                for(var i in $scope.finalDataOtherCities){
                    console.log($scope.finalDataOtherCities[i]);
                } 

            })
    }
    



    $scope.getLatLon = function(){

        $scope.bool = false;

        WeatherService.getLocation()
        
        .then(function(data){
                $scope.lat = data.coords.latitude;
                $scope.lon = data.coords.longitude;
                $scope.currentCityData = HttpRequesterForWeather.getWeatherData($scope.lat, $scope.lon)
                    .then(function(data){
                        $scope.bool = true;
                        $scope.newd = [];
                        $scope.currentCityName = data.city.name;
                        angular.forEach(data.list, function(value){
                            if(value.dt_txt.indexOf("12:00:00")> -1){
                                this.push(value);
                            }                            
                        }, $scope.newd);
                        return $scope.newd;
                    })


                    .then(function(data){
                        //angular.forEach(data, function(value){

                            $scope.currentDayWeatherInF = (((data[0].main.temp - 273.15) * 1.8)+32).toString().substr(0,4);
                            $scope.currentDayWeatherDesc = data[0].weather[0].description;
                            $scope.currentDayWeatherDay = data[0].dt_txt.substr(0, 10);
                            $scope.currentDayWeatherIcon = "http://openweathermap.org/img/w/"+data[0].weather[0].icon+".png";
                            //console.log(data[0].weather[0].description);
                            //http://openweathermap.org/img/w/10d.png
                            $scope.allData = [];

                            for(var i = 1; i<data.length; i++){
                                $scope.allData.push({temper: (((data[i].main.temp - 273.15) * 1.8)+32).toString().substr(0,4),
                                                     dayer: data[i].dt_txt.substr(5, 5),
                                                     imager: "http://openweathermap.org/img/w/"+data[i].weather[0].icon+".png" 
                                                    });
                                
                            };

                            //for(var i = 0; i<$scope.allData.length; i++){
                            //    console.log($scope.allData[i]);
                            //}

                        //})
                    })

            })

    };
    
    $timeout($scope.getLatLon);   
    $timeout($scope.allothercities); 

});


MyApp.directive('featuresRes', function(){
	return {
		templateUrl: './directives/features.html',
        scope:{
           personObject: '=' 
        }
	}
});


MyApp.directive('featuresWeighStations', function(){
    return {
        templateUrl: './directives/weighStationDirective.html'
    }
});

MyApp.directive('dieselPrices', function(){
    return {
        templateUrl: './directives/featuresDieselPrices.html'
    }
});

MyApp.directive('truckStops', function(){
    return {
        templateUrl: './directives/truckstops.html'
    }
});


MyApp.directive('offline', function(){
    return {
        templateUrl: './directives/offlineMaps.html'
    }
});

MyApp.directive('footer', function(){
    return {
        templateUrl: './directives/footer.html'
    }
});

MyApp.directive('newyork', function(){
    return{
        templateUrl: './directives/newyork.html',
        controller: 'mainCtrl',
        scope:{
            lat: '=',
            lon: '='
        }        
    }
});

MyApp.directive('chicago', function(){
    return{
        templateUrl: './directives/chicago.html',
        controller: 'mainCtrl',
        scope:{
            lat: '=',
            lon: '='
        }
    }
});


MyApp.directive('cities', function(){
    return{
        templateUrl: './directives/cities.html',
        controller: 'mainCtrl',
        scope:{
            lat: '=',
            lon: '='
        }
    }
});


MyApp.directive('seattle', function(){
    return{
        templateUrl: './directives/seattle.html',
        controller: 'mainCtrl',
        scope:{
            lat: '=',
            lon: '='
        }        
    }
});

MyApp.directive('sanfran', function(){
    return{
        templateUrl: './directives/sanfran.html',
        controller: 'mainCtrl',
        scope:{
            lat: '=',
            lon: '='
        }        
    }
})

MyApp.service('WeatherService', function($rootScope, $http, $window, $q){
    
    this.getLocation = function(){
        var defer = $q.defer();

        $window.navigator.geolocation.getCurrentPosition(function(position){
        
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        var obj = lat;
        defer.resolve(position)
/*
        $rootScope.$apply(function(){
            $rootScope.lat = lat;
            $rootScope.lon = lon;
            //9121d488f79405aec80d84698debdbb0
        })
*/        
    });
    return defer.promise;

}

});



MyApp.service('HttpRequesterForWeather', function($http, $q, $timeout){
    
    this.getWeatherData = function(lat, lon){
        var defer = $q.defer();
        $http.get('http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&appid=6ae723f911e1cb6f24a7e41411ced8b9')
            .success(function(data){
               var self = this;
               $timeout(function(){
                    //onsole.log(data)
                    defer.resolve(data);
               }, 100)
                
            })

            .error(function(err){
                defer.reject(err);
            });

            return defer.promise;
    };
});
