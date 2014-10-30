// app.js: our main javascript file for this app
"use strict";

var tiles = [];
var idx;

for(idx = 1; idx <= 32; ++idx) {
    tiles.push ({
        tileNum: idx,
        src: 'img/tile' + idx + '.jpg',
        flipped: false,
        matched: false
    });
} //for each ti

//console.log(tiles);

//when document is rea...
$(document).ready(function() {
    //catch click event of start game button
    $('#start-game').click(function() {
        console.log('start game button clicked!');
        tiles = _.shuffle(tiles);
        var selectedTiles = tiles.slice(0,8);
        var tilePairs = [];
        _.forEach(selectedTiles, function(tile) {
            tilePairs.push(tile);
            tilePairs.push(_.clone(tile));
        });
        tilePairs = _.shuffle(tilePairs);
        console.log(tilePairs);

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
        window.setInterval(function() {
            var elapsedSeconds = (Date.now() - startTime) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
        }, 1000);


        $('#game-board img').click(function() {
            console.log(this.alt);
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');
            console.log(tile);
            flipTile(tile, clickedImg);
        });

    }); //start game button click

}); //document ready function

function flipTile(tile, img) {
    img.fadeOut(100, function() {
        if(tile.flipped) {
            img.attr('src', 'img/tile-back.png');
        }
        else {
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });
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

if(matches == 8 || remaining == 0) {
    Congrats!
}
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
