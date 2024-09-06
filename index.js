var board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

var numToAdd;
var mistakes = 0;

window.onload = function() {

    makeBoard();

    attachSolveListeners();

    funcId("clearBoard").addEventListener("click", function() {
        makeBoard();
        mistakes = 0;
        updateMistakesDisplay();
    });

    let numberElements = document.querySelectorAll("#numbers p");

    numberElements.forEach(function(number) {
        number.addEventListener("click", function () {
            console.log("Clicked number: ", this.innerHTML);


            if (this.innerHTML === 'X') {
                if (this.classList.contains("selected")) {
                    this.classList.remove("selected");
                    numToAdd = undefined;  
                    this.style.backgroundColor = "";
                    this.style.color = "";
                    console.log("Deselected X");
                } else {
                    numberElements.forEach(function(num) {
                        num.classList.remove("selected");
                        num.style.backgroundColor = "";
                        num.style.color = "";
                    });
    
                    this.classList.add("selected");
                    numToAdd = 'del';
                    this.style.backgroundColor = "aqua";
                    this.style.color = "#333";
                    console.log("Delete mode activated");
                }
                return;
            }

            if (this.classList.contains("selected")) {
                this.classList.remove("selected");
                numToAdd = undefined;
                console.log("Deselected number: ", this.innerHTML);
                this.style.backgroundColor = "";
                this.style.color = "";
            } else {
                numberElements.forEach(function(num) {
                    num.classList.remove("selected");
                    num.style.backgroundColor = "";
                    num.style.color = "";
                });

                this.classList.add("selected");
                numToAdd = this.innerHTML;
                console.log("Selected number: ", numToAdd);
                this.style.backgroundColor = "aqua"; 
                this.style.color = "#333"; 
            }
        });
    });
};




var index1;
var index2;
var isSolved = false;

function makeBoard() {
    emptyBoard();

    let id = 0;

    for(let i=0; i<81; i++){

        const idnum = String(i);

        let square = document.createElement("p");    
        square.textContent = '';
        square.classList.add("square");
        square.id = idnum                            

        if(i>=0 && i<9) {square.classList.add("borderUp");}

        if(i>=72 && i<=81) {square.classList.add("borderBottom");}   

        if((i+1)%9 == 0) {square.classList.add("borderRight");}

        if(i%9 == 0) {square.classList.add("borderLeft");}

        if((id>17 && id<27) || (id>44 && id<54)) {square.classList.add("borderBottom");}

        if((id+1) %9 == 3 || (id+1) %9 == 6) {square.classList.add("borderRight");}

        id++;

        funcId("board").appendChild(square);           

        funcId("board").children[i].addEventListener("click", async function () {

            const numid = parseInt(funcId("board").children[i].id) + 1

            if(numid%9 != 0) {
                index1 = Math.floor(numid/9);
                index2 = (numid%9)-1;
            }
            else {
                index1 = Math.floor((numid-1)/9);
                index2 = 8;
            }

            var finalIndexes = [index1, index2];

    if (numToAdd === 'del') {
        if (funcId("board").children[i].innerHTML !== '') {
            funcId("board").children[i].innerHTML = ''; 
            funcId("board").children[i].classList.remove("solveColour");
            board[index1][index2] = 0;
        }
        return;  
    }

    if (numToAdd === undefined) {
        return;
    }

    if (funcId("board").children[i].innerHTML !== '') {
        return;
    }

    if (checkDuplicates(board, parseInt(numToAdd), finalIndexes)) {
        funcId("board").children[i].innerHTML = numToAdd;
        funcId("board").children[i].classList.add("solveColour");
        board[index1][index2] = parseInt(numToAdd);
    } else {
        mistakes++;
        updateMistakesDisplay();
    }
            funcId("solver").addEventListener("click", solve1);  
            funcId("speedup").addEventListener("click", solve2);
        });
    }
}

function attachSolveListeners() {
    funcId("solver").removeEventListener("click", solve1); 
    funcId("solver").addEventListener("click", solve1);

    funcId("speedup").removeEventListener("click", solve2); 
    funcId("speedup").addEventListener("click", solve2);
}

async function solve1 () {

    var empty = findEmptySpace();

    if(!empty) {
        isSolved = true;
        return true;
    }

    for(let i=1; i<10; i++) {

        if(checkDuplicates(board, i, empty)) {

            board[empty[0]][empty[1]] = i;
            finalInd = (empty[0]*9) + empty[1];

            funcId("board").children[finalInd].classList.remove("solveColour")
            await sleep1();
            funcId("board").children[finalInd].classList.add("solveColour");
            funcId("board").children[finalInd].innerHTML = i;                   

            if(await solve1()) {
                return true;
            }

            board[empty[0]][empty[1]] = 0;

            funcId("board").children[finalInd].classList.remove("solveColour")
            await sleep1();
            funcId("board").children[finalInd].classList.add("solveColour");
            funcId("board").children[finalInd].innerHTML = 0;                    
        }
    }

    funcId("board").children[0].innerHTML = board[0][0];   
    return false;

}

function solve2 () {

    var empty = findEmptySpace();

    if(!empty) {
        isSolved = true;
        return true;
    }

    for(let i=1; i<10; i++) {

        if(checkDuplicates(board, i, empty)) {

            board[empty[0]][empty[1]] = i;
            finalInd = (empty[0]*9) + empty[1];

            funcId("board").children[finalInd].classList.add("solveColour");
            funcId("board").children[finalInd].innerHTML = i;                   

            if(solve2()) {
                return true;
            }

            board[empty[0]][empty[1]] = 0;

            funcId("board").children[finalInd].classList.add("solveColour");
            funcId("board").children[finalInd].innerHTML = 0;                   
        }
    }

    funcId("board").children[0].innerHTML = board[0][0];    
    return false;
}


function findEmptySpace () {

    for(let i=0; i<9; i++) {
        for(let j=0; j<9; j++) {
            if(board[i][j] == 0) {
                return [i, j];
            }
        }
    }

}

function sleep1() {
    return new Promise(resolve => setTimeout(resolve, 25));     
}

function updateMistakesDisplay() {
    funcId("mistakesDisplay").textContent = "Mistakes: " + mistakes;
}

function funcId(id) {
    return document.getElementById(id);     
}

function emptyBoard() {
    let squares = document.querySelectorAll(".square");

    for(let i=0; i<squares.length; i++) {
        squares[i].remove();                    
    }

    for(let i=0; i<9; i++) {
        for(let j=0; j<9; j++) {
            board[i][j] = 0;                    
        }
    }
    fault1 = 0;
    fault2 = 0;
    fault3 = 0;
    isSolved = false;
}

function checkDuplicates (board, num, empty) {
    for(let i=0; i<9; i++) {
        if(board[empty[0]][i] == num && empty[1] != i) {
            fault1 = 1;                                      
            return false;
        }
    }

    for(let i=0; i<9; i++) {
        if(board[i][empty[1]] == num && empty[0] != i) {
            fault2 = 1;                                       
            return false;
        }
    }

    var x = Math.floor(empty[1]/3);
    var y = Math.floor(empty[0]/3);

    for(let i=(y*3); i<(y*3)+3; i++) {
        for(let j=(x*3); j<(x*3)+3; j++) {
            if(board[i][j] == num && i != empty[0] && j != empty[1]) {
                fault3 = 1;                                           
                return false;
            }
        }
    }

    return true;

}