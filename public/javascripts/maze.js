/* global $ */
var Square = function(coordinates){
    this.coordinates = coordinates;
    this.topWall = false;
    this.bottomWall = false;
    this.leftWall = false;
    this.rightWall = false;
    this.wasVisited = false;
} 

var Maze = function(){
    this.squares = [];
    this.startSquare = null;
    this.endSquare = null;
    this.randomSolvableMaze();
    this.iterators = [];
}

Maze.prototype.randomSolvableMaze = function(){
    //Randomly determine initial maze walls.
    this.createMazeSquares();
    //Designate start and end squares, designated by index in this.squares:
    this.startSquare = 18 * zeroThruThree() + zeroThruThree();
    this.endSquare = 18 * (14 + zeroThruThree()) +  14 + zeroThruThree();
    //Make maze solvable by forcing a random course through.
    this.createEscape();
    //Fill in any empty areas with non blocking walls:
    this.fillEmptyAreas();
}

Maze.prototype.createMazeSquares = function(){
    var wallDensity = .65;
    for (var i = 0; i < 18; i ++){
        for (var j = 0; j < 18; j ++){
            var newSquare = new Square([j, i]);
            if (i == 0){
                newSquare.topWall = true;
            } else {
                newSquare.topWall = this.squares[this.squares.length - 18].bottomWall;
            }
            if (j == 0){
                newSquare.leftWall = true;
            } else {
                newSquare.leftWall = this.squares[this.squares.length - 1].rightWall;
            }
            if (i == 17){
                newSquare.bottomWall = true;
            } else {
                newSquare.bottomWall = Math.random() < wallDensity ? false : true;
            }
            if (j == 17){
                newSquare.rightWall = true;
            } else {
                newSquare.rightWall = Math.random() < wallDensity ? false : true;
            }
            newSquare = this.uncloseSquare(newSquare);
            this.squares.push(newSquare);
        }
    }
}

Maze.prototype.uncloseSquare = function(square){
    if (square.topWall == true && square.bottomWall == true && square.leftWall == true && square.rightWall == true){
        var val = Math.floor(Math.random() * (4));
        if (val < .25 && square.coordinates[1] != 0){
            square.topWall = false;
        }
        else if (val < .50 && square.coordinates[1] != 17){
            square.bottomWall = false;
        }
        else if (val < .75 && square.coordinates[0] != 0){ 
            square.leftWall = false;
        }
        else if (square.coordinates[0] != 17){
            square.rightWall = false;
        }
    }
    return square;
}

Maze.prototype.createEscape = function(){
    var tunneler = new Iterator(this.startSquare, this);
    while (tunneler.currentSquare != this.endSquare){
        if (Math.random() < .5){
            if (tunneler.coordinates[0] - this.squares[this.endSquare].coordinates[0] > 0){
                if (Math.random() < .65 && tunneler.coordinates[0] != 0){
                    tunneler.tunnel("left");
                    if (Math.random() < .3 && tunneler.coordinates[0] != 0){
                        tunneler.tunnel("left");
                    }
                } else {
                    if (tunneler.coordinates[0] != 17){
                        tunneler.tunnel("right");
                    }
                    if (Math.random() < .4 && tunneler.coordinates[0] != 17){
                        tunneler.tunnel("right");[0]
                    }
                }
            } else if (tunneler.coordinates[0] - this.squares[this.endSquare].coordinates[0] < 0) {
                if (Math.random() < .65 && tunneler.coordinates[0] != 17){
                    tunneler.tunnel("right");
                    if (Math.random() < .3 && tunneler.coordinates[0] != 17){
                        tunneler.tunnel("right");
                    }
                } else {
                    if (tunneler.coordinates[0] != 0){
                        tunneler.tunnel("left");
                    }
                    if (Math.random() < .4 && tunneler.coordinates[0] != 0){
                        tunneler.tunnel("left");
                    }
                }
            } 
        } else {
            if (tunneler.coordinates[1] - this.squares[this.endSquare].coordinates[1] > 0){
                if (Math.random() < .65 && tunneler.coordinates[1] != 0){
                    tunneler.tunnel("up");
                    if (Math.random() < .3 && tunneler.coordinates[1] != 0){
                        tunneler.tunnel("up");
                    }
            } else if(tunneler.coordinates[1] - this.squares[this.endSquare].coordinates[1] < 0) {
                    if (tunneler.coordinates[1] != 17){
                        tunneler.tunnel("down");
                    }
                    if (Math.random() < .4 && tunneler.coordinates[1] != 17){
                        tunneler.tunnel("down");
                    }
            }
            } else {
                if (Math.random() < .65 && tunneler.coordinates[1] != 17){
                    tunneler.tunnel("down");
                    if (Math.random() < .3 && tunneler.coordinates[1] != 17){
                        tunneler.tunnel("down");
                    }
                } else {
                    if (tunneler.coordinates[1] != 0){
                        tunneler.tunnel("up");
                    }
                    if (Math.random() < .4 && tunneler.coordinates[1] != 0){
                        tunneler.tunnel("up");
                    }
                }
            }
        }
    }
}

