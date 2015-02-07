
// Constatnts. Used to simplify placement of different
// entities on game's screen
var IMAGE_HEIGHT = 171,

    // Tile is a square of water, grass or bricks
    TILE_WIDTH = 101,
    TILE_HEIGHT = 83,

    // 'y' coordinates of first ground and water rows accordingly
    GROUND_Y = 62,
    WATER_Y = -21,

    // Deltas to nicely render entities. Needed because actual images
    // in provided png files have different 'y' coordinates
    HEART_Y_DELTA = 17,
    STAR_Y_DELTA = 8,
    KEY_Y_DELTA = 2;

    // Used to place game stats on the canvas
    STATS_PADDING_X = 5,
    STATS_PADDING_Y = 20,

    // Gems array in order they will appear on canvas
    GEM_SPRITES = ['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png',
    'images/Gem Green.png', 'images/Gem Blue.png'],


/*  Game object and it's methods.
 *  Used to keep track and manipulate parameters
 *  that may change within/after each level.
 */
    Game = function() {
    this.state = 'run';

    // Each level has different time limit
    this.sec = 45;
    this.min = 0;

    // Used to decrement time left in each level
    this.runningSec = this.sec;
    this.runningMin = this.min;

    this.lives = 5;
    this.message = '';
    this.level = 1;
    this.difficulty = 1;
    this.enemies = 3;
    this.enemySpeed = 10;
    this.rocks = 1;
    this.gems = 5;
    this.gemsChecked = 0;
    this.gemsInWater = 0;
    this.pointsTotal = 0;
    this.pointsPerLevel = 100;
    this.pointsPerGem = 10;

    // Returns number of points for when player finds the key
    // It's value depends on number of locations (gems) already
    // checked by the player.
    this.pointsPerKey = function() {
        return (this.gemsChecked > 0) ?
        (this.gems - this.gemsChecked) * this.pointsPerGem :
        this.gems * this.pointsPerGem * 2;
    };

    // Used to render different canvas at certain game states
    this.pause = {
        'bug-bite': 500,
        'next-level': 1500,
        'game-over': 3000
    };
};

// This method prepares game variables for next level, by resetting
// states of some entities and recalculating values of points to be
// awarded, time limit, bugs' speed, amount of rocks. Increments
// level counter and level difficulty.
Game.prototype.nextLevel = function() {
    this.level++;
    this.difficulty += 0.1;
    this.min += Math.floor((this.sec + 15) / 60);
    this.sec = ((this.sec + 15) % 60);
    this.runningSec = this.sec;
    this.runningMin = this.min;

    // Add rocks every other level
    this.rocks += (this.rocks < 5 && this.level % 2 === 0) ? 1 : 0;
    allRocks = [];
    for (var i = 0; i < game.rocks; i++) {
        allRocks.push(new Rock());
    }

    this.gemsChecked = 0;
    this.gemsInWater = 0;
    this.enemySpeed = Math.round(this.enemySpeed * this.difficulty);
    this.pointsPerLevel = Math.round(this.pointsPerLevel * this.difficulty);
    this.pointsPerGem = Math.round(this.pointsPerGem * this.difficulty);
    player.reset();
    player.invincible = false;
    player.invincibleAt = 0;
    key.reset();
    princess.reset();
    heart.reset();
    star.reset();
    allGems.forEach(function(gem, index) {
        gem.reset(index);
    });

    allEnemies.forEach(function(enemy) {
        enemy.reset();
    });
}

