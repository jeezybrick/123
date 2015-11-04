/**
 * Created by user on 05.10.15.
 */

angular
    .module('myApp', [
        'ngCookies',
        'ngRoute',
        'ui.router',
        'ui.calendar',
        'ui.bootstrap',
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'myApp.services',
        'flash',
        'mgcrea.ngStrap',
        'ngMaterial',
        'angular-loading-bar',
        'angular.filter',
        'ngMessages',

    ])
    .config(function ($locationProvider, $httpProvider, $resourceProvider, $interpolateProvider, $routeProvider,
                      $compileProvider, $stateProvider, $urlRouterProvider) {

        // CSRF Support
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

        $resourceProvider.defaults.stripTrailingSlashes = false;

        // Force angular to use square brackets for template tag
        // The alternative is using {% verbatim %}
        $interpolateProvider.startSymbol('[[').endSymbol(']]');

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);

        // enable html5Mode for pushstate ('#'-less URLs)
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');


        // Routing
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('auth-login', {
                url: '/login',
                templateUrl: '/static/partials/my_auth/login.html',
                controller: 'LoginCtrl'
            })
            .state('auth-registration', {
                url: '/register',
                templateUrl: '/static/partials/my_auth/register.html',
                controller: 'RegistrationController'
            })
            .state('logout', {
                url: '/logout',
                templateUrl: '/static/partials/home.html',
                controller: 'LogoutController'
            })
            .state('home', {
                url: '/',
                templateUrl: '/static/partials/home.html',
                controller: 'HomeController'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: '/static/partials/settings.html',
                controller: 'SettingsController'
            })
            .state('products-detail', {
                url: '/products/:itemId/',
                templateUrl: '/products_ang/show/',
                controller: 'ItemDetailController'
            })
            .state('categories-list', {
                url: '/categories/',
                templateUrl: '/categories_ang/',
                controller: 'CategoryListController'
            })
            .state('shop-list', {
                url: '/shops/',
                templateUrl: '/static/products/partials/shop-list.html',
                controller: 'ShopListController'
            })
            .state('shop-detail', {
                url: '/shops/:id/',
                templateUrl: '/static/products/partials/shop-detail.html',
                controller: 'ShopDetailController'
            })


    });