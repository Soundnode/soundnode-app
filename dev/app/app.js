'use strict'

var app = angular.module('App', ['ngRoute']);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'home/home.html', 
			controller: 'homeController'
		})
		.otherwise({  redirectTo: '/home' });
});