// Renders canvas according to current game state (game.state)
// and message (game.message).
Game.prototype.handleState = function() {
    // Creates and renders between-levels canvas.
    if (this.state === 'next-level') {
        // Render Water Bricks Grass
        renderWBG();

        princess.x = TILE_WIDTH * 1.7;
        princess.y = GROUND_Y + 0.7 * TILE_HEIGHT;

        heart.x = TILE_WIDTH * 2;
        heart.y = princess.y + 60;

        player.x = TILE_WIDTH * 2.3;
        player.y = princess.y;

        player.render();
        princess.render();
        heart.render();

        this.message = 'Next Level';
        ctx.font = "32px Verdana";
        ctx.fillStyle = "#C71585";
        ctx.textBaseline = "top";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "24px Verdana";

        ctx.fillText(this.message, ctx.canvas.width / 2, GROUND_Y  * 7);

        this.nextLevel();
    }

    // Final message, the game stops.
    else if (this.state === 'game-over') {

        if (this.lives <= 0) {
            this.message = "Eaten by Bugs!";
        }
        ctx.font = "56px Impact";
        ctx.strokeStyle = "white";
        ctx.fillStyle = "#4682b4";
        ctx.lineWidth = 1;
        ctx.textBaseline = "bottom";
        ctx.textAlign = "center";

        ctx.fillText(this.message, ctx.canvas.width / 2, ctx.canvas.height / 2 + TILE_HEIGHT);
        ctx.strokeText(this.message, ctx.canvas.width / 2, ctx.canvas.height / 2 + TILE_HEIGHT);
    }

    // After player was bitten by a bug
    else if (this.state === 'bug-bite') {
        this.message = "Yes We Bite!";

        ctx.font = "96px Impact";
        ctx.strokeStyle = "black";
        ctx.fillStyle = "#d2691e";
        ctx.lineWidth = 3;
        ctx.textBaseline = "bottom";
        ctx.textAlign = "center";

        ctx.fillText(this.message, ctx.canvas.width / 2, ctx.canvas.height / 2 + TILE_HEIGHT);
        ctx.strokeText(this.message, ctx.canvas.width / 2, ctx.canvas.height / 2 + TILE_HEIGHT);

        player.reset();
    }
}

var game = new Game();



/* Timer. Used to keep track of and display time left in each level.
 * Decrements only if game is running. Changes the color of digits,
 * depending on the amount of seconds left.
 */
var Timer = function() {

    var timerID = setTimeout(function(){Timer()}, 1000);
    var timerElement = document.getElementsByClassName("timer");
    timerElement[0].style.color = 'blue';

    if (game.state === 'run') {

        if (game.runningMin === 0) {
            if (game.runningSec < 11) {
                timerElement[0].style.color = "red";
            }
            else if (game.runningSec < 21) {
                timerElement[0].style.color = 'yellow';
            }
        }

        timerElement[0].innerHTML = "<p>Time Left: </p>" +
        ((game.runningMin > 9) ? game.runningMin : "0" + game.runningMin) + ":" +
        ((game.runningSec > 9) ? game.runningSec : "0" + game.runningSec);

        if (game.runningSec === 0) {
            if (game.runningMin > 0) {
                game.runningSec = 59;
                game.runningMin--;
            }
            else {
                game.state = 'game-over';
                game.message = 'Ran out of time!';
                clearTimeout(timerID);
            }
        }
        else {
            game.runningSec--;
        }
    }
}

Timer();



/* Enemy object and it's methods. Here bugs are created
 * and updated when needed.
 */
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.reset();
}

// Sets random velocity and 'y' coordinate for each bug.
// Places them to the left of canvas
Enemy.prototype.reset = function() {
    this.x = -TILE_WIDTH;
    this.y = GROUND_Y + TILE_HEIGHT * Math.floor(Math.random() * 3);
    this.velocity = Math.floor((Math.random() * 12) + 5);
}

Enemy.prototype.update = function(dt) {
    if (this.x < ctx.canvas.width) {
        this.x += game.enemySpeed * this.velocity * dt ;
    }

    // Enemy has left the "building"
    else {
        this.reset();
    }
}

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var allEnemies = [];
for (var i = 0; i < game.enemies; i++) {
    allEnemies.push(new Enemy());
}



/* Key object and it's methods. Key is hidden behind gems.
 * Player needs to find it to keep playing.
 */
var Key = function() {
    this.sprite = 'images/Key.png';
    this.reset();
}

