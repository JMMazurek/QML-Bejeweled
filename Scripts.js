var jewels = [];
var selected = void(0);
var moving = 99;
var swapped = false;
var swappedJewel1;
var swappedJewel2;
var currentScore = 0;
var highScore = 0;
var movesPerRound = 15;
var movesLeft = movesPerRound;

function spawnJewels() {
    var component = Qt.createComponent("Jewel.qml");
    score.mLeft = movesPerRound;
    for(var i = 0; i < 10; i++) {
        for(var j = 0; j < 10; j++) {
            var color;
            do {
                color = randomColor();
            } while(!acceptColor(color, i, j));
            var object = component.createObject(board);
            object.x = object.width * j;
            object.y = object.width * i;
            object.onMovingChange.connect(check);
            object.color = color;
            jewels.push(object);
        }
    }
}
function check(e) {
    if(e)
        moving++;
    else
        moving--;
    if(moving == 0) {
        if(findJewels()) {
            removeSet();
            move();
            if(swapped) {
                movesLeft--;
                score.mLeft--;
                if(movesLeft == 0)
                    board.end = true;
            }
            swapped = false;
        }
        else if(swapped) {
            swapJewels(swappedJewel1, swappedJewel2);
        }
    }
}

function swapJewels(j1, j2) {
    var tempJ = jewels[j1];
    var tempY = jewels[j1].y;
    var tempX = jewels[j1].x;

    jewels[j1].y = jewels[j2].y;
    jewels[j2].y =  tempY;
    jewels[j1].x = jewels[j2].x;
    jewels[j2].x = tempX;
    jewels[j1] = jewels[j2];
    jewels[j2] = tempJ;

    if(swapped) {
        swapped = false;
    }
    else {
        swappedJewel1 = j1;
        swappedJewel2 = j2;
        swapped = true;
    }
}

function clicked(x, y) {
    var i;
    i = Math.floor(y / board.jewelSize) * 10 + Math.floor(x / board.jewelSize);

    if(selected == i) {
        jewels[i].state = "normal";
        selected = void(0);
    }
    else if(selected > -1) {
        jewels[selected].state = "normal";
        var diff = i - selected;
        if(diff == -1 || diff == 1 || diff == 10 || diff == -10)
            swapJewels(i, selected);
        selected = void(0);
    }
    else {
        selected = i;
        jewels[i].state = "selected";
    }
}

function moveDown(nr, times) {
    jewels[nr].y += jewels[nr].width * times;
}

function toRemove(nr) {
    jewels[nr].toRemove = true;
}

function swapReference(j1, j2) {
    var temp = jewels[j1];
    jewels[j1] = jewels[j2];
    jewels[j2] = temp;
}

function removeSet() {
    for( var i = 0; i < 10; i++) {
        var count = 0;
        for( var j = 9; j >= 0; j--) {
            if(jewels[j*10+i].toRemove) {
                count++;
            }
            else {
                jewels[j*10+i].toMove = count;
            }
        }
        for( var j1 = 9; j1 >= 0; j1--) {
            if(!jewels[j1*10+i].toRemove) {
                if(jewels[j1*10+i].toMove > 0) {
                    swapReference(j1*10+i, (j1+jewels[j1*10+i].toMove)*10+i);
                }
            }
        }
        for( var j2 = 0; j2 < count; j2++) {
            jewels[j2*10+i].toRemove = false;
            jewels[j2*10+i].toMove = count;
            jewels[j2*10+i].animateY = false;
            jewels[j2*10+i].y = -(count - j2) * jewels[j2*10+i].width;
            jewels[j2*10+i].animateY = true;
            jewels[j2*10+i].color = randomColor();
            currentScore++;
            score.score++;
        }
    }
}

function move() {
    for(var i = 0; i < 100; i++) {
        moveDown(i, jewels[i].toMove);
        jewels[i].toMove = 0;
    }
}

function findJewels(){
    var found = false;
    for( var i = 0; i < 10; i++) {
        for( var j = 0; j < 10 - 2; j++) {
            if(jewels[i*10+j].color == jewels[i*10+j+1].color &&
               jewels[i*10+j].color == jewels[i*10+j+2].color)
            {
                found = true;
                toRemove(i*10+j);
                toRemove(i*10+j+1);
                toRemove(i*10+j+2)
            }
            if(jewels[j*10+i].color == jewels[(j+1)*10+i].color &&
               jewels[j*10+i].color == jewels[(j+2)*10+i].color)
            {
                found = true;
                toRemove(j*10+i);
                toRemove((j+1)*10+i);
                toRemove((j+2)*10+i)
            }
        }
    }
    return found;
}

function randomColor() {
    var i = Math.floor(5 * Math.random());

    switch(i) {
    case 0: return "lightgreen";
    case 1: return "lightblue";
    case 2: return "pink";
    case 3: return "lightsalmon";
    case 4: return "lightgrey";
    }
}

function acceptColor(color, row, col) {
    if(col > 1) {
        if(Qt.colorEqual(jewels[row*10+col-1].color, color) &&
           Qt.colorEqual(jewels[row*10+col-2].color, color)) {
            return false;
        }
    }
    if(row > 1) {
        if(Qt.colorEqual(jewels[(row-1)*10+col].color, color) &&
           Qt.colorEqual(jewels[(row-2)*10+col].color, color)) {
            return false;
        }
    }
    return true;
}

function reset(){
    if(currentScore > highScore)
        highScore = currentScore;
    movesLeft = movesPerRound;
    currentScore = 0;
    score.hScore = highScore;
    score.mLeft = movesLeft;
    score.score = currentScore;

    for(var i = 0; i < 10; i++) {
        for(var j = 0; j < 10; j++) {
            var color;
            do {
                color = randomColor();
            } while(!acceptColor(color, i, j));
            jewels[i*10+j].color = color;
        }
    }
}

