'use strict';

var app = angular.module('flip', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/index.html',
        controller: 'IndexController'
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


var tileAbstractions = {
    'supereasy': {
        'blueprint': [
            [1, 0],
            [0, 0],
        ],
        'goal': 2
    },
    'easy': {
        'blueprint': [
            [1, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        'goal': 4
    },
    'medium': {
        'blueprint': [
            [0, 0, 0, 0, 0, 0],
            [0, -1, 0, 0, -1, -1],
            [0, -1, 0, 0, 0, 0],
            [0, 0, 1, 0, -1, 0],
            [0, -1, 0, 0, -1, 0],
            [0, 0, 0, 0, 0, 0],
        ],
        'goal': 6
    },
    'hard': {
        'blueprint': [
            [-1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, -1, 0],
            [0, 0, -1, -1, 0, -1],
            [0, 0, 0, -1, 0, 0],
            [0, 0, 0, 1, -1, 0],
            [0, 0, 0, 0, 0, 0]
        ],
        'goal': 6
    }
};

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
            'url': '/about',
            'title': 'About'
        }]
    };
});

app.controller('IndexController', function ($scope) {
    var board = new Board(tileAbstractions.medium);
    $scope.globalState = {
        'touchDownTileIsSelected': false
    };
    $scope.board = board;
    angular.element(document).bind('keydown', function (event) {
        $scope.$apply(function () {
            board.onKeyEvent(event);
        });
    });
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
