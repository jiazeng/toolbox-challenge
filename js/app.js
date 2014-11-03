// app.js: our main javascript file for this app
"use strict";

var tiles = [];
var idx;

var firstTile = null;
var firstImg;
var secondTile;
var resetting = null;
var matchedCount = 0;
var missedCount = 0;

for(idx = 1; idx <= 32; ++idx) {
    tiles.push ({
        tileNum: idx,
        src: 'img/tile' + idx + '.jpg',
        flipped: false,
        matched: false
    });
} //for each ti

//console.log(tiles);

//when document is ready...
//Shuffle the array, get 8, and cloned them into a set of 16
$(document).ready(function() {
    $('#instruction').popover();

    //catch click event of start game button
    $('#start-game').click(function() {

        $('#gameFinish').css('display', 'none');
        $('#game-board').fadeIn(300);

        console.log('start game button clicked!');
        tiles = _.shuffle(tiles);
        var selectedTiles = tiles.slice(0,8);
        var tilePairs = [];
        _.forEach(selectedTiles, function(tile) {
            tilePairs.push(tile);
            tilePairs.push(_.clone(tile));
        });
        tilePairs = _.shuffle(tilePairs);

        var gameBoard = $('#game-board');
        var row = $(document.createElement('div'));
        var img;
        _.forEach(tilePairs, function(tile, elemIndex) {
            if(elemIndex > 0 && 0 ===elemIndex %4) {
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
        var startTime = Date.now();
        var timer = window.setInterval(function() {
            var elapsedSeconds = (Date.now() - startTime) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
            $('#matchedCount').text(matchedCount);
            $('#missedCount').text(missedCount);
        }, 1000);

        //click on the image
        $('#game-board img').click(function() {
            console.log(this.alt);
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');
            console.log(tile);

            if(tile.flipped || tile.matched || resetting) {
                return;
            }
            if (!firstTile) { //if it is the first click, remember the tile and the picture

                console.log("first click");
                firstTile = tile;
                firstImg = $(this);
                //firstTile = firstImg.data('tile');
                firstTile = tile;
                flipTile(firstTile, firstImg);
                console.log("firstTile: " + firstTile);

            } else { //if it is the second click
                console.log("second click");
                flipTile(tile, clickedImg);
                //secondTile = $(this).data('tile');
                secondTile = tile;
                console.log("second tile" + secondTile);

                if(firstTile.tileNum == tile.tileNum) { //if two tiles match
                    console.log(firstTile.tileNum + "==" + tile.tileNum);
                    matchedCount++;
                    firstTile.matched = true;
                    secondTile.matched = true;

                } else { //tiles don't match
                    console.log("tiles don't match");
                    missedCount++;
                    resetting = window.setTimeout(function() {
                        flipTile(tile, clickedImg);
                        flipTile(firstTile, firstImg);
                    }, 1000);
                    resetting = null;
                }
                firstTile = null;
                secondTile = null;
            }

            if(matchedCount == 8) { //game finishes
                //timeout
                window.clearInterval(timer);

                //show states;
                //$('#win-screen').fadeIn(300);
                //$('#resetButton').fadeIn(300);
                //$('#audio')[0].play();
            }
        });

    }); //start game button click

}); //document ready function

function flipTile(tile, img) {
    img.fadeOut(100, function() {
        if(tile.flipped) { //if flipped, show back
            img.attr('src', 'img/tile-back.png');
        }
        else { //if not flipped, show picture
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped; //record if this picture is flipped or not
        img.fadeIn(100);
    }); //img fade out
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

/*
four attributes,
one variable to hold the img
second click: match/or not
clear the track of first step

until the second one flipped over, ignore click
Running code once after a delay

boolean resetting (outside click handler), set to true
after set to false
if(resetting = true) {
    just return;
 }
*/
