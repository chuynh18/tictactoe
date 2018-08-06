[Tic-tac-toe](https://chuynh18.github.io/tictactoe/)
===========

Play Tic-tac-toe vs another player locally (sharing the same computer), against an AI (you can go first or second), or watch the computer play itself.

About
-----

This is just a small challenge I gave myself.  I was very confident I could get the game logic down.  On the other hand, I had some ideas of how to approach scripting the game such that the computer could play it, but I hadn't ever done anything like this before.  So, I'm glad I gave this a try and got something working, even if the code could use some cleanup (especially when it comes to DRYing up the code).

I chose Tic-tac-toe because it's a very simple game:  it's deterministic, and there aren't many possible moves on a 3x3 board.  It also helps that the number of possible movies is strictly monotonic and decreasing.  I knew going in that while the rules of the game are very simple, I would have to think about the game on a more mechanical level to script something that could play the game.

There's not much to say about the game itself; it's simply Tic-tac-toe.  Take turns marking spots on the 3x3 board; first player to mark three contiguous cells wins.

Development
-----------

My basic approach to development (in chronological order):
1. Get a grid represented in HTML and CSS
1. Attach an event handler to the cells that `console.log`s out which cell is clicked
1. Represent the game as a two-dimensional array
1. Because game cells are sometimes represented as coordinates or as a cell ID (0 through 8), be able to translate between the two.  This is because coordinates are useful for accessing the two-dimensional array, but the cells are assigned IDs 0 through 8 in the HTML.  Also, when I score the best move for the AI, the movelist is a one-dimensional array.
    * From coordinates to cell ID:  `cellId = Row * 3 + column`
    * From a number to coordinates:  `Row = Math.floor(cellId / 3)` and `Column = cellId % 3`
    * This logic can be generalized by replacing 3 with the dimension of the game board.
1. Make it so that clicking cells updates the game state
1. Write logic for checking for win or draw.  At this point, the game is playable by two players.
1. Script game "AI" and integrate it into the existing game code.  At this point, the game is functionally complete.
1. Modify AI script to make it more interesting
    * Make it so whenever the AI sees more than one equivalently scored move, it will choose among the moves randomly
    * Make it so if the AI gets to move first, it does not always play the center spot
1. Cosmetic or other small tweaks
    * Added viewport tag and media queries for mobile responsiveness
    * Added mouseover effect to the game board (only during human turn and only for playable cells)
    * Hide the game board until the game is actually started
    * Pencil scribble audio to further differentiate Xs and Os
    * Save win/draw record to localStorage
1. Minor AI and game logic refactor
    * AI code slightly DRYer
    * Removed check draw function (it was never necessary.  oops.)
1. Refactored win logic so that the game is aware of which cells led to the win, allowing me to blink the row, column, or diagonal that led to the win.  This logic works if even if the player managed to win by creating more than one line simultaneously (that is to say, if the winning player managed to construct a row and a column or two diagonals, both winning lines will blink).
1. Further increased diversity of computer play by allowing the computer to play any cell during turn 1.
    * This took a bit of thinking in terms of how to parse the state of the board in order to have the machine not fall into certain board traps.
1. Added hint button
    * Game will suggest a play.  This makes the shortcomings of the Tic-tac-toe playing script quite obvious, as while it will never suggest a losing move, it does not suggest all possible non-losing moves.  Additionally, some suggested moves will seem to be weaker than others.  Still, the script is "perfect" in the sense that it will always play to a draw and it will never fail to punish human mistakes.  I think.
    * This was an extremely easy feature to add.  It only required very slight modification of the existing `play()` function.  In other words, the suggested squares are the squares that may have been played if the AI was playing.  Take a look at the console to peek under the hood!  This is outputted by the `play()` function, so you'll see this whenever the AI is playing or whenever you click the hint button.
1. Major changes:
    * Computer can now look ahead 1 turn in order to better punish human mistakes.  The machine got stronger in the sense that it can now detect and punish more mistakes that humans may make.  It should not be any more or less likely to lose (the chance of it losing should still be 0%); it's just better at winning.  This was a more risky change, so I put most of its code behind a feature toggle.  However, outside that feature toggle, I had to touch some existing functions to accommodate this change, but those changes were relatively simple.  Set `lookAhead: true` in `featureToggle.js` to enable.
    * I retroactively moved the non-diagonal-playing code behind a feature toggle.  Set `playNonDiagonals: true` in `featureToggle.js` to enable.

Basically, I took a fairly logical and incremental approach to building out this code.  I moved as quickly as possible in getting to functional MVP, then added extra stuff later.

Feature toggles
---------------

As mentioned above, I've added feature toggles to the code.  Images make the behaviorial differences more stark...

`lookAhead: false` - AI does not punish this board configuration

![`lookAhead: false`](assets/img/lookAheadFalse.png)

`lookAhead: true` - AI correctly identifies a move that guarantees victory

![`lookAhead: true`](assets/img/lookAheadTrue.png)

Retrospective
-------------

I learned quite a bit while doing this:

* It doesn't take very long to get to "legacy code" if you're not careful at the start.  In other words, it does not take very long to get to a state where it's difficult to work in a codebase.  I still have a long way to go in terms of pattern recognition (of good software development patterns and anti-patterns), so the later changes I made felt more difficult to make compared to the code that I wrote to get to a working product to begin with.
    * While I acknowledge the value of planning (especially as a former Scrum Master on fairly long-term projects), creating this project also reinforces that you also need a certain baseline level of knowledge to make that planning useful.  I simply did not know what I was in for when I laid out the program a certain way.
    * This bullet point stands out to me, because this is still a relatively simple program written over the course of only a few days.  If I tried to write anything application scale with this methodology, it would become impossible to make forward progress in just a week or two.
* It doesn't take long before it becomes hard to reason about the behavior of your program.
    * Tic-tac-toe is a fairly simple game, as I mentioned before.  I believe there are only 9! possibilities (the number of possible moves each turn is strictly monotonic and decreasing).
    * My first working version of the game would always start by playing the center.  This greatly pruned the tree of possible board positions.  Not only that, it eliminated the possibility of certain board positions ever occurring, so I never had to write code to deal with those positions.
    * As I expanded the possible moves, I had to write additional logic to properly play those new board positions.  All these rules work by modifying the score the game assigns to potential plays.  Once I added the 3rd or 4th rule, it became very difficult to reason about why any given board position was assigned a particular score.
    * As an aside, some of my previous work experience was on a software development team that did matchmaking for a major PC game.  I have a better appreciation for how difficult matchmaking was to reason about, given that it had so many rules and "voters" for constructing and pairing teams.  Not only that, it had to worry about the speed and quality of team construction/matching and scalability.
* I should have used feature toggles from the start.
    * Had I planned for feature toggles from the start, I would have laid out my program in a much more modular fashion.  This is because I would have always been working under the assumption that a given piece of behavior may or may not be available.
    * Because I brought in the concept of feature toggles late and only for one feature, all the code written prior to that point assumes the availability and behavior of all other code.

Other notes
-----------

* Pencil scribble audio credit:  rylandbrooks on [freesound.org](https://freesound.org/people/rylandbrooks/sounds/387926/)
* I wanted to focus more on the game and AI logic, so CSS grid was... appropriated from [W3Schools](https://www.w3schools.com/css/css_grid.asp).  Thanks, W3Schools, for being a concise and digestible reference for all things web.
* Please see `game.js` for the source code.  The hosted version embeds `game-min.js`, which was minified via [Google's Closure Compiler](https://closure-compiler.appspot.com/home).  I did this to see if there were any blatant errors that would come up; it's nice to get 0 warnings and errors.