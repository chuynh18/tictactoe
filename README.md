Tic Tac Toe
===========

Play Tic Tac Toe vs another player locally (sharing the same computer), against an AI (you can go first or second), or watch the computer play itself.

About
-----

This is just a small challenge I gave myself.  I was very confident I could get the game logic down.  On the other hand, I had some ideas of how to approach scripting the game such that the computer could play it, but I hadn't ever done anything like this before.  So, I'm glad I gave this a try and got something working, even if the code could use a lot of cleanup (especially when it comes to DRYing up the code).

There's not much to say about the game itself; it's simply Tic Tac Toe.  Take turns marking spots on the 3x3 board; first player to mark three contiguous cells wins.

My basic approach was:
1. Get a grid represented in HTML and CSS
1. Attach an event handler to the cells that `console.log`s out which cell is clicked
1. Represent the game as a two-dimensional array
1. Because game cells are sometimes represented as coordinates or as a cell ID (0 through 8), be able to translate between the two.  This is because coordinates are useful for accessing the two-dimensional array, but the cells are assigned IDs 0 through 8 in the HTML.  Also, when I score the best move for the AI, the movelist is a one-dimensional array.
    * From coordinates to cell ID:  `cellId = Row * 3 + column`
    * From a number to coordinates:  `Row = Math.floor(cellId/3)` and `Column = cellId % 3`
1. Make it so that clicking cells updates the game state
1. Write logic for checking for win or draw
1. Script game "AI"
1. Modify AI script to make it more interesting
    * Make it so whenever the AI sees more than one equivalently scored move, it will choose among the moves randomly
    * Make it so if the AI gets to move first, it does not always play the center spot

Basically, I took a fairly logical and incremental approach to building out this code.

To do
-----

* DRY up "AI" code