/**
 * Created by user on 05.10.15.
 */

angular
    .module('myApp')
    .controller('HomeController', HomeController);

function HomeController($scope, $timeout, AuthUser) {
    $scope.user = AuthUser; // Auth user object
    $scope.startPageLoad = false;

    $scope.delay = $timeout(function () {

        $scope.startPageLoad = true;

    }, 400);

    /* alert on eventClick */
    $scope.alertOnEventClick = function(date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };

    $scope.isUserAuth = function () {
        return $scope.user.id;
    };
     /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };

    $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
    };
}


angular
    .module('myApp')
    .controller('ItemController', ItemController);

function ItemController($scope, $http, Item, Category, Cart, Flash) {

    // sort init
    $scope.sortField = '-pk';
    $scope.reverse = true;
    $scope.showTriangle = false;

    //rating
    $scope.maxx = 10;
    $scope.isReadonly = false;

    //filter init
    $scope.search = { categories:undefined };

    $scope.showDetailOfItem = false;
    $scope.isCollapsed = true;
    $scope.itemLoad = false;

    //quantity of item
    $scope.minQuantityOfItem = 10;
    $scope.zeroQuantityOfItem = 0;

    //messages
    $scope.addItemToCartMessageSuccess = 'Item added to cart';
    $scope.deleteItemFromCartMessageSuccess = 'Item deleted from cart';

    /**
     * Get list of items and list of categories
     */
    $scope.items = Item.query(function () {

        $scope.itemLoad = true;

        $scope.categories = Category.query(function () {

            $scope.categoryLoad = true;

        }, function () {
            $scope.categoryLoadError = true;
        });


    }, function () {
        $scope.itemLoadError = true;
    });


    /**
     * Show item detail
     */
    $scope.showItem = function () {
        $scope.showDetailOfItem = true;

    };

    /**
     * Filter items by category
     */
    $scope.sortByCategory = function (name) {

        $scope.items = Item.query(
            params = {category: name}
        );

    };

    /**
     * Show all items
     */

    $scope.showAllItems = function () {

        $scope.items = Item.query();

    };

    /**
     * Pagination
     */

    $scope.pagination = function (page) {

        $http.get(page, {cache: true}).success(function (data) {

            $scope.items = data;

        });

    };

    /**
     * For sorting by price
     */
    $scope.changeSortState = function (status) {
        $scope.sortField = status;
        $scope.reverse = !$scope.reverse;
        $scope.showTriangle = !$scope.showTriangle;
    };

    /**
     * Function for check if previous page exists
     */
    $scope.isItemsNotPrevious = function (items) {

        return !items.previous;

    };

    /**
     * Function for check if next page exists
     * @return {boolean}
     */
    $scope.IsItemsNotNext = function (items) {

        return !items.next;
    };


    /**
     * Add item to cart and query Item object
     */
    $scope.addItemToCart = function (itemId) {

        $scope.cart = new Cart();
        $scope.cart.item = itemId;

        $scope.cart.$save(function () {

            $scope.items = Item.query();
            $scope.itemInCartSuccess = true;
            Flash.create('success', $scope.addItemToCartMessageSuccess, 'flash-message-item-list');


        }, function (error) {

            $scope.itemInCartError = error.data.detail;
            Flash.create('warning', $scope.itemInCartError, 'flash-message-item-list');

        });

    };


    /**
     * Delete item form cart and query Item object
     */
    $scope.deleteItemInCart = function (itemId) {

        Cart.delete({id: itemId}, function () {

            $scope.items = Item.query();
            Flash.create('info', $scope.deleteItemFromCartMessageSuccess, 'flash-message-item-list');

        });
    };

    $scope.isQuantityOfItemIsZero = function(item){

        return angular.equals($scope.zeroQuantityOfItem, item.quantity);
    };

    $scope.aside = {
        "title": "Categories"
    };

}

angular
    .module('myApp')
    .controller('ItemDetailController', ItemDetailController);

