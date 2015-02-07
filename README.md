frontend-nanodegree-arcade-game
===============================

Students should use this rubric: https://www.udacity.com/course/viewer#!/c-ud015/l-3072058665/m-3072588797

for self-checking their submission.

	My attempt at Frogger.

Controls: Arrows to move and space to pick/drop objects.

Player needs to find a key hidden under gems, by checking
under them. Total there are 5 gems. Until player finds a key,
he can check under 4 different gems. If key was not found, player
runs out of lives or time - the game is lost.

When gem is picked up it must be dropped off only in the water,
there are 4 empty spaces there. Player can't step on gems in the water
and can't pick them up there. If key is found it must be delivered to
the princess and given to her. She awaits at the water also. Gems
can not be given to the princess, only the key.

Player doesn't need to bring the rest of gems to the water when the key
was found, but if he chooses so, he needs to make sure that there is still
empty place in water to drop them off.

Points awarded for bringing gems to water only if the key was not yet
discovered. Points for finding a key are calculated based on attempts made.
There are also points for bringing key to the princess. Amount of possible
points increase with every level.

Bugs are enemies, they bite and take lives. After the bite user goes back
to initial position and drops the gem, if one was on hands, but if he was
carryng a key, then only player's position resets. Bugs speed increases
with every level.

Rocks are obstacles. Their speed don't change through the game, but their
number increases every other level. User can't go through rocks, but other
than that they are harmless.

There are also stars and hearts flying around. Catching the heart increments
player lives, catching the star makes the player invincible for predetermined
period of time.

Messages displayed when player gets bitten, completes a level, or looses.
There is also one final canvas at the very end.

Difficulty coefficient, which is used to calculate points and enemy speed, is
increases with every level.

P.S. Thinking about adding a short fun video, at about after level 10 (it seems
enemies are pretty fast then with current initial speed), when I find something
interesting.
