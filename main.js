$(document).ready(initializeApp);

var game = null;
function initializeApp() {
  game = new BeatGame("#barContainer", "#score");
  game.addEventHandlers();
  game.addBar('a');
  game.addBar('s');
  game.addBar('d');
  game.startGame()
  game.addRandomBeat();
}