function ItemDetailController($scope, $location, Item, Rate, AuthUser, Comment, Flash, $anchorScroll, $stateParams) {

    // Init
    $scope.id = $stateParams.itemId; // item id
    $scope.AuthUserUsername = AuthUser.username; // Auth user username
    $scope.showDetailOfItem = true;
    $scope.itemDetailLoad = false;

    //message after rate item
    $scope.greet = false;

    //progressbar
    $scope.maxx = 100;
    $scope.dynamic = 0;

    //pagination for comments
    $scope.pageSize = 4;
    $scope.currentPage = 1;

    //rating
    $scope.max = 10;
    $scope.isReadonly = false;
    $scope.itemDetailLoadError = false;
    $scope.successMessageEditItem = 'Item edit successfuly!<strong> Click</strong> to item page.';
    $scope.successMessageAddComment = 'Thanks for comment!';


    //add pre-comment model
    $scope.comment = {
        username:'Ivan',
        message:'Hello world!',
        item: $stateParams.itemId
    };


    /**
     * Get item detail
     */
    $scope.itemDetail = Item.get({id: $stateParams.itemId}, function (response) {

        $scope.itemDetailLoad = true;
        $scope.itemDetailComments = response.comments;


        /**
         * Add rate model
         */
        $scope.rate = {
            value: $scope.itemDetail.rates,
            item: $stateParams.itemId
        };

    }, function (error) {

        $scope.itemDetailLoadError = error.data.detail;
    });


    /**
     * Add rate model
     */
     $scope.rate = {
        value: $scope.itemDetail.user_rate,
        item: $stateParams.itemId
    };

    /**
     * For hovering rating stars
     */
    $scope.hoveringOver = function (value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };

    /**
     * Post selected rating of item by user
     */
    $scope.addRate = function () {

        $scope.rateObject = new Rate($scope.rate);

        $scope.rateObject.$save(function () {

            $scope.greet = true;
            $scope.dynamic = 100;

        }, function (error) {
            $scope.rateError = error.data.detail;

            Flash.create('warning', $scope.rateError, 'flash-message-item-list');
        });

    };

    /**
     * Edit item
     */
    $scope.editItem = function () {

        $scope.itemDetail.$update(function (response) {
            $scope.successAction();
             $scope.itemDetail = response;

        }, function (error) {
            $scope.errorEditItem = error.data.detail;

            Flash.create('danger', $scope.errorEditItem, 'flash-message-item-list');
        });

    };

    /**
     * Delete item
     */
    $scope.deleteItem = function () {

        bootbox.confirm('Are you sure you want to delete this item?', function (answer) {

            if (answer === true)

                $scope.itemDetail.$delete(function () {

                    $scope.showDetailOfItem = false;
                    $location.path('/products');

                }, function (error) {
                    $scope.errorDeleteItem = error;
                });

        });

    };

    /**
     * Function for success edit item
     */
    $scope.successAction = function () {

        Flash.create('flash-message-edit-item', $scope.successMessageEditItem, 'flash-message-edit-item');

        $scope.editItemSuccess = true;

    };

    /**
     * Check is Auth user is owner of this item
     */
    $scope.isAuthUserIsOwner = function () {

        return $scope.AuthUserUsername === $scope.itemDetail.user;

    };


    /**
     * Add comment
     */
    $scope.addComment = function () {

        $scope.commentObject = new Comment($scope.comment);

        $scope.commentObject.$save(function (data) {

            $scope.hideCommentForm = true;
            $scope.appendComment = data;
            $scope.errorComment = false;
            Flash.create('success', $scope.successMessageAddComment, 'flash-message-edit-item');

        }, function (error) {

            $scope.errorComment = error;
        });

    };

    /**
     * Scroll to add comments form
     */
    $scope.scrollTo = function (id) {
        var old = $location.hash();
        $location.hash(id);
        $anchorScroll();
        //reset to old to keep any additional routing logic from kicking in
        $location.hash(old);
    };

     /**
     * Return true if comments exists and number of comments bigger then pagesize
     */
    $scope.isCommentsLengthBiggerThenPagesize = function () {

        return $scope.itemDetailComments.length > $scope.pageSize;
    };
}

angular
    .module('myApp')
    .controller('CategoryListController', CategoryListController);

function CategoryListController($scope, Category, Flash) {


    /**
     * Get category list
     */
    $scope.categories = Category.query(function () {

        $scope.categoryLoad = true;

    }, function (error) {
        $scope.categoryLoadError = error.data.detail;
        Flash.create('warning', $scope.categoryLoadError, 'flash-message-item-list');
    });

}

