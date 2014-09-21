'use strict';


var app = angular.module('flip', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/index.html',
        controller: 'IndexController'
    });
});
app.directive('flClickdrag', function () {
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
var mouseIsDown = false;
angular.element(document).bind('mouseup', function () {
    mouseIsDown = false;
});

function Tile(board, x, y, stateChar) {
    this.board = board;
    this.x = x || 0;
    this.y = y || 0;
    this.state = this.getStateFromChar(stateChar) || 'empty';
    this.isSelected = false;
}
Tile.prototype.getStateFromChar = function (stateChar) {
    if (stateChar == 0) return 'empty';
    if (stateChar == 1) return 'filled';
    if (stateChar == -1) return 'negative';
}
Tile.prototype.getStateChar = function () {
    if (this.state == 'empty') return 0;
    if (this.state == 'filled') return 1;
    if (this.state == 'negative') return -1;
}
Tile.prototype.fill = function () {
    this.state = 'filled';
}
Tile.prototype.select = function () {
    if (this.state == 'filled') {
        var board = this.board;
        if (board.getSelectedTiles().length == 0) {
            this.isSelected = true;
        } else {
            var x = this.x;
            var y = this.y;

            var adjacentSelected = 0;
            if (x > 0 && board.grid[y][x-1].isSelected) {
                adjacentSelected++;
            }
            if (y > 0 && board.grid[y-1][x].isSelected) {
                adjacentSelected++;
            }
            if (x < board.size-1 && board.grid[y][x+1].isSelected) {
                adjacentSelected++;
            }
            if (y < board.size-1 && board.grid[y+1][x].isSelected) {
                adjacentSelected++;
            }

            if (adjacentSelected >= 1) {
                this.isSelected = true;
            }
        }
    }
}
Tile.prototype.unselect = function () {
    if (this.state == 'filled') {
        this.isSelected = false;
    }
}
Tile.prototype.isEmpty = function () {
    return this.state == 'empty';
}
Tile.prototype.toggleSelected = function () {
    if (this.state == 'filled') {
        if (this.isSelected) {
            this.unselect();
        } else {
            this.select();
        }
    }
}
Tile.prototype.toString = function () {
    if (this.isSelected) return 'ʘ';
    if (this.state == 'empty') return '-';
    if (this.state == 'filled') return '•';
    if (this.state == 'negative') return 'X';
}

function Board(tileAbstraction) {
    if (!tileAbstraction) {
        throw new Error('asdf');
    }
    this.directions = ['down', 'up', 'right', 'left'];
    this.tiles = this.generateTiles(tileAbstraction.blueprint);
    this.size = tileAbstraction.blueprint.length;
    this.turns = 0;
    this.goal = tileAbstraction.goal;
    this.history = new Array(); //stack
    this.grid = new Array(this.size);
    for (var i = 0 ; i < this.grid.length ; i++) {
        this.grid[i] = new Array(this.grid.length);
    }
    for (var i = 0 ; i < this.tiles.length ; i++) {
        var tile = this.tiles[i];
        this.grid[tile.y][tile.x] = tile;
    }
}
Board.prototype.generateTiles = function (tiles) {
    var clonedTiles = new Array();
    for (var j = 0 ; j < tiles.length ; j++) {
        var row = tiles[j];
        for (var i = 0 ; i < row.length ; i++) {
            var stateChar = row[i];
            clonedTiles.push(new Tile(this, i, j, stateChar));
        }
    }
    return clonedTiles;
}
Board.prototype.getSelectedTiles = function () {
    var selectedTiles = [];
    for (var i = 0 ; i < this.tiles.length ; i++) {
        var tile = this.tiles[i];
        if (tile.isSelected) {
            selectedTiles.push(tile);
        }
    }
    return selectedTiles;
}
Board.prototype.findTile = function (x, y) {
    var tile = this.isWithinBounds(x, y) ? this.grid[y][x] : null;
    return tile;
}
Board.prototype.directionIsValid = function (direction) {
    return this.directions.indexOf(direction) < 0;
}
Board.prototype.isWithinBounds = function (x, y) {
    return x >= 0 && x < this.size &&
           y >= 0 && y < this.size;
}
Board.prototype.getBoundsForTiles = function (tiles) {
    var xMinTile = tiles[0], xMaxTile = tiles[0], yMinTile = tiles[0], yMaxTile = tiles[0];
    for (var i = 0 ; i < tiles.length ; i++) {
        var current = tiles[i];
        xMinTile = current.x < xMinTile.x ? current : xMinTile;
        xMaxTile = current.x > xMaxTile.x ? current : xMaxTile;
        yMinTile = current.y < yMinTile.y ? current : yMinTile;
        yMaxTile = current.y > yMaxTile.y ? current : yMaxTile;
    }
    var bounds = {
        'xMin': Math.min(this.size, xMinTile.x),
        'xMax': Math.max(0, xMaxTile.x),
        'yMin': Math.min(this.size, yMinTile.y),
        'yMax': Math.max(0, yMaxTile.y),
    };
    return bounds;
}
Board.prototype.flip = function (direction) {
    if (this.directionIsValid(direction)) {
        console.log('direction is folgered');
        return false;
    }

    var selectedTiles = this.getSelectedTiles();
    if (selectedTiles.length == 0) {
        console.log('no selected tiles, ain\'t flippin\' jack squint');
        return false;
    }

    var bounds = this.getBoundsForTiles(selectedTiles);

    var tilesBeforeFlip = this.cloneTiles(this.tiles);
    var tilesThatShouldBeFilled = [];
    for (var i = 0 ; i < selectedTiles.length ; i++) {
        var tile = selectedTiles[i];
        var x = tile.x, y = tile.y;
        if (direction == 'down') y = bounds.yMax + ((bounds.yMax - tile.y) + 1);
        if (direction == 'up') y = bounds.yMin - ((tile.y - bounds.yMin) + 1);
        if (direction == 'right') x = bounds.xMax + ((bounds.xMax - tile.x) + 1);
        if (direction == 'left') x = bounds.xMin - ((tile.x - bounds.xMin) + 1);

        // validate x and y bounds
        if (!this.isWithinBounds(x, y)) {
            console.log('dying for tile for bounds');
            return false;
        }

        // validate landing box
        var thisSillyTile = this.findTile(x, y);
        if (!thisSillyTile || !thisSillyTile.isEmpty()) {
            console.log('dying for dead tile flip');
            return false;
        }

        tilesThatShouldBeFilled.push(thisSillyTile);
    }

    if (selectedTiles.length > 1) {
        var blobSize = 0;
        var queue = new Array();
        var visited = new Array();
        queue.push(selectedTiles[0]);
        visited.push(selectedTiles[0]);

        while (queue.length > 0) {
            var tile = queue.shift();
            var x = tile.x;
            var y = tile.y;

            if (x > 0 && this.grid[y][x-1].isSelected) {
                var newTile = this.grid[y][x-1];
                if (visited.indexOf(newTile) == -1) {
                    queue.push(newTile);
                }
            }
            if (y > 0 && this.grid[y-1][x].isSelected) {
                var newTile = this.grid[y-1][x];
                if (visited.indexOf(newTile) == -1) {
                    queue.push(newTile);
                }
            }
            if (x < this.size-1 && this.grid[y][x+1].isSelected) {
                var newTile = this.grid[y][x+1];
                if (visited.indexOf(newTile) == -1) {
                    queue.push(newTile);
                }
            }
            if (y < this.size-1 && this.grid[y+1][x].isSelected) {
                var newTile = this.grid[y+1][x];
                if (visited.indexOf(newTile) == -1) {
                    queue.push(newTile);
                }
            }

            visited.push(tile);
            blobSize++;
        }
        if (blobSize < selectedTiles.length) {
            console.log('disjoint group. cannot flip.');
            return false;
        }
    }

    for (var i = 0 ; i < selectedTiles.length ; i++) {
        var selected = selectedTiles[i];
        selected.unselect();
    }

    for (var i = 0 ; i < tilesThatShouldBeFilled.length ; i++) {
        var thisSillyTile = tilesThatShouldBeFilled[i];
        thisSillyTile.fill();
    }

    this.turns++;
    this.addHistory(tilesBeforeFlip);
    return true;
}
Board.prototype.cloneTiles = function( tiles ) {
    var clonedTiles = [];
    for (var i = 0 ; i < this.tiles.length ; i++) {
        var tile = this.tiles[i];
        clonedTiles.push(new Tile(this, tile.x, tile.y, tile.getStateChar()));
    }
    return clonedTiles;
}
// make sure deep copy from current board
Board.prototype.addHistory = function( tiles ) {
    this.history.push(tiles);
}
Board.prototype.undo = function() {
    if (this.history.length == 0) {
        return;
    }
    this.tiles = this.history.pop();
    this.grid = new Array(this.size);
    for (var i = 0 ; i < this.grid.length ; i++) {
        this.grid[i] = new Array(this.grid.length);
    }
    for (var i = 0 ; i < this.tiles.length ; i++) {
        var tile = this.tiles[i];
        this.grid[tile.y][tile.x] = tile;
    }
    this.turns--;
}
Board.prototype.restart = function() {
    while (this.history.length > 0) {
        this.undo();
    }
}
Board.prototype.select = function (x, y) {
    var tile = this.findTile(x, y);
    tile.select();
}
Board.prototype.toString = function () {
    var str = '\n';
    for (var i = 0 ; i < this.size ; i++) {
        for (var j = 0 ; j < this.size ; j++) {
            var tile = this.findTile(j, i);
            str += tile.toString();
        }
        str += "\n";
    }
    str += "turns: " + this.turns + "\n";
    return str;
}

var tileAbstractions = {
    'supereasy': {
        'blueprint': [
            [1, 0],
            [0, 0],
        ],
        'goal': 5
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
            [1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
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

app.controller('IndexController', function ($scope) {
    var board = new Board(tileAbstractions.hard);
    $scope.globalState = {
        'touchDownTileIsSelected': false
    };
    $scope.board = board;
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