// Sets key position with random 'x' and on the row where
// gems will be. Resets key states.
Key.prototype.reset = function() {
    this.x = Math.floor(Math.random() * 5) * TILE_WIDTH;
    this.y = GROUND_Y + TILE_HEIGHT * 4;
    this.found = false;
    this.hidden = true;
    this.picked = false;
    this.toPrincess = false;
}

// Draw Key on the screen, required method for game
Key.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y + KEY_Y_DELTA);
}

var key = new Key();



/* Player object and it's methods. Here player is created,
 * his position, state and behavior defined.
 */
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.pickedGem = -1;

    // Player can go through rocks and bugs for some time,
    // if catches the star.
    this.invincible = false;
    this.invincibleAt = 0;
    this.beInvincibleFor = 10000;

    this.reset();
}

Player.prototype.handleInput = function(keyPressed) {
    this.update(keyPressed);
}

// Updates player's position and state if game is running
Player.prototype.update = function(keyPressed) {
    if (game.state === 'bug-bite') {
        return;
    }

    // Remember current position
    var playerLastX = player.x;
    var playerLastY = player.y;

    // Follow user directions
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

    // Player is in regular state
    if (this.invincible === false) {
        //Can't go through rocks. Fractions used because of blank space around
        //entities in image files.
        for (var i = 0; i < game.rocks; i++) {
            if (allRocks[i].x + TILE_WIDTH * .85 > this.x + TILE_WIDTH * .15 &&
                allRocks[i].x + TILE_WIDTH * .15 < this.x + TILE_WIDTH * .85 &&
                allRocks[i].y === this.y) {

                // Do not update position if hits a rock
                this.x = playerLastX;
                this.y = playerLastY;

                return;
            }
        }

        // Catch the Star to become a SUPER hero
        if (star.x + TILE_WIDTH / 1.4 > player.x &&
            star.x - TILE_WIDTH / 1.3 < player.x &&  star.y === player.y) {

            // Update star's position (will tie to the player)
            star.update();

            // Make player invincible and remember that special moment
            this.invincible = true;
            this.invincibleAt = Date.now();
        }

        // Can't step on Gems in water
        for (var i = 0; i < game.gems; i++) {
            if (this.y === WATER_Y && allGems[i].x === this.x &&
                allGems[i].y === this.y) {

                // Do not update player position
                this.x = playerLastX;
                this.y = playerLastY;

                return;
            }
        }

        // Bug bites
        for (var i = 0; i < game.enemies; i++) {
            if (allEnemies[i].x + TILE_WIDTH / 1.4 > player.x  &&
                allEnemies[i].x - TILE_WIDTH / 1.3 < player.x &&
                allEnemies[i].y === player.y) {

                game.lives--;

                // Update game's state according to number of lives left
                if (game.lives <= 0) {
                    game.lives = 0;
                    game.state = 'game-over';
                }
                else {
                    game.state = 'bug-bite';
                }

                return;
            }
        }
    }

    // Time to be mortal again
    else if (Date.now() - this.invincibleAt > this.beInvincibleFor) {
        this.invincible = false;
    }

    // Catch the Heart
    if (heart.x + TILE_WIDTH / 1.4 > player.x &&
        heart.x - TILE_WIDTH / 1.3 < player.x &&  heart.y === player.y) {

        heart.reset();
        game.lives++;
    }

}

