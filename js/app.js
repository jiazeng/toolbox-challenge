// app.js: our main javascript file for this app
"use strict";

var tiles = [];
var idx;

var firstTile = null;
var firstImg;
var secondTile;
var resetting;
var matchedCount = 0;
var missedCount = 0;
var timer;
//var gameBoard = $('#game-board');

for(idx = 1; idx <= 32; ++idx) {
    tiles.push ({
        tileNum: idx,
        src: 'img/tile' + idx + '.jpg',
        flipped: false,
        matched: false
    });
} //for each ti

window.addEventListener('load', resize, false);
window.addEventListener('resize', resize, false);

//when document is ready...
//Shuffle the array, get 8, and cloned them into a set of 16
$(document).ready(function() {
    $('#instruction').popover({trigger: 'hover'});

    //catch click event of start game button
    $('#start-game').click(function() {
        var gameBoard = $('#game-board');
        $(gameBoard).fadeIn(100);
        $('#game-monitor').fadeIn(100);
        //window.clearInterval(timer);
        document.getElementById('startSound').load();
        document.getElementById('startSound').play();

        console.log('start game button clicked!');
        tiles = _.shuffle(tiles);
        var selectedTiles = tiles.slice(0,8);
        var tilePairs = [];
        _.forEach(selectedTiles, function(tile) {
            tilePairs.push(tile);
            tilePairs.push(_.clone(tile));
        });
        tilePairs = _.shuffle(tilePairs);

        var row = $(document.createElement('div'));
        var img;
        _.forEach(tilePairs, function(tile, elemIndex) {
            if(elemIndex > 0 && 0 === elemIndex %4) {
                gameBoard.append(row);
                row = $(document.createElement('div'));
            }

            img = $(document.createElement('img'));
            img.attr({
                src: 'img/tile-back.png',
                alt: 'tile' + tile.tileNum
            });
            img.data('tile', tile);
            row.append(img);
        });
        gameBoard.append(row);

        //get starting milliseconds
        var elapsedSeconds
        var startTime = Date.now();
        timer = window.setInterval(function() {
            elapsedSeconds = (Date.now() - startTime) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
            $('#matchedCount').text(matchedCount);
            $('#missedCount').text(missedCount);
        }, 1000);

        //add function for restart button
        $('#restart').click(function() {
            $('#win-screen').fadeOut(100);
            gameBoard.text("");
            window.clearInterval(timer);
            missedCount = 0;
            matchedCount = 0;
            startTime = Date.now();
            $('#menu').fadeIn(100);
        });


        //click on the image
        $('#game-board img').click(function() {
            console.log(this.alt);
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');
            console.log(tile);


            if(tile.flipped || tile.matched || resetting) {
                return;
            } else if (!firstTile) { //if it is the first click, remember the tile and the picture
                console.log("first click");
                firstImg = $(this);
                firstTile = firstImg.data('tile');
                flipTile(firstTile, firstImg);
                console.log("firstTile: " + firstTile);

            } else { //if it is the second click
                console.log("second click");
                flipTile(tile, clickedImg);
                secondTile = tile;
                console.log("second tile" + secondTile);

                if(firstTile.tileNum == tile.tileNum) { //if two tiles match
                    console.log(firstTile.tileNum + "==" + tile.tileNum);
                    matchedCount++;
                    firstTile.matched = true;
                    secondTile.matched = true;

                }
                else { //tiles don't match
                    console.log("tiles don't match");
                    missedCount++;
                    resetting = true;
                    window.setTimeout(function() {
                        flipTile(tile, clickedImg);
                        flipTile(firstImg.data('tile'), firstImg);
                        resetting = null
                    }, 500);
                }
                firstTile = null;
                secondTile = null;
            } //else if it is the second click

            //if game finishes
            if(matchedCount == 8) { //game finishes
                //timeout
                window.clearInterval(timer);
                var tries = matchedCount + missedCount;
                $('#totalTime').text(elapsedSeconds + ' seconds');
                $('#tries').text(tries + " turns");
                //show states;
                $('#menu').fadeOut(100);
                $('#game-monitor').fadeOut(100);
                $('#game-board').fadeOut(100);
                $('#win-screen').fadeIn(300);
                $('#restart').fadeIn(300);
                document.getElementById('finishSound').load();
                document.getElementById('finishSound').play();
            }
        }); // click on the image

    }); //start game button click

}); //document ready function

function flipTile(tile, img) {
    img.fadeOut(60, function() {
        if(tile.flipped) { //if flipped, show back
            img.attr('src', 'img/tile-back.png');
        }
        else { //if not flipped, show picture
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped; //record if this picture is flipped or not
        img.fadeIn(60);
    }); //img fade out
}

function resize() {
    var winHeight = window. innerHeight;
    var winWidth = window.innerWidth;

    var smaller = Math.min(winWidth, winHeight);
    console.log("width: " + winWidth);
    console.log("height " + winHeight);
    console.log("smaller: " + smaller);

    if(winHeight == smaller) {
        smaller = smaller - 220;
    }
    if(winWidth == smaller) {
        smaller = smaller - 220;
    }
    $('#game-board').css('height', (smaller - 10));
    $('#game-board').css('width', (smaller - 10));
}


/*
Game Logic
varibles need to exist in a scope highter then the click event
a new turn: track tiles, assoiated tile number with the image itself, temp variable to remember the tile/img that was
clicked on
if it has a value, true, if null/undefined = false, if(variable), then first click of the turn
Comparison: tile number,
if don't match{
    filp tile over, increment miss (miss+++
} if match,
    decrement remaining, increment match
}

if already matched or clicked, if flipped == true, just return

second move (null) flipped/null

 if there are two tiles flipped over:
 if the first tile has the same face as the second tile:
 keep the tiles face up

if(matches == 8 || remaining == 0) {
    Congrats!
}
 */

/*
4 variales higher than click event

track which image was clicked on, and it's tile to compare to last one

clear the variable using to track first and last image

won game when matches ==8 or remain = 0

get another variable to decide when to ignore your click, boolean resetting outside click handler

reset to true, and then set to false. inside click handler, if the resetting is true then just return
*/

