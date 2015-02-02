var TEXT_MARGIN = 14;
var IMAGE_HEIGHT = 171;
var TILE_WIDTH = 101;
var TILE_HEIGHT = 83;
var TILES_Y_START = 62;
var WATER_Y = -21;
var HEART_Y_DELTA = 17; // To make Heart look centered on the row
//var GEMS_PICKED = 0; // Keeps track of the Gems that were picked up by player
var NUMBER_OF_ENEMIES = 3;
var NUMBER_OF_ROCKS = 5;
// var POINTS = 0;
// var POINTS_PER_LEVEL = 100;
// var POINTS_PER_GEM = 10;
// var POINTS_PER_KEY = 50;
// var ENEMY_SPEED = 20;
var PAUSE = {
    state: false,
    ms: 0,
};
var GEM_SPRITES = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png',
    'images/Gem Green.png', 'images/Gem Blue.png'];
var NUMBER_OF_GEMS = GEM_SPRITES.length;

var Level = function() {
    this.number = 1;
    this.points = 0
    this.pointsPerLevel = 100;
    this.pointsPerGem = 10;
    this.pointsPerKey = 50;
    this.enemySpeed = 20;
    this.gemsPicked = 0;
}

Level.prototype.updateData = function(data) {
    return Math.round(data * (1 + (this.number - 1) / 10));
}

Level.prototype.next = function() {
    this.points += this.updateData(this.pointsPerLevel);
    this.pointsPerLevel = this.updateData(this.pointsPerLevel);
    this.pointsPerGem = this.updateData(this.pointsPerGem);
    this.pointsPerKey = this.updateData(this.pointsPerKey);
    this.enemySpeed = this.updateData(this.enemySpeed);
    this.number++;
    this.gemsPicked = 0
}

var level = new Level();

var Princess = function() {
    this.sprite = 'images/char-princess-girl.png';
    this.y = WATER_Y;
    this.initposition();
}

Princess.prototype.initposition = function() {
    this.x = Math.floor(Math.random() * 5) * TILE_WIDTH;
}

// Draw Key on the screen, required method for game
Princess.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var princess = new Princess();

var Key = function() {
    this.sprite = 'images/Key.png';
    this.init();
}

Key.prototype.init = function() {
    this.x = Math.floor(Math.random() * 5) * TILE_WIDTH;
    this.y = TILES_Y_START + TILE_HEIGHT * 4;
    this.found = false;
    this.gaveToPrincess = false;
}

// Draw Key on the screen, required method for game
Key.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var key = new Key();

// Heart to gain lives
var Heart = function() {
    this.sprite = 'images/Heart.png';
    this.speed = 500;
    this.initposition();
}


Heart.prototype.initposition = function() {
    this.x = -TILE_WIDTH * Math.floor((Math.random() * 20) + 15);
    this.y = TILES_Y_START + TILE_HEIGHT * Math.floor(Math.random() * 3);
}

Heart.prototype.update = function(dt) {
    // Move Heart forward if it din't pass the canvas
    if (this.x < ctx.canvas.width) {
        this.x += this.speed * dt ;
    }

    // Heart has left the "building", reset it's position
    else {
        this.initposition();
    }
}

// Draw Heart on the screen, required method for game
Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y + HEART_Y_DELTA);
}

var heart = new Heart();

// Rocks for fun
var Rock = function() {
    this.sprite = 'images/Rock.png';
    this.speed = 10;
    this.initposition();
}

Rock.prototype.initposition = function() {
    this.x = -TILE_WIDTH * Math.floor((Math.random() * 10) + 1);
    this.y = TILES_Y_START + TILE_HEIGHT * Math.floor(Math.random() * 3);
}

// Draw rocks on the screen, required method for game
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Rock.prototype.update = function(dt) {
    // Move Rock forward if it din't pass the canvas
    if (this.x < ctx.canvas.width) {
        this.x += this.speed * dt ;
    }

    // Rock has left the "building", reset it's position
    else {
        this.initposition();
    }
}

var allRocks = [];
for (var i = 0; i < NUMBER_OF_ROCKS; i++) {
    allRocks.push(new Rock());
}

// Make sure all Rocks are unique
// for (var i = 1; i < NUMBER_OF_ROCKS)

// Gems for fun
var Gem = function(gemNumber) {
    this.sprite = GEM_SPRITES[gemNumber];
    this.initposition(gemNumber);
}

Gem.prototype.initposition = function(gemNumber) {
    this.x = gemNumber * TILE_WIDTH;
    this.y = TILES_Y_START + TILE_HEIGHT * 4;
}

// Draw gems on the screen, required method for game
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var allGems = [];
for (var i = 0; i < NUMBER_OF_GEMS; i++) {
    allGems.push(new Gem(i));
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.initposition();
}

Enemy.prototype.initposition = function() {
    this.x = -TILE_WIDTH;
    this.y = TILES_Y_START + TILE_HEIGHT * Math.floor(Math.random() * 3);
    this.velocity = Math.floor((Math.random() * 12) + 5);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x < ctx.canvas.width) {
        this.x += level.enemySpeed * this.velocity * dt ;
    }

    // Enemy has left the "building"
    else {
        this.initposition();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.lives = 5;
    this.reset();
}