// Here player's search for key is managed
Player.prototype.handleGems = function() {
    // Drop off a Gem ONLY in the water, but not on princess
    if (this.pickedGem > -1 && this.y === WATER_Y &&
        this.x !== princess.x) {

        // Set Gem's coordinates to those of player
        allGems[this.pickedGem].x = this.x;
        allGems[this.pickedGem].y = this.y;

        // Reset palyer
        this.pickedGem = -1;
        this.reset();

        // Award points ONLY if key was not yet found
        if (key.found === false) {
            game.pointsTotal += game.pointsPerGem;
        }

        // Increment gemsInWater counter.
        game.gemsInWater++;
    }

    // Pick up a Gem or the Key only if pockets are empty
    else if (this.pickedGem === -1) {
        // Find a Gem to pick up
        for (var i = 0; i < game.gems; i++) {
            if (allGems[i].x === this.x && allGems[i].y === this.y && key.picked === false) {

                // Remember Gem's data
                this.pickedGem = i;
                this.gemPickedAt_X = allGems[i].x;
                this.gemPickedAt_Y = allGems[i].y;

                // Hide Gem from canvas (pick it up)
                allGems[i].x = -TILE_WIDTH;
                allGems[i].y = -TILE_HEIGHT;

                // Found the key under current gem
                if (this.x === key.x && this.y === key.y) {
                    if (key.found === false) {
                        game.pointsTotal += game.pointsPerKey();
                        key.found = true;
                    }
                    // Key now is visible.
                    key.hidden = false;
                }

                game.gemsChecked++;

                // Key not found and only one gem left unchecked
                if (key.found === false && game.gemsChecked === game.gems - 1) {
                    game.message = "Better luck next time!";
                    game.state = 'game-over';
                }

                // Picked up empty gem from last 2 remaininf, despite knowing where key was
                else if (key.hidden === true && game.gemsInWater === game.gems - 2) {
                    game.message = "Wrong Gem!";
                    game.state = 'game-over';
                }

                // Picked up gem when key was visible and no empty places in water
                else if (key.picked === false && game.gemsInWater === game.gems - 1) {
                    game.message = "You missed the key!";
                    game.state = 'game-over';
                }

                return;
            }
        }

        // pick the Key
        if (key.found === true && this.x === key.x && this.y === key.y) {

            key.picked = true;

            // Put Key in the pocket
            key.x = -TILE_WIDTH;
            key.y = -TILE_HEIGHT;
        }

        // Give Key to Princess
        else if (key.picked === true && this.x === princess.x &&
            this.y === princess.y) {

            key.toPrincess = true;
            game.pointsTotal += game.pointsPerLevel;
            game.state = 'next-level';
        }
    }
}

// Reset player position and drop gems
Player.prototype.reset = function() {
    // Put the Gem back if any on hands
    if (this.pickedGem > -1) {
        // Mark Key is hidden again if it is under this Gem
        if (this.gemPickedAt_X === key.x &&
            this.gemPickedAt_Y === key.y) {
            key.hidden = true;
        }

        // Put gem where it was picked up
        allGems[this.pickedGem].x = this.gemPickedAt_X;
        allGems[this.pickedGem].y = this.gemPickedAt_Y;
    }
    // Reset player position
    this.x = TILE_WIDTH * 2;
    this.y = GROUND_Y + TILE_HEIGHT * 3;

    // Reset Gem data in player
    this.pickedGem = -1;
    this.gemPickedAt_X = null;
    this.gemPickedAt_Y = null;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var player = new Player();



/* Princess. She doesn't do much. Just stands and
 * waits fo the player to bring her the key from...
 * her heart, treasure chest, castle - use your
 * imagination.
 */
var Princess = function() {
    this.sprite = 'images/char-princess-girl.png';
    this.reset();
}

// Sets princess floating on the water
Princess.prototype.reset = function() {
    this.x = Math.floor(Math.random() * 5) * TILE_WIDTH;
    this.y = WATER_Y;
}

Princess.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var princess = new Princess();



/* Heart. It is flying between enemies.
 * If user catches one, it gives him extra life.
 */
var Heart = function() {
    this.sprite = 'images/Heart.png';
    this.speed = 400;
    this.reset();
}

// Puts heart variable distance away from canvas on random rows
Heart.prototype.reset = function() {
    this.x = -TILE_WIDTH * Math.floor((Math.random() * 100) + 15);
    this.y = GROUND_Y + TILE_HEIGHT * Math.floor(Math.random() * 3);
}

Heart.prototype.update = function(dt) {
    // Move Heart forward if it din't pass the canvas
    if (this.x < ctx.canvas.width) {
        this.x += this.speed * dt ;
    }

    // Heart has left the "building", reset it's position
    else {
        this.reset();
    }
}

Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y + HEART_Y_DELTA);
}

