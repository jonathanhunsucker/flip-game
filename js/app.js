'use strict';

var app = angular.module('flip', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/index.html',
        controller: 'IndexController'
    }).when('/play/:id', {
        templateUrl: 'partials/play.html',
        controller: 'PlayController',
        resolve: {
            'board': function ($route, Boards) {
                var boardId = parseInt($route.current.params.id);
                return Boards.getById(boardId);
            }
        }
    }).when('/levels', {
        templateUrl: 'partials/levels/list.html',
        controller: 'LevelsController'
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

app.directive('board', function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/directives/board.html',
        link: function (scope, element, attrs) {
            attrs.size = attrs.size || 'normal';
            scope.attrs = attrs;
        }
    }
});

app.service('Boards', function ($q, $http) {
    var abstracts = [{
        'id': 0,
        'blueprint': [
            [1, 0],
            [0, 0],
        ],
        'goal': 2,
        'difficulty': 0
    }, {
        'id': 1,
        'blueprint': [
            [1, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        'goal': 4,
        'difficulty': 1
    }, {
        'id': 2,
        'blueprint': [
            [1, 0, 0, -1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        'goal': 4,
        'difficulty': 1
    }, {
        'id': 3,
        'blueprint': [
            [0, 1, 0, 0],
            [0, 0, 0, 0],
            [-1, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        'goal': 4,
        'difficulty': 1
    }, {
        'id': 4,
        'blueprint': [
            [0, 0, 0, 0],
            [0, -1, 0, 0],
            [0, -1, 1, 0],
            [0, 0, 0, 0],
        ],
        'goal': 4,
        'difficulty': 1
    }, {
        'id': 5,
        'blueprint': [
            [0, 0, 0, 0],
            [0, 0, -1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, -1],
        ],
        'goal': 4,
        'difficulty': 1
    }, {
        'id': 6,
        'blueprint': [
            [0, -1, 0, 0],
            [0, 0, 0, 1],
            [0, -1, -1, 0],
            [0, 0, 0, 0],
        ],
        'goal': 4,
        'difficulty': 1
    }, {
        'id': 7,
        'blueprint': [
            [0, -1, 0, 0],
            [0, 0, 1, 0],
            [-1, 0, 0, -1],
            [0, 0, 0, 0],
        ],
        'goal': 4,
        'difficulty': 1
    }, {
        'id': 8,
        'blueprint': [
            [0, 0, 0, 0],
            [0, -1, 0, 0],
            [0, -1, 0, 0],
            [1, 0, 0, 0],
        ],
        'goal': 5,
        'difficulty': 2
    }, {
        'id': 9,
        'blueprint': [
            [0, 0, 0, 0],
            [-1, -1, 0, -1],
            [0, 0, 0, -1],
            [0, 0, 1, 0],
        ],
        'goal': 4,
        'difficulty': 1
    }, {
        'id': 10,
        'blueprint': [
            [-1, 0, -1, 0],
            [1, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, -1, 0],
        ],
        'goal': 5,
        'difficulty': 2
    }, {
        'id': 11,
        'blueprint': [
            [0, 0, 0, 1],
            [0, -1, -1, 0],
            [0, -1, -1, 0],
            [0, 0, 0, 0],
        ],
        'goal': 4,
        'difficulty': 1
    }, {
        'id': 12,
        'blueprint': [
            [0, -1, -1, 0],
            [0, 0, -1, 0],
            [0, 0, -1, 0],
            [0, 0, 0, 1],
        ],
        'goal': 5,
        'difficulty': 2
    }, {
        'id': 13,
        'blueprint': [
            [0, 0, 0, 0],
            [1, 0, -1, 0],
            [0, -1, 0, 0],
            [-1, 0, 0, 0],
        ],
        'goal': 6,
        'difficulty': 2
    }, {
        'id': 14,
        'blueprint': [
            [0, 0, -1, 0],
            [0, -1, -1, 0],
            [0, 0, 0, 0],
            [0, 0, 1, -1],
        ],
        'goal': 5,
        'difficulty': 2
    }, {
        'id': 15,
        'blueprint': [
            [0, 0, 0, 0],
            [0, -1, 0, 0],
            [0, -1, -1, 0],
            [0, 1, 0, 0],
        ],
        'goal': 5,
        'difficulty': 1
    }, {
        'id': 16,
        'blueprint': [
            [0, -1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0],
            [0, 0, -1, 0],
        ],
        'goal': 5,
        'difficulty': 1
    }, {
        'id': 17,
        'blueprint': [
            [0, 0, 0, 0],
            [0, -1, -1, 0],
            [1, 0, 0, 0],
            [0, 0, -1, 0],
        ],
        'goal': 4,
        'difficulty': 1
    }, { 
        'id': 18,
        'blueprint': [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, -1, -1, 0, 0],
            [0, 0, -1, -1, 0, 0],
            [0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0]
        ],
        'goal': 6,
        'difficulty': 2
    }, {
        'id': 19,
        'blueprint': [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, -1, 0, 0],
            [0, 0, 0, -1, 0, 0],
            [0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [-1, 0, 0, -1, 0, -1]
        ],
        'goal': 6,
        'difficulty': 2
    }, { 
        'id': 20,
        'blueprint': [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, -1, 0],
            [0, -1, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [-1, 0, 0, -1, 0, 0],
            [0, 0, 0, 0, 0, -1]
        ],
        'goal': 6,
        'difficulty': 2
    }, { 
        'id': 21,
        'blueprint': [
            [0, 0, 0, 0, 0, -1],
            [0, -1, 0, 0, -1, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, -1, 0, -1, -1, 0]
        ],
        'goal': 7,
        'difficulty': 2
    }, { 
        'id': 22,
        'blueprint': [
            [0, 0, 0, 0, 0, 0],
            [0, -1, 0, 0, 0, 0],
            [0, 0, 1, 0, -1, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, -1, 0],
            [0, -1, 0, 0, 0, 0]
        ],
        'goal': 6,
        'difficulty': 2
    }, { 
        'id': 23,
        'blueprint': [
            [0, 0, -1, 0, 0, 0],
            [0, 1, 0, 0, -1, -1],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [-1, 0, 0, -1, -1, 0],
            [0, 0, 0, 0, 0, 0]
        ],
        'goal': 7,
        'difficulty': 2
    }, { 
        'id': 24,
        'blueprint': [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, -1, 0],
            [0, 0, 0, -1, -1, 0],
            [0, 0, -1, 0, 0, 0],
            [-1, -1, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0]
        ],
        'goal': 6,
        'difficulty': 2
    }, { 
        'id': 25,
        'blueprint': [
            [-1, 0, 0, -1, 0, -1],
            [0, 0, 0, 0, 0, 0],
            [-1, 0, 0, -1, 0, -1],
            [0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, -1, 0]
        ],
        'goal': 6,
        'difficulty': 2
    }, { 
        'id': 26,
        'blueprint': [
            [0, 0, 0, 0, 0, 0],
            [0, 0, -1, -1, 0, 0],
            [-1, 0, 0, 0, 0, -1],
            [-1, 0, 0, 0, 0, -1],
            [0, 0, -1, -1, 0, 0],
            [0, 0, 1, 0, 0, 0]
        ],
        'goal': 6,
        'difficulty': 2
    }, { 
        'id': 27,
        'blueprint': [
            [-1, 0, 0, 0, 0, 0],
            [0, -1, -1, 0, 0, -1],
            [0, 0, 0, 0, 0, -1],
            [0, 0, 0, 0, 0, 0],
            [0, -1, 0, 1, 0, -1],
            [0, 0, 0, 0, 0, 0]
        ],
        'goal': 7,
        'difficulty': 3
    }, { 
        'id': 28,
        'blueprint': [
            [0, 0, 1, 0, 0, 0],
            [0, -1, 0, 0, 0, 0],
            [0, -1, 0, 0, -1, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, -1, 0, 0, 0],
            [0, -1, 0, 0, -1, 0]
        ],
        'goal': 6,
        'difficulty': 3
    }, {
        'id': 29,
        'blueprint': [
            [-1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, -1, 0],
            [0, 0, -1, -1, 0, -1],
            [0, 0, 0, -1, 0, 0],
            [0, 0, 0, 1, -1, 0],
            [0, 0, 0, 0, 0, 0]
        ],
        'goal': 6,
        'difficulty': 3
    }, {  
        'id': 30,
        'blueprint': [
            [0, -1, -1, 0, -1, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [-1, 0, 0, -1, 0, -1],
            [0, 1, 0, 0, 0, 0],
            [0, 0, 0, -1, 0, 0]
        ],
        'goal': 7,
        'difficulty': 3
    }, {
        'id': 31,
        'blueprint': [
            [0, 0, 0, 0, 0, 0],
            [0, -1, 0, 0, -1, -1],
            [0, -1, 0, 0, 0, 0],
            [0, 0, 1, 0, -1, 0],
            [0, -1, 0, 0, -1, 0],
            [0, 0, 0, 0, 0, 0],
        ],
        'goal': 6,
        'difficulty': 3
    }];
    var typeToInt = {
        'beginner':  0,
        'easy':  1,
        'medium':  2,
        'hard':  3,
    };
    function Boards() {}
    Boards.prototype.getA = function (type) {
        var deferred = $q.defer();
        var intDifficultyLevel = typeToInt[type];
        var typedBoards = abstracts.filter(function (abs) {
            return abs.difficulty > intDifficultyLevel;
        });
        var item = typedBoards[parseInt(Math.random()*typedBoards.length)];
        deferred.resolve(new Board(item));
        return deferred.promise;
    }
    Boards.prototype.getLoadingBoard = function () {
        return new Board({
            'blueprint': [
                [0, 0],
                [0, 0]
            ],
            'goal': '?'
        });
    }
    Boards.prototype.getById = function (boardId) {
        var deferred = $q.defer();
        for (var i = 0 ; i < abstracts.length ; i++) {
            var board = abstracts[i];
            if (board.id === boardId) {
                deferred.resolve(new Board(board));
                break;
            }
        }
        return deferred.promise;
    }
    Boards.prototype.getAll = function () {
        var boards = abstracts.map(function (abs) {
            return new Board(abs);
        });
        var deferred = $q.defer();
        deferred.resolve(boards);
        return deferred.promise;
    }
    Boards.prototype.getFirst = function () {
        var board = new Board(abstracts[0]);
        var deferred = $q.defer();
        deferred.resolve(board);
        return deferred.promise;
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


app.controller('IndexController', function ($scope, $location, Boards) {
    Boards.getFirst().then(function (board) {
        $scope.boardId = board.id;
    });
});

app.controller('PlayController', function ($scope, board) {
    $scope.globalState = {
        'touchDownTileIsSelected': false
    };

    $scope.board = board;

    angular.element(document).bind('keydown', function (event) {
        $scope.$apply(function () {
            $scope.board.onKeyEvent(event);
        });
    });
});

app.controller('LevelsCreateController', function ($scope) {
});

app.controller('LevelsController', function ($scope, Boards) {
    $scope.levels = [];

    $scope.difficultyNames = {
        0: 'Beginner',
        1: 'Easy',
        2: 'Medium',
        3: 'Difficult'
    };

    var boards = Boards.getAll().then(function (boards) {
        var levels = [];
        for (var i = 0 ; i < boards.length ; i++) {
            var board = boards[i];
            if (!levels.hasOwnProperty(board.difficulty)) {
                levels[board.difficulty] = [];
            }
            levels[board.difficulty].push(board);
        }

        $scope.levels = levels;
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