Player.prototype.reset = function() {
    // Put the Gem back if any on hands
    if (this.pickedGem > -1) {
        allGems[this.pickedGem].x = this.gemPickedAt_X;
        allGems[this.pickedGem].y = this.gemPickedAt_Y;
    }

    // Reset player position
    this.x = TILE_WIDTH * 2;
    this.y = TILES_Y_START + TILE_HEIGHT * 3;

    // Reset Gem data in player
    this.pickedGem = -1;
    this.gemPickedAt_X = null;
    this.gemPickedAt_Y = null;
}

Player.prototype.handleGems = function() {
    // Drop off a Gem ONLY in the water
    if (this.pickedGem > -1 && this.y === WATER_Y &&
        this.x !== princess.x) {

        // Set Gem's coordinates to those of player
        allGems[this.pickedGem].x = this.x;
        allGems[this.pickedGem].y = this.y;

        level.points += level.updateData(level.pointsPerGem);

        // Reset Gem's data in player
        this.pickedGem = -1;
        this.gemPickedAt_X = null;
        this.gemPickedAt_Y = null;

        // Put player to start
        this.x = TILE_WIDTH * 2;
        this.y = TILES_Y_START + TILE_HEIGHT * 3;
    }

    // Pick up a Gem or the Key
    else if (this.pickedGem === -1) {
        // Find a Gem to pick up
        for (var i = 0; i < NUMBER_OF_GEMS; i++) {
            if (allGems[i].x === this.x && allGems[i].y === this.y) {

                // Remember Gem's data
                this.pickedGem = i;
                this.gemPickedAt_X = allGems[i].x;
                this.gemPickedAt_Y = allGems[i].y;

                // Hide Gem from canvas
                allGems[i].x = -TILE_WIDTH;
                allGems[i].y = -TILE_HEIGHT;

                // Found the key
                if (this.x === key.x && this.y === key.y) {
                    if (key.found === false) {
                        level.points += level.updateData(level.pointsPerKey);
                    }
                    key.found = true;
                }

                level.gemsPicked++;

                return;
            }
        }

        // pick the Key
        if (key.found === true && this.x === key.x && this.y === key.y) {

            this.pickedKey = true;

            // Put Key in the pocket
            key.x = -TILE_WIDTH;
            key.y = -TILE_HEIGHT;
        }

        // Give Key to Princess
        else if (this.pickedKey === true && this.x === princess.x &&
            this.y === princess.y) {

            key.gaveToPrincess = true;
            this.pickedKey = false;
            key.x = this.x;
            key.y = this.y;

            PAUSE.state = true;
            PAUSE.ms = 5000;
        }
    }
}

// Move player according to user input
Player.prototype.update = function(keyPressed) {
    var playerLastX = player.x;
    var playerLastY = player.y;

    switch (keyPressed) {
        case 'up':
            // Make sure don't fall off top edge
            this.y -= (this.y > 0) ? TILE_HEIGHT : 0;
            break;
        case 'right':
            // Make sure don't fall off right edge
            this.x += (this.x + TILE_WIDTH < ctx.canvas.width) ? TILE_WIDTH : 0;
            break;
        case 'down':
            // Make sure don't fall off bottom edge
            this.y += (this.y + IMAGE_HEIGHT + TILE_HEIGHT < ctx.canvas.height) ? TILE_HEIGHT : 0;
            break;
        case 'left':
            // Make sure don't fall off left edge
            this.x -= (this.x > 0) ? TILE_WIDTH : 0;
            break
        case 'space':
            // Do the right thing (with a Gem, if needed)
            this.handleGems();
            break;
    }

    //Can't go through rocks. Fractions used because of blank space around
    //entities in image files.
    for (i in allRocks) {
        if (allRocks[i].x + TILE_WIDTH * .85 > this.x + TILE_WIDTH * .15 &&
            allRocks[i].x + TILE_WIDTH * .15 < this.x + TILE_WIDTH * .85 &&
            allRocks[i].y === this.y) {

            this.x = playerLastX;
            this.y = playerLastY;
        }
    }

    // Can't step on Gems in water
    for (i in allGems) {
        if (this.y === TILES_Y_START - TILE_HEIGHT && allGems[i].x === this.x &&
            allGems[i].y === this.y) {

            this.x = playerLastX;
            this.y = playerLastY;
        }
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(keyPressed) {
    this.update(keyPressed);
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0; i < NUMBER_OF_ENEMIES; i++)
    allEnemies.push(new Enemy());

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


function renderStats() {
    ctx.font = "36px Impact";
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.lineWidth = 3;
    ctx.textBaseline = "bottom";

    ctx.textAlign = "left";
    ctx.fillText('Level: ' + level.number, 0, ctx.canvas.height - TEXT_MARGIN);
    ctx.strokeText('Level: ' + level.number, 0, ctx.canvas.height - TEXT_MARGIN);

    ctx.textAlign = "center";
    ctx.fillText('Score: ' + level.points, ctx.canvas.width / 2, ctx.canvas.height - TEXT_MARGIN);
    ctx.strokeText('Score: ' + level.points, ctx.canvas.width / 2, ctx.canvas.height - TEXT_MARGIN);

    ctx.textAlign = "right";
    ctx.fillText('Lives: ' + player.lives, ctx.canvas.width, ctx.canvas.height - TEXT_MARGIN);
    ctx.strokeText('Lives: ' + player.lives, ctx.canvas.width, ctx.canvas.height - TEXT_MARGIN);
}

