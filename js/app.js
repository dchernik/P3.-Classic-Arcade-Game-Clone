
var IMAGE_HEIGHT = 171;
var TILE_WIDTH = 101;
var TILE_HEIGHT = 83;
var TILES_Y_START = 62;
var ENEMY_SPEED = 40;
var GEM_SPRITES = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png'];
var NUMBER_OF_ENEMIES = 3;

// Gems for fun
var Gem = function(gemNumber) {
    this.sprite = GEM_SPRITES[gemNumber];
    this.x = gemNumber * 2 * TILE_WIDTH;
    this.y = TILES_Y_START + TILE_HEIGHT * 4;
}

// Draw gems on the screen, required method for game
Gem.prototype.render = function(gemNumber) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var allGems = [];
for (var i = 0; i < GEM_SPRITES.length; i++) {
    allGems.push(new Gem(i));
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -TILE_WIDTH * Math.floor((Math.random() * 4) + 1);
    this.y = TILES_Y_START + TILE_HEIGHT * Math.floor(Math.random() * 3);
    this.velocity = Math.floor((Math.random() * 12) + 5);

}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (ENEMY_SPEED * this.velocity) * dt ;

    // bug has left the building
    if (this.x > ctx.canvas.width) {
        this.x = -TILE_WIDTH;
        this.y = TILES_Y_START + TILE_HEIGHT * Math.floor(Math.random() * 3);
        this.velocity = Math.floor((Math.random() * 12) + 5);
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
    this.x = TILE_WIDTH * 2;
    this.y = TILES_Y_START + TILE_HEIGHT * 3;
    this.pickedGem = false;
}

Player.prototype.update = function(keyPressed) {
    switch (keyPressed) {
        case 'up':
            this.y -= (this.y > 0) ? TILE_HEIGHT : 0;
            break;
        case 'right':
            this.x += (this.x + TILE_WIDTH < ctx.canvas.width) ? TILE_WIDTH : 0;
            break;
        case 'down':
            this.y += (this.y + IMAGE_HEIGHT + TILE_HEIGHT < ctx.canvas.height) ? TILE_HEIGHT : 0;
            break;
        case 'left':
            this.x -= (this.x > 0) ? TILE_WIDTH : 0;
        case 'space':
            if ((this.y === TILES_Y_START - TILE_HEIGHT) && this.pickedGem !== false) {
                allGems[this.pickedGem].x = this.x;
                allGems[this.pickedGem].y = this.y;
                this.pickedGem = false;
            }
            break;
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