Maze.prototype.fillEmptyAreas = function(){
    for (var i = 18; i < this.squares.length - 1; i++){
        if (i % 18 == 0 || i % 18 == 17){
            continue;
        }
        if (!this.squares[i].topWall && !this.squares[i].leftWall && !this.squares[i - 19].bottomWall && !this.squares[i - 19].rightWall){
            if (Math.random() < .5){
                if (Math.random() < .5){
                    this.squares[i].topWall = true;
                    this.squares[i - 18].bottomWall = true;
                } else {
                    this.squares[i].leftWall = true;
                    this.squares[i - 1].rightWall = true;
                }
            } else {
                if (Math.random() < .5){
                    this.squares[i - 19].bottomWall = true;
                    this.squares[i - 1].topWall = true;
                } else {
                    this.squares[i - 19].rightWall = true;
                    this.squares[i - 18].leftWall = true;
                }
            }
        }
    }
}

Maze.prototype.solveMaze = function(){
    this.startSquare.wasVisited = true;
    this.iterators.push(new Iterator(this.startSquare, this));
    this.iterators[0].squaresVisited.push(this.startSquare);
    console.log(this.solveMazeNaked());
    console.log(this);
    this.iterators = [];
    for (var i = 0; i < this.squares.length; i++){
        this.squares[i].wasVisited = false;
    }
    this.startSquare.wasVisited = true;
    this.iterators.push(new Iterator(this.startSquare, this));
    this.iterators[0].squaresVisited.push(this.startSquare);
    this.solveMazeRecursive();
}

Maze.prototype.solveMazeNaked = function(){
    var fastestIterator = null;
    for (var i = 0; i < this.iterators.length; i++){
        if(this.iterators[i].currentSquare == this.endSquare){
            if (fastestIterator == null || this.iterators[i].squaresVisited.length < fastestIterator.squaresVisited.length){
                fastestIterator = this.iterators[i];
            }
        }
    }
    if (fastestIterator != null){
        return fastestIterator;
    }
    var newIterators = [];
    for (var i = 0; i < this.iterators.length; i++){
        //Make new iterators when more than 1 availableMove, add them to newIterators, move them 
        while(this.iterators[i].availableMoves.length > 1){
            newIterators.push(new Iterator(this.iterators[i].currentSquare, this));
            this.iterators[i].squaresVisited.forEach(function(square){
                newIterators[newIterators.length - 1].squaresVisited.push(square);
            })
            newIterators[newIterators.length - 1].move(this.iterators[i].availableMoves.pop());
            this.squares[newIterators[newIterators.length - 1].currentSquare].wasVisited = true;
        }
        //Move the current iterator to an available square
        if (this.iterators[i].availableMoves.length == 0){
            this.iterators.splice(i, 1);
        } else {
            this.iterators[i].move(this.iterators[i].availableMoves.pop());
            this.squares[this.iterators[i].currentSquare].wasVisited = true;
        }
    }
    //copy the newIterators into the iterators array
    var thisMaze = this;
    newIterators.forEach(function(newIterator){
        thisMaze.iterators.push(newIterator);
    })
    //recursion:
    return thisMaze.solveMazeNaked();
}

