Tic-tac-toe
===========

Play Tic-tac-toe vs another player locally (sharing the same computer), against an AI (you can go first or second), or watch the computer play itself.

About
-----

This is just a small challenge I gave myself.  I was very confident I could get the game logic down.  On the other hand, I had some ideas of how to approach scripting the game such that the computer could play it, but I hadn't ever done anything like this before.  So, I'm glad I gave this a try and got something working, even if the code could use some cleanup (especially when it comes to DRYing up the code).

I chose Tic-tac-toe because it's a very simple game:  it's deterministic, and there aren't many possible moves on a 3x3 board.  I knew going in that while the rules of the game are very simple, I would have to think about the game on a more mechanical level to script something that could play the game.

There's not much to say about the game itself; it's simply Tic-tac-toe.  Take turns marking spots on the 3x3 board; first player to mark three contiguous cells wins.

My basic approach to development (in chronological order):
1. Get a grid represented in HTML and CSS
1. Attach an event handler to the cells that `console.log`s out which cell is clicked
1. Represent the game as a two-dimensional array
1. Because game cells are sometimes represented as coordinates or as a cell ID (0 through 8), be able to translate between the two.  This is because coordinates are useful for accessing the two-dimensional array, but the cells are assigned IDs 0 through 8 in the HTML.  Also, when I score the best move for the AI, the movelist is a one-dimensional array.
    * From coordinates to cell ID:  `cellId = Row * 3 + column`
    * From a number to coordinates:  `Row = Math.floor(cellId / 3)` and `Column = cellId % 3`
    * This logic can be generalized by replacing 3 with the dimension of the game board.
1. Make it so that clicking cells updates the game state
1. Write logic for checking for win or draw
1. Script game "AI" and integrate it into the existing game code
1. Modify AI script to make it more interesting
    * Make it so whenever the AI sees more than one equivalently scored move, it will choose among the moves randomly
    * Make it so if the AI gets to move first, it does not always play the center spot
1. Cosmetic tweaks
    * Added viewport tag and media queries for mobile responsiveness
    * Added mouseover effect to the game board (only during human turn and only for playable cells)
    * Hide the game board until the game is actually started
    * Pencil scribble audio to further differentiate Xs and Os.

Basically, I took a fairly logical and incremental approach to building out this code.

Potential Todo List
-------------------

* DRY up "AI" code

Other notes
-----------

* Pencil scribble audio credit:  rylandbrooks on [freesound.org](https://freesound.org/people/rylandbrooks/sounds/387926/)
* I wanted to focus more on the game and AI logic, so CSS grid was... appropriated from [W3Schools](https://www.w3schools.com/css/css_grid.asp).  Thanks, W3Schools, for being a concise and digestible reference.