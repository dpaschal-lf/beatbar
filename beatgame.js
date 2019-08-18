class BeatGame {
  constructor(domContainer, scoreContainer) {
    this.handleKeyDown = this.handleKeyDown.bind( this );
    this.handleKeyUp = this.handleKeyUp.bind( this );
    this.addRandomBeat = this.addRandomBeat.bind( this );
    this.handleBeatScore = this.handleBeatScore.bind( this );
    this.bars = {};
    this.score = 0;
    this.beatsToSpawn = {};
    this.scoreDeltas = {
        hit: 1,
        miss: -1
    }
    this.endConditions = {
        win: 20,
        lose: -20
    }
    this.barArray = [];
    this.interval = 30;
    this.running = false;
    this.beatMovement = {
      left: 0,
      top: 5
    };
    this.domElements = {
      container: $(domContainer),
      score: $(scoreContainer)
    };
  }
  win(){
    this.stopGame();
    alert('you win!')
  }
  lose(){
    this.stopGame();
    alert('you lose!');
  }
  addRandomBeat(){
    const randomBar = Math.floor( this.barArray.length * Math.random() );
    this.barArray[randomBar].addBeat();
    const nextBeatTime = Math.floor( Math.random() * 1000) + 200;
    if(this.running){
        let thisTimer = setTimeout( ()=>{
            this.addRandomBeat();
            delete this.beatsToSpawn[ thisTimer ];
        }, nextBeatTime);
        this.beatsToSpawn[ thisTimer ] = null;
    }
  }
  handleBeatScore( hit ){
    let adjustValue = null;
    if( hit ){
        adjustValue = this.scoreDeltas.hit
    } else {
        adjustValue = this.scoreDeltas.miss;
    }
    this.score += adjustValue;
    this.updateScore( adjustValue );

  }
  updateScore( deltaValue ){
    this.domElements.score.text( this.score );
    if(this.score > this.endConditions.win){
        this.win();
    } else if (this.score < this.endConditions.lose){
        this.lose();
    }
  }
  addEventHandlers(){
      $("body").on('keydown', this.handleKeyDown);
      $("body").on('keyup', this.handleKeyUp);
  }
  handleKeyDown( event ){
      const targetKey = event.key;
      if(this.bars.hasOwnProperty( targetKey ) ){
          this.bars[ targetKey ].triggerBeat();
      }
  }
  handleKeyUp( event ){
    const targetKey = event.key;
    if(this.bars.hasOwnProperty( targetKey ) ){
        this.bars[ targetKey ].releaseBeat();
    }
}
  addBar(triggerLetter) {
    const newBar = new BeatBar(this.interval, this.beatMovement, triggerLetter, this.handleBeatScore);
    this.bars[triggerLetter] = newBar;
    this.barArray.push(newBar);
    const dom = newBar.render();
    this.domElements.container.append(dom);
  }
  addBeatToBar( barID ){
      this.bars[barID].addBeat();
  }
  startGame(){
    this.running = true;
    for( let barKey in this.bars){
        this.bars[barKey].startBeatsMove();
    }
  }
  stopGame(){
      debugger;
    this.running = false;
    for( let barKey in this.bars){
        this.bars[barKey].stopBeatsMove();
    }
    for( let timerKey in this.beatsToSpawn){
        clearInterval( timerKey );
    }
  }
}