Maze.prototype.solveMazeRecursive = function(){
    var fastestIterator = null;
    for (var i = 0; i < this.iterators.length; i++){
        if(this.iterators[i].currentSquare == this.endSquare){
            console.log("hit1")
            if (fastestIterator == null || this.iterators[i].squaresVisited.length < fastestIterator.squaresVisited.length){
                console.log("hit2")
                fastestIterator = this.iterators[i];
            }
        }
    }
    if (fastestIterator != null){
        fastestIterator.paintTrailFromEnd();
        $("#computerMoves").text(String(fastestIterator.squaresVisited.length - 2));
        $("#computerMoves").css("color", "rgba(0, 180, 0, 0.7)");
        console.log(fastestIterator);
        return fastestIterator;
    }
    var newIterators = [];
    $(".square").addClass("empty");
    for (var i = 0; i < this.iterators.length; i++){
        //Make new iterators when more than 1 availableMove, add them to newIterators, move them 
        while(this.iterators[i].availableMoves.length > 1){
            newIterators.push(new Iterator(this.iterators[i].currentSquare, this));
            this.iterators[i].squaresVisited.forEach(function(square){
                newIterators[newIterators.length - 1].squaresVisited.push(square);
            })
            newIterators[newIterators.length - 1].move(this.iterators[i].availableMoves.pop());
            $("#" + newIterators[newIterators.length - 1].coordinates[1] + "_" + newIterators[newIterators.length - 1].coordinates[0]).removeClass("empty");
            $("#" + newIterators[newIterators.length - 1].coordinates[1] + "_" + newIterators[newIterators.length - 1].coordinates[0]).addClass("simIterator");
            this.squares[newIterators[newIterators.length - 1].currentSquare].wasVisited = true;
        }
        //Move the current iterator to an available square
        if (this.iterators[i].availableMoves.length == 0){
            $("#" + this.iterators[i].coordinates[1] + "_" + this.iterators[i].coordinates[0]).addClass("empty");
            this.iterators.splice(i, 1);
        } else {
            this.iterators[i].move(this.iterators[i].availableMoves.pop());
            $("#" + this.iterators[i].coordinates[1] + "_" + this.iterators[i].coordinates[0]).removeClass("empty");
            $("#" + this.iterators[i].coordinates[1] + "_" + this.iterators[i].coordinates[0]).addClass("simIterator");
            
            for (var visited = 0; visited < this.iterators[i].squaresVisited.length - 1; visited++){
                $("#" + this.squares[this.iterators[i].squaresVisited[visited]].coordinates[1] + "_" + this.squares[this.iterators[i].squaresVisited[visited]].coordinates[0]).removeClass("simIterator");
                $("#" + this.squares[this.iterators[i].squaresVisited[visited]].coordinates[1] + "_" + this.squares[this.iterators[i].squaresVisited[visited]].coordinates[0]).removeClass("empty");
                $("#" + this.squares[this.iterators[i].squaresVisited[visited]].coordinates[1] + "_" + this.squares[this.iterators[i].squaresVisited[visited]].coordinates[0]).addClass("simVisited");
            }
            $("#" + this.squares[this.iterators[i].squaresVisited[this.iterators[i].squaresVisited.length - 1]].coordinates[1] + "_" + this.squares[this.iterators[i].squaresVisited[this.iterators[i].squaresVisited.length - 1]].coordinates[0]).addClass("simIterator");
            this.squares[this.iterators[i].currentSquare].wasVisited = true;
        }
    }
    //copy the newIterators into the iterators array
    var thisMaze = this;
    newIterators.forEach(function(newIterator){
        thisMaze.iterators.push(newIterator);
    })
    //Delayed recursion:
    window.setTimeout(function(){
        return thisMaze.solveMazeRecursive();
    }, 400);
}
            
var Iterator = function(startSquare, maze){
    this.maze = maze;
    this.currentSquare = startSquare;
    this.coordinates = [this.currentSquare % 18, Math.floor(this.currentSquare / 18)];
    this.lastMove = null;
    this.squaresVisited = [];
    this.findAvailableMoves();
}

Iterator.prototype.move= function(dir){
    var direction = {
        "up": -18,
        "left": -1,
        "right": 1,
        "down": 18
    }
    this.currentSquare += direction[dir];
    this.squaresVisited.push(this.currentSquare);
    this.updateCoords();
    this.lastMove = dir;
    this.findAvailableMoves();
}

