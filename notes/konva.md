What do I need?

These things get us enough to show the turns played by another player

- A static board with the Sorry shape, no pawns or anything
- A graphic for a pawn (all 4 colors)
- A graphic for card front (all available cards)
- A graphic for the card back
- A place to put draw deck (back of card) and discard deck (front of card) on board
- A place to put player info (handle, sample pawn, cards for adult game) outside of board, tied to color
- Some sort of indicator about whose turn it is (hmm, is that in game state?)
- An animation that moves a pawn from one square to another, taking care of slides, corners, etc.
- An animation that swaps two pawns (will have to detect a swap by looking at specified move)
- An animation that moves a pawn back to start (direct move, not by moving around the board)
- An animation that moves a pawn out of start to the board (i.e. for a 1 card)
- An animation that indicates a card was played
   - Standard: card "flips" out of draw deck to discard deck 
   - Adult: card moves from the player's hand to the discard deck
- An animation that indicates a card was drawn (for adult game)

Then I need this to actually execute a turn:

- A way (tooltip? screen area?) to show instructions for a card
- In adult mode, a way to select the card to play
- A way to highlight the pawns that can be played with the selected card (glow, flash?)
- A way to select the pawn to play
- A way to move a selected pawn to a new location
- A way to detect that a move is correct 
   - Needs to account for slides - player might move to top or bottom
   - Needs to account for conflicts - can't go to a space occupied by other pawn except for swap
- A way to "snap" a pawn back to original location if the chosen move isn't legal

Maybe a toast pops up when it's a user's turn?  Might need to increase timeout
- 20 seconds?

I think that I can do a lot of this with Kona shapes rather than having to
store image files.  It looks like we can write text into a shape, and we can
also have a tooltip.  

https://konvajs.org/
https://github.com/konvajs/vue-konva
http://rafaelescala.com/vue-konva-doc/#introduction
https://konvajs.org/docs/vue/index.html
https://www.w3schools.com/tags/ref_canvas.asp
https://www.mathsisfun.com/geometry/radians.html
