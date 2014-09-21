'use strict';

var app = angular.module('flip', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/index.html',
        controller: 'IndexController'
    }).when('/levels/create', {
        templateUrl: 'partials/levels/create.html',
        controller: 'LevelsCreateController'
    });
});

app.directive('flClickdrag', function () {
    var mouseIsDown = false;
    angular.element(document).bind('mouseup', function () {
        mouseIsDown = false;
    });
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var mouseHasLeft = 'false';
            element.bind('mousedown', function () {
                callAttrib();
                mouseIsDown = true;
            });
            element.bind('mouseenter', function () {
                if (mouseIsDown) {
                    callAttrib();
                }
            });
            element.bind('mouseexit', function () {
                mouseIsDown = false;
            });
            function callAttrib() {
                scope.$apply(attrs.flClickdrag);
            }
        }
    };
});

app.service('Boards', function ($q, $http) {
    var abstracts = {
        'beginner': [{
            'blueprint': [
                [1, 0],
                [0, 0],
            ],
            'goal': 2
        }],
        'easy': [{
            'blueprint': [
                [1, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            'goal': 4
        }, {
            'blueprint': [
                [0, -1, 0, 0],
                [0, 0, 1, 0],
                [-1, 0, 0, -1],
                [0, 0, 0, 0],
            ],
            'goal': 4
        }, {
            'blueprint': [
                [1, 0, 0, 0],
                [0, 0, 0, 0],
                [-1, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            'goal': 4
        }, {
            'blueprint': [
                [1, 0, 0, 0],
                [0, 0, -1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            'goal': 4
        }],
        'medium': [{
            'blueprint': [
                [0, 0, 0, 0, 0, 0],
                [0, -1, 0, 0, -1, -1],
                [0, -1, 0, 0, 0, 0],
                [0, 0, 1, 0, -1, 0],
                [0, -1, 0, 0, -1, 0],
                [0, 0, 0, 0, 0, 0],
            ],
            'goal': 6
        }, {
            'blueprint': [
                [1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
            ],
            'goal': 6
        }],
        'hard': [{
            'blueprint': [
                [-1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, -1, 0],
                [0, 0, -1, -1, 0, -1],
                [0, 0, 0, -1, 0, 0],
                [0, 0, 0, 1, -1, 0],
                [0, 0, 0, 0, 0, 0]
            ],
            'goal': 6
        }],
        'loading': [{
            'blueprint': [
                [0, 0],
                [0, 0]
            ],
            'goal': '?'
        }]
    };
    function Boards() {}
    Boards.prototype.getA = function (type) {
        var deferred = $q.defer();
        var options = abstracts[type];
        var item = options[parseInt(Math.random()*options.length)];
        deferred.resolve(new Board(item));
        return deferred.promise;
    }
    Boards.prototype.getLoadingBoard = function () {
        return new Board(abstracts['loading'][0]);
    }
    return new Boards();
});

app.controller('HeaderController', function ($scope) {
    $scope.navigation = {
        'open': false,
        'pages': [{
            'url': '/',
            'title': 'Game'
        }, {
            'url': '/levels',
            'title': 'Levels'
        }, {
            'url': '/levels/create',
            'title': 'Create Levels'
        }, {
            'url': '/about',
            'title': 'About'
        }]
    };
});

app.controller('IndexController', function ($scope, Boards) {
    $scope.globalState = {
        'touchDownTileIsSelected': false
    };

    setBoard(Boards.getLoadingBoard());

    Boards.getA('medium').then(function (board) {
        setBoard(board);
    });

    angular.element(document).bind('keydown', function (event) {
        $scope.$apply(function () {
            $scope.board.onKeyEvent(event);
        });
    });

    function setBoard(board) {
        $scope.boardIsLoading = false;
        $scope.board = board;
    }
});

app.controller('LevelsCreateController', function ($scope) {
});

/*
// for testing the board without having to click through the ui
var a = new Board(tileAbstractions.easy);
a.select(0, 0);
console.log(a.toString());
a.flip('down');
console.log(a.toString());
a.select(0,0);
a.select(0,1);
console.log(a.toString());
a.flip('right');
console.log(a.toString());
a.select(0,1);
a.select(1,0);
a.select(1,1);
console.log(a.toString());
a.flip('right');
console.log(a.toString());
a.flip('down');
console.log(a.toString());
a.undo();
console.log(a.toString());
a.select(0,0);
a.select(1,0);
console.log(a.toString());
a.flip('right');
console.log(a.toString());
*/