Iterator.prototype.paintTrailFromEnd = function(){
    if (this.currentSquare == this.maze.startSquare){
        $(".startSquare").addClass("endSquareComplete");
        return;
    } else {
        var that = this;
        window.setTimeout(function(){
            that.currentSquare = that.squaresVisited.pop();
            that.paintSquare("solutionPath");
            that.updateCoords();
            that.paintTrailFromEnd();
        }, 100);
    }
}

Iterator.prototype.findAvailableMoves = function(){
    this.availableMoves = [];
    if (!this.maze.squares[this.currentSquare].topWall && this.lastMove != "down" && !this.maze.squares[this.currentSquare - 18].wasVisited){
        this.availableMoves.push("up");
    }
    if (!this.maze.squares[this.currentSquare].bottomWall && this.lastMove != "up" && !this.maze.squares[this.currentSquare + 18].wasVisited){
        this.availableMoves.push("down");
    }
    if (!this.maze.squares[this.currentSquare].rightWall && this.lastMove != "left" && !this.maze.squares[this.currentSquare + 1].wasVisited){
        this.availableMoves.push("right");
    }
    if (!this.maze.squares[this.currentSquare].leftWall && this.lastMove != "right" && !this.maze.squares[this.currentSquare - 1].wasVisited){
        this.availableMoves.push("left");
    }
}

Iterator.prototype.updateCoords = function(){
    this.coordinates = [this.currentSquare % 18, Math.floor(this.currentSquare / 18)];
}

Iterator.prototype.paintSquare = function(className){
    $("#" + this.coordinates[1] + "_" + this.coordinates[0]).addClass(className);
}

Iterator.prototype.tunnel= function(dir){
    this.squaresVisited.push(this.currentSquare);
    var direction = {
        "up": -18,
        "left": -1,
        "right": 1,
        "down": 18
    }
    if (dir == "right"){
        this.maze.squares[this.currentSquare].rightWall = false;
        this.currentSquare += direction[dir];
        this.maze.squares[this.currentSquare].leftWall = false;
    }
    if (dir == "left"){
        this.maze.squares[this.currentSquare].leftWall = false;
        this.currentSquare += direction[dir];
        this.maze.squares[this.currentSquare].rightWall = false;
    }
    if (dir == "down"){
        this.maze.squares[this.currentSquare].bottomWall = false;
        this.currentSquare += direction[dir];
        this.maze.squares[this.currentSquare].topWall = false;
    }
    if (dir == "up"){
        this.maze.squares[this.currentSquare].topWall = false;
        this.currentSquare += direction[dir];
        this.maze.squares[this.currentSquare].bottomWall = false;
    }
    this.updateCoords();
}

//Page setup:
var myMaze = new Maze();
var userIterator = new Iterator(myMaze.startSquare, myMaze);
drawMaze(myMaze.squares, myMaze.startSquare, myMaze.endSquare, userIterator);

//Events
$("#newButton").on("click", function(){
    myMaze = new Maze();
    userIterator = new Iterator(myMaze.startSquare, myMaze);
    drawMaze(myMaze.squares, myMaze.startSquare, myMaze.endSquare, userIterator);
})

$("#solveButton").on("click", function(){
    myMaze.solveMaze();
})

$(".square").on("click", function(){
    if ($(this).hasClass("availableUserMove")){
        $(this).text(String(userIterator.squaresVisited.length + 1));
        var squareRow = null;
        var squareCol = null;
        if($(this).attr("id").length == 3){
            squareRow = $(this).attr("id")[0];
            squareCol = $(this).attr("id")[2];
        }
        else if($(this).attr("id").length == 5){
            squareRow = $(this).attr("id").slice(0,2);
            squareCol = $(this).attr("id").slice(3);
        } else {
            if($(this).attr("id")[1] == "_"){
                squareRow = $(this).attr("id")[0]
                squareCol = $(this).attr("id").slice(2,4);
            } else {
                squareRow = $(this).attr("id").slice(0,2)
                squareCol = $(this).attr("id")[3];
            }
        }
        
        $(".availableUserMove").removeClass("availableUserMove");
        userIterator.paintSquare("userVisited");
        if (squareRow > userIterator.coordinates[1]){
                userIterator.move("down");
            }
        if (squareRow < userIterator.coordinates[1]){
                userIterator.move("up");
            }
        if (squareCol > userIterator.coordinates[0]){
            userIterator.move("right");
        }
        if (squareCol < userIterator.coordinates[0]){
                userIterator.move("left");
        }
            
        userIterator.paintSquare("userVisited");
        highlightAvailableUserMoves(userIterator);
        $("#userMoves").text(String(userIterator.squaresVisited.length));
        console.log(userIterator.squaresVisited);
        
        if($(".endSquare").hasClass("availableUserMove")){
            $(".available").removeClass("availableUserMove");
            $(".endSquare").addClass("endSquareComplete");
            $(".square").off("click");
            $("#userMoves").css("color", "rgba(0, 180, 0, .7");
        }
    }
})

