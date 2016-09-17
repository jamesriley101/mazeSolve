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
    newMovesMade[move[0]][move[1]] = this.whoseTurn;
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

//CONFIG
/* global $ */
var currentBoard = setup("three");

//EVENT LISTENERS
function configEvents(){
    $(".btn-md").on("click", function() {
        setup($(this).attr("Id").slice(0, -6));
    });
    
    $(".square").on("click", function(){
        if($(this).text() == ""){
            $(this).text("X");
            var that = this;
            window.setTimeout(function(){
                currentBoard = makePlayerMove($(that).attr("id"), currentBoard);
                currentBoard = makeComputerMove(currentBoard);
            }, 1)
        }
    })
}

//Sub-routines:
function makePlayerMove(squareId, currentBoard){
    var coordinates = getCoordinatesFromId(squareId);
    currentBoard.nextBoards.forEach(function(nextBoard){
        if (String(nextBoard.lastMove) == String(coordinates)){
            currentBoard = nextBoard;
        }
    })
    checkForWinner(currentBoard);
    return currentBoard;
}

function makeComputerMove(currentBoard){
    var nextBoard = chooseBestMove(currentBoard);
    if(nextBoard){
        $("#" + $(".btn-md.buttonOrange").attr("id").slice(0, -6) + "_" + nextBoard.lastMove[0] + "_" + nextBoard.lastMove[1]).text("O");
        checkForWinner(nextBoard);
    }
    return nextBoard;
}

function chooseBestMove(currentBoard){
    simForTime(currentBoard);
    var bestScore = -1000000;
    var bestMove = null;
    console.log(currentBoard.nextBoards);
    currentBoard.nextBoards.forEach(function(nextBoard){
        var moveScore = (nextBoard.record["win"] - nextBoard.record["loss"] * 10) / nextBoard.record["sims"];
        if (moveScore > bestScore){
            bestScore = moveScore;
            bestMove = nextBoard;
        }
    })
    console.log(bestMove);
    return bestMove;
}
 
function simForTime(currentBoard){
    var startTime = Date.now();
    $("#gameResult span").text("...");
    while (Date.now() < startTime + 1000){
        simOneGame(currentBoard);
    }
    $("#gameResult span").text("Your move...");
}

//////////////////////////////////////////////////////////////////

function simOneGame(currentBoard){
    currentBoard.isHome = true;
    var lim = 0;
    while(checkBoard(currentBoard) == "ongoing" && lim < 3000){
        if (currentBoard.nextBoards.length == 0){
            currentBoard.createNextBoards();
        }
        //
        var threat = scanForThreats(currentBoard);
        // if (threat != null){
        //     var move = defendFromThreat(currentBoard.possibleMoves, threat, currentBoard.allMovesMade.length);
        //     currentBoard.nextBoards.forEach(function(board){
        //         if (board.allMovesMade[move[0]][move[1]] == currentBoard.whoseTurn){
        //             // console.log(currentBoard);
        //             console.log(threat);
        //             // console.log(move);
        //             currentBoard = board;
        //             // console.log(currentBoard);
        //         }
        //     })
        // } else {
            currentBoard = currentBoard.nextBoards[Math.floor(Math.random() * currentBoard.nextBoards.length)];
        // }
        lim++;
        console.log(currentBoard);
    }
    //
    var simOutcome = checkBoard(currentBoard);
    
    var gameLength = 1;
    while(!(currentBoard.isHome)){
        currentBoard.record["sims"]++;
        if (simOutcome == "win" || simOutcome == "loss"){
            currentBoard.record[simOutcome] += 1.0000/Math.pow(1, 1);
        }
        gameLength++;
        currentBoard = currentBoard.parentBoard;
    }
    currentBoard.isHome = false;
}

//////

function defendFromThreat(possibleMoves, threat, boardDim){
    var result = null;
    if (threat[0] == "diag1"){
        possibleMoves.forEach(function(thisMove){
            if (thisMove[0] == thisMove[1]){
                result = thisMove;
            }
        })
    }
    else if (threat[0] == "diag2"){
        possibleMoves.forEach(function(thisMove){
            if (thisMove[0] + thisMove[1] == boardDim - 1){
                result = thisMove;
            }
        })
    }
    else if (threat[0] == "row"){
        possibleMoves.forEach(function(thisMove){
            if (thisMove[0] == Number(threat[1])){
                result = thisMove;
            }
        })
    }
    else if (threat[0] == "col"){
        possibleMoves.forEach(function(thisMove){
            if (thisMove[1] == Number(threat[1])){
                result = thisMove;
            }
        })
    }
    return result;
}

