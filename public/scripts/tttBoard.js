//Board Object
var Board = function(parentBoard, allMovesMade, lastMove, whoseTurn) {
    this.parentBoard = parentBoard;
    this.allMovesMade = allMovesMade;
    this.lastMove = lastMove;
    this.whoseTurn = whoseTurn;
    this.possibleMoves = this.findPossibleMoves();
    this.nextBoards = [];
    this.isHome = false;
    this.record = {
        win: 0.0000,
        loss: 0.0000,
        sims: 0.0000
    };
}

Board.prototype.findPossibleMoves = function(){
    var possibleMoves = [];
    for (var i = 0; i < this.allMovesMade.length; i++){
        for (var j = 0; j < this.allMovesMade.length; j++){
            if (this.allMovesMade[i][j] == 0){
               possibleMoves.push([i, j]); 
            };
        }
    }
    return possibleMoves;
}

Board.prototype.createBoard = function(movesMade, move){
    var newMovesMade = copyArray((movesMade));
    newMovesMade[move[0]][move[1]] = this.whoseTurn * -1;
    var nextBoard = new Board(this, newMovesMade, move, this.whoseTurn * -1);
    return nextBoard;
}

Board.prototype.createNextBoards = function(){
    for (var i = 0; i < this.possibleMoves.length; i ++){
        this.nextBoards.push(this.createBoard(this.allMovesMade, this.possibleMoves[i]));
    }
}

function emptyBoard(rows, cols) {
    var emptyBoard = [], 
        row = [];
    while (cols--) row.push(0);
    while (rows--) emptyBoard.push(row.slice());
    return emptyBoard;
}

function copyArray(oldArray){
    var newArray = emptyBoard(oldArray.length, oldArray.length);
    for (var i = 0; i < oldArray.length; i++){
        for (var j = 0; j < oldArray.length; j++){
            newArray[i][j] = oldArray[i][j];
        }
    }
    return newArray;
}

module.exports = Board;