function setup(){
    
}

function drawMaze(squares, startSquare, endSquare, userIterator){
    $(".square").text("");
    $(".square").css("border", "2px solid #428bca");
    $(".availableUserMove").removeClass("availableUserMove");
    $(".userVisited").removeClass("userVisited");
    $(".solutionPath").removeClass("solutionPath");
    $(".startSquare").removeClass("startSquare");
    $(".endSquare").removeClass("endSquare");
    $(".simVisited").removeClass("simVisited");
    $(".simIterator").removeClass("simIterator");
    $(".endSquareComplete").removeClass("endSquareComplete");
    $("#userMoves").text("-");
    $("#computerMoves").text("-");
    
    $("#" + squares[startSquare].coordinates[1] + "_" + squares[startSquare].coordinates[0]).text("S");
    $("#" + squares[startSquare].coordinates[1] + "_" + squares[startSquare].coordinates[0]).addClass("startSquare");
    $("#" + squares[endSquare].coordinates[1] + "_" + squares[endSquare].coordinates[0]).text("F");
    $("#" + squares[endSquare].coordinates[1] + "_" + squares[endSquare].coordinates[0]).removeClass("empty");
    $("#" + squares[endSquare].coordinates[1] + "_" + squares[endSquare].coordinates[0]).addClass("endSquare");
    
    var nthSquare = 0;
    $("#" + String())
    for (var i = 0; i < 18; i ++){
        for (var j = 0; j < 18; j ++){
            if (!squares[nthSquare].topWall){
                $("#" + String(i) + "_" + String(j)).css("border-top", "none");
            }
            if (!squares[nthSquare].bottomWall){
                $("#" + String(i) + "_" + String(j)).css("border-bottom", "none");
            }
            if (!squares[nthSquare].leftWall){
                $("#" + String(i) + "_" + String(j)).css("border-left", "none");
            }
            if (!squares[nthSquare].rightWall){
                $("#" + String(i) + "_" + String(j)).css("border-right", "none");
            }
            nthSquare++;
        }
    }
    highlightAvailableUserMoves(userIterator);
}

function highlightAvailableUserMoves(userIterator){
    userIterator.availableMoves.forEach(function(availableMove){
        if (availableMove == "right"){
            $("#" + userIterator.coordinates[1] + "_" + String(userIterator.coordinates[0] + 1)).removeClass("empty");
            $("#" + userIterator.coordinates[1] + "_" + String(userIterator.coordinates[0] + 1)).addClass("availableUserMove");
        }
        if (availableMove == "left"){
            $("#" + userIterator.coordinates[1] + "_" + String(userIterator.coordinates[0] - 1)).removeClass("empty");
            $("#" + userIterator.coordinates[1] + "_" + String(userIterator.coordinates[0] - 1)).addClass("availableUserMove");
        }
        if (availableMove == "up"){
            $("#" + String(userIterator.coordinates[1] - 1) + "_" + userIterator.coordinates[0]).removeClass("empty");
            $("#" + String(userIterator.coordinates[1] - 1) + "_" + userIterator.coordinates[0]).addClass("availableUserMove");
        }
        if (availableMove == "down"){
            $("#" + String(userIterator.coordinates[1] + 1) + "_" + userIterator.coordinates[0]).removeClass("empty");
            $("#" + String(userIterator.coordinates[1] + 1) + "_" + userIterator.coordinates[0]).addClass("availableUserMove");
        }
        
    })
}

function zeroThruThree(){
    return Math.floor(Math.random() * 4);
}

function reverseArray(array){
    var temp = null;
    for (var i = 0; i < Math.floor(array.length/2); i++){
        temp = array[i];
        array[i] = array[array.length - 1 - i];
        array[array.length - 1 - i] = temp;
    }
    return;
}