angular
    .module('myApp')
    .controller('CartCtrl', CartCtrl);

function CartCtrl($scope, $timeout, Cart) {

    var vm = this;
    vm.deleteItemInCart = deleteItemInCart;
    vm.addItemToCart = addItemToCart;
    vm.chooseItem = chooseItem;
    vm.toggleAll = toggleAll;
    vm.chooseAll = chooseAll;
    vm.chooseNothing = chooseNothing;
    vm.makeOrder = makeOrder;


    /**
     * Add item to cart
     */
    function addItemToCart(itemId) {

        $scope.cart = new Cart();
        $scope.cart.item = itemId;

        $scope.cart.$save(function () {
            $scope.itemInTheCart = true;
        });

    }


    /**
     * Delete item form cart and query Item object
     */
    function deleteItemInCart(itemId) {

        bootbox.confirm('Are you sure you want to delete this item from the cart?', function (answer) {

            if (answer === true)

                Cart.delete({id: itemId}, function () {

                    var myEl = angular.element(document.querySelector('#item_' + itemId));
                    myEl.addClass('animated fadeOut');

                    $scope.time = $timeout(function () {

                        myEl.addClass('hidden');

                    }, 800);

                });

        });

    }

    /**
     * Choose specific item in the cart
     */

    function chooseItem(itemId) {

        var myEl = angular.element(document.querySelector('#item_' + itemId));
        myEl.toggleClass('panel-primary-active');

    }

    /**
     * Choose all items with button
     */
    function toggleAll() {

        $scope.allItemActive = !$scope.allItemActive;

    }

    /**
     * Choose all items with click 'All"
     */
    function chooseAll() {

        $scope.allItemActive = true;

    }

    /**
     * Unchoose all items
     */
    function chooseNothing() {

        $scope.allItemActive = false;

    }

    /**
     * Show alert after making order
     */
    function makeOrder() {

        bootbox.alert('You make order! Soon we call you!');

    }

}

angular
    .module('myApp')
    .controller('ActionCtrl', ActionCtrl);

function ActionCtrl($scope, $routeParams, $location, Action, AuthUser, Flash) {

    $scope.itemId = $routeParams.itemId;
    $scope.AuthUserUsername = AuthUser.username; // Auth user id

    // messages
    $scope.addActionSuccessMesage = 'Action modify!';

    /**
     * Get action for this item
     */

    $scope.action = Action.get({item_id: $routeParams.itemId}, function (data) {

        $scope.action = data;
        $scope.action.period_from = new Date($scope.action.period_from);
        $scope.action.period_to = new Date($scope.action.period_to);



    }, function (error) {

        $scope.actionError = error;

        /**
         *
         * Check if action for current item exists
         */
        $scope.doesActionNotExists = function () {

            return angular.equals($scope.actionError.status, 404);

        };

        /**
         * Check is permission denied
         */
        $scope.isPermissionDenied = function () {

            return angular.equals($scope.actionError.status, 403);
        };
    });


    /**
     * Add action
     */
    $scope.addAction = function () {

        $scope.actionObject = new Action({
            description: $scope.action.description,
            new_price: $scope.action.new_price,
            item: $scope.itemId,
            period_from: moment($scope.action.period_from).format('YYYY-MM-DD'),
            period_to: moment($scope.action.period_to).format('YYYY-MM-DD')
        });

        $scope.actionObject.$save(function () {

            Flash.create('success', $scope.addActionSuccessMesage, 'flash-message-item-list');
            $location.path('products/'+ $scope.itemId);

        }, function (error) {

            $scope.errorAddAction = error;
        });

    };

    $scope.deleteAction = function () {

        bootbox.confirm('Are you sure you want to delete this action?', function (answer) {

            if (answer === true)

                Action.delete({item_id: $routeParams.itemId}, function () {

                    $location.path('products/'+ $scope.itemId);

                });

        });

    };

}

angular
    .module('myApp')
    .controller('ShopListController', ShopListController);

function ShopListController($scope, AuthUser, Shop) {
    $scope.user = AuthUser; // Auth user

    /**
     * Get list of shops
     */
    $scope.shops = Shop.query(function () {

        $scope.shopsLoad = true;

    }, function () {
        $scope.shopsLoadError = true;
    });
}