var heart = new Heart();



/* Star. Similar to heart. But allows player
 * to walk through rocks and bugs, like through air.
 * Just for a while of course.
 */
var Star = function() {
    this.sprite = 'images/Star.png';
    this.speed = 300;
    this.reset();
}

Star.prototype.reset = function() {
    this.x = -TILE_WIDTH * Math.floor((Math.random() * 100) + 15);
    this.y = GROUND_Y + TILE_HEIGHT * Math.floor(Math.random() * 3);
}

Star.prototype.update = function(dt) {
    // Follow palyer when he is invincible
    if (player.invincible === true) {
        this.x = player.x;
        this.y = player.y + STAR_Y_DELTA;
    }

    // Update star's position
    else {
        // Move star forward if it didn't pass the canvas
        if (this.x < ctx.canvas.width) {
            this.x += this.speed * dt ;
        }

        // Star has left the "building", reset it's position
        else {
            this.reset();
        }
    }
}

Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y + STAR_Y_DELTA);
}

var star = new Star();



/* Rocks. As if enemies were not enough, here are rocks.
 * They don't bite, just obstacles for a non-invincible player.
 */
var Rock = function() {
    this.sprite = 'images/Rock.png';
    this.speed = 20;
    this.reset();
}

Rock.prototype.reset = function() {
    this.x = -TILE_WIDTH * Math.floor((Math.random() * 10) + 1);
    this.y = GROUND_Y + TILE_HEIGHT * Math.floor(Math.random() * 3);
}

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Rock.prototype.update = function(dt) {
    // Move rock forward if it didn't pass the canvas.
    if (this.x < ctx.canvas.width) {
        this.x += this.speed * dt ;
    }

    // Rock has left the "building", reset it's position.
    else {
        this.reset();
    }
}

var allRocks = [];
for (var i = 0; i < game.rocks; i++) {
    allRocks.push(new Rock());
}



/* Gems. Used to hide the key on the
 * lowest row of grass.
 */
var Gem = function(gemNumber) {
    this.sprite = GEM_SPRITES[gemNumber];
    this.reset(gemNumber);
}

Gem.prototype.reset = function(gemNumber) {
    this.x = gemNumber * TILE_WIDTH;
    this.y = GROUND_Y + TILE_HEIGHT * 4;
}

// Draw gems on the screen, required method for game
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var allGems = [];
for (var i = 0; i < game.gems; i++) {
    allGems.push(new Gem(i));
}



/*** Helper functions ***/

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

// Render water, bricks and grass. Basically render(), just without
// renderEntities()
function renderWBG() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var rowImages = [
            'images/water-block.png',   // Top row is water
            'images/stone-block.png',   // Row 1 of 3 of stone
            'images/stone-block.png',   // Row 2 of 3 of stone
            'images/stone-block.png',   // Row 3 of 3 of stone
            'images/grass-block.png',   // Row 1 of 2 of grass
            'images/grass-block.png'    // Row 2 of 2 of grass
        ],
        numRows = 6,
        numCols = 5,
        row, col;

    for (row = 0; row < numRows; row++) {
        for (col = 0; col < numCols; col++) {
            ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
        }
    }
}

/* Shows current values for level, points
 * and lives left on the bottom of canvas
 */
function renderStats() {
    ctx.font = "600 1em Verdana";
    ctx.fillStyle = "#fdf5e6";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "left";

    ctx.fillText('Level: ' + game.level, STATS_PADDING_X, ctx.canvas.height - STATS_PADDING_Y);
    ctx.fillText('Score: ' + game.pointsTotal, TILE_WIDTH * 2 + STATS_PADDING_X, ctx.canvas.height - STATS_PADDING_Y);

    ctx.textAlign = "right";
    ctx.fillText('Lives: ' + game.lives, TILE_WIDTH * 5 - STATS_PADDING_X, ctx.canvas.height - STATS_PADDING_Y);
}