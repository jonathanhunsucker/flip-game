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