angular
    .module('myApp')
    .controller('ShopDetailController', ShopDetailController);

function ShopDetailController($scope, AuthUser, Shop, $stateParams) {

    $scope.user = AuthUser; // Auth user

    /**
     * Get shop detail
     */
    $scope.shopDetail = Shop.get({id: $stateParams.id}, function () {

        $scope.shopDetailLoad = true;

    }, function (error) {

        $scope.shopDetailLoadError = error.data.detail;
    });
}

angular
    .module('myApp')
    .controller('LoginCtrl', LoginCtrl);

function LoginCtrl($scope, $http, $location, $window, Flash, djangoAuth) {
    /*
    $scope.page = '/rest-auth/login/';
    $scope.errorLoginMessage = 'Incorrect username or password.';

    $scope.user = {
        username : undefined,
        password: undefined
    };

    $scope.sendLoginData = function () {

        $http.post($scope.page, $scope.user).success(function () {

            //$location.path('/');
            $window.location.href = '/';

        }).error(function (error) {

            $scope.sendLoginDataError = error;
            Flash.create('danger', $scope.errorLoginMessage, 'flash-message');
        });
    };

    */

    $scope.errorLoginMessage = 'Incorrect username or password.';

    $scope.user = {
        username : undefined,
        password: undefined
    };

    $scope.sendLoginData = function () {
        djangoAuth.login($scope.user.username, $scope.user.password)
            .then(function(data){
                // success case
                $window.location.href = '/'
            },function(error){
                // error case
                $scope.sendLoginDataError = error;
                Flash.create('danger', $scope.errorLoginMessage, 'flash-message');
            });
    };

}

angular
    .module('myApp')
    .controller('LogoutController', LogoutController);

function LogoutController(djangoAuth,$window) {

    djangoAuth.logout();
    $window.location.href = '/';
}

angular
    .module('myApp')
    .controller('RegistrationController', RegistrationController);

function RegistrationController($scope, $http, $location, $window, Flash, djangoAuth) {

    $scope.page = '/rest-auth/registration/';
    $scope.errorRegisterMessage = 'Incorrect username or password.';

    $scope.user = {
        username : undefined,
        password1: undefined,
        password2: undefined,
        email: undefined
    };


    $scope.sendRegisterData = function () {

        $http.post($scope.page, $scope.user).success(function () {

            //$location.path('/');
            //$window.location.href = '/';

        }).error(function (error) {

            $scope.sendRegisterDataError = error;
            Flash.create('danger', $scope.errorRegisterMessage, 'flash-message');
        });
    };


/*
    $scope.sendRegisterData = function () {
        djangoAuth.register($scope.user.username,$scope.user.password1,$scope.user.password2,$scope.user.email)
            .then(function(data){
                // success case
                $scope.complete = true;
            },function(data){
                // error case
                $scope.errors = data;
                Flash.create('danger', $scope.errors, 'flash-message');
            });
    };
*/
}


angular
    .module('myApp')
    .controller('SettingsController', SettingsController);

function SettingsController($scope, $http, $location, $window, Flash) {

    $scope.page = '/rest-auth/user/';
    $scope.successEditSettingsMessage = 'Settings edit successfully!';

    $http.get($scope.page).success(function (response) {

        $scope.authUserData = response;

    }).error(function (error) {

        Flash.create('danger', error, 'flash-message');
    });

    $scope.editSettings = function(){


        $http.put($scope.page, $scope.authUserData).success(function (response) {

            Flash.create('success', $scope.successEditSettingsMessage, 'flash-message');

        }).error(function (error) {

            Flash.create('danger', error, 'flash-message');
        });

    };

}

/**
 * Directive for formatting date from datepicker Angular UI( add action form )
 */
angular
    .module('myApp')
    .directive('myDate', function (dateFilter, $parse) {
        return {
            restrict: 'EAC',
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel, ctrl) {
                ngModel.$parsers.push(function (viewValue) {
                    return dateFilter(viewValue, 'yyyy-MM-dd');
                });
            }
        }
    });

/**
 * Filter for pagination comments
 */
angular
    .module('myApp')
    .filter('startFrom', function () {
        return function (data, start) {
            if (angular.isDefined(data)) {
                return data.slice(start)
            }
        }
    });