/////

function scanForThreats(currentBoard){
    var boardDim = currentBoard.allMovesMade.length;
    var playerThreat = -currentBoard.whoseTurn * boardDim + currentBoard.whoseTurn;
    var diag1Sum = 0;
    var diag2Sum = 0;
    for (var i = 0; i < boardDim; i++){
        var rowSum = 0;
        var colSum = 0;
        for (var j = 0; j < boardDim; j++){
            rowSum += currentBoard.allMovesMade[i][j];
            if (j == boardDim - 2){
                if (rowSum + currentBoard.allMovesMade[i][j + 1] == playerThreat){ 
                    return ["row", i];
                }
            } else {
                if (rowSum == playerThreat){ 
                    return ["row", i];
                }
            }
            colSum += currentBoard.allMovesMade[j][i];
            if (j == boardDim - 2){
                if (colSum + currentBoard.allMovesMade[j + 1][i] == playerThreat){ 
                    return ["col", i];
                }
            } else {
                if (colSum == playerThreat){
                    return ["col", i]
                }
            }
            if (i == j) diag1Sum += currentBoard.allMovesMade[i][j]; 
            if (i + j == boardDim - 1) diag2Sum += currentBoard.allMovesMade[i][j];
        }
    }
    if (diag1Sum == playerThreat){
        return ["diag1", 1];
    } 
    if (diag2Sum == playerThreat){
        return ["diag2", 2];  
    } 
    return null;
}


//////////////////////////////////////////////////////////////////
function checkForWinner(currentBoard){
    var outcome = checkBoard(currentBoard);
    if (outcome == "win"){
        $("#gameResult span").text("I've won again!");
        $(".square").off("click");
    } 
    else if (outcome == "loss")     { $("#gameResult span").text("How can this be...you've won!"); }
    else if (outcome == "draw")     { $("#gameResult span").text("It's a draw! You are a formidable opponent."); }
    else if (outcome == "ongoing")  { return; }
    $(".square").off("click");
}

function setup(size){
    var otherTags = { "three": ["four", "five"], "four": ["three", "five"], "five": ["three", "four"]};
    $("td").text("");
    $("#" + size +"Button").addClass("buttonOrange");
    $("#" + size +"Button").removeClass("buttonBlue");
    $("#" + otherTags[size][0] + "Button").addClass("buttonBlue");
    $("#" + otherTags[size][0] + "Button").removeClass("buttonOrange");
    $("#" + otherTags[size][1] + "Button").addClass("buttonBlue");
    $("#" + otherTags[size][1] + "Button").removeClass("buttonOrange");
    if($("#board_" + otherTags[size][0]).css("display") == "block"){
        $("#board_" + otherTags[size][0]).fadeOut(500, function() {
            $("#board_" + size).fadeIn(500); 
        });
    } else {
        $("#board_" + otherTags[size][1]).fadeOut(500, function() {
            $("#board_" + size).fadeIn(500); 
        });
    }
    $("#gameResult span").text("Let's play...");
    configEvents();
    var tagsToNums = {"three": 3, "four": 4, "five": 5}; 
    currentBoard = new Board(null, emptyBoard(tagsToNums[size], tagsToNums[size]), null, -1);
    simOneGame(currentBoard);
    return currentBoard;
}

function checkBoard(currentBoard){
    var boardDim = currentBoard.allMovesMade.length;
    var computerWins = boardDim;
    var playerWins = -boardDim;
    var diag1Sum = 0;
    var diag2Sum = 0;
    var gameOngoing = false;
    for (var i = 0; i < boardDim; i++){
        var rowSum = 0;
        var colSum = 0;
        for (var j = 0; j < boardDim; j++){
            rowSum += currentBoard.allMovesMade[i][j];
            colSum += currentBoard.allMovesMade[j][i];
            if (i == j) diag1Sum += currentBoard.allMovesMade[i][j]; 
            if (i + j == boardDim - 1) diag2Sum += currentBoard.allMovesMade[i][j];
            if (currentBoard.allMovesMade[i][j] == 0) gameOngoing = true;
        }
        if (rowSum == playerWins || colSum == playerWins) return "loss";
        if (rowSum == computerWins || colSum == computerWins) return "win";
    }
    if (diag1Sum == playerWins || diag2Sum == playerWins) return "loss";
    if (diag1Sum == computerWins || diag2Sum == computerWins) return "win";
    if (gameOngoing) return "ongoing";
    return "draw";
}

function getCoordinatesFromId(squareId){
    return [Number(squareId[squareId.length - 3]), Number(squareId[squareId.length - 1])];
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
