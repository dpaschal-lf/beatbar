class BeatBar {
    constructor(beatInterval, beatMovement, letterToWatch, scoreCallback) {
      this.handleBeatMove = this.handleBeatMove.bind(this);
      this.handleBeatDie = this.handleBeatDie.bind(this); 
      this.triggerBeat = this.triggerBeat.bind(this);
      this.releaseBeat = this.releaseBeat.bind(this);
      this.scoreCallback = scoreCallback;
      this.beats = [];
      this.triggerLetter = letterToWatch;
      this.domElements = {
        bar: null,
        line: null,
        triggerPoint: null,
        triggerPointLabel: null
      };
      this.beatInterval = beatInterval;
      this.beatMovement = beatMovement;
    }
    getBeatUnderTrigger(){
        const triggerPosition = this.domElements.triggerPoint.position();
        const triggerHeight = this.domElements.triggerPoint.height();
        const halfHeight = Math.floor( triggerHeight / 2);
        const middle = triggerPosition.top + halfHeight;
        const beatRange = {
            top: triggerPosition.top,
            bottom: triggerPosition.top + triggerHeight
        }
        let currentBeatIndex = this.beats.length - 1;
        while(currentBeatIndex >=0 && this.beats[currentBeatIndex].getPosition().bottom > beatRange.top){
            let position = this.beats[currentBeatIndex].getPosition();
            if( position.bottom > middle && middle > position.top ){
                if(!this.beats[currentBeatIndex].isHit){
                    return this.beats[currentBeatIndex];
                }
            }
            currentBeatIndex--;
        }
        return false;
    }
    triggerBeat(){
        this.domElements.triggerPoint.addClass('active');
        const triggeredBeat = this.getBeatUnderTrigger();
        if(triggeredBeat){
            triggeredBeat.hitBeat();
            this.scoreCallback(true);
            return;
        }
        this.scoreCallback(false);
    }
    releaseBeat(){
        this.domElements.triggerPoint.removeClass('active');

    }
    addBeat() {
      const newBeat = new Beat(
          this.beatInterval, 
          this.beatMovement,
          this.handleBeatMove,
          this.handleBeatDie
      );
      this.beats.unshift(newBeat);
      const dom = newBeat.render();
      this.domElements.line.append(dom);
      newBeat.startMove();
    }
    handleBeatMove( beatObj ){
        const endY = this.domElements.bar.height();
        const beatTPosition = beatObj.getPosition().top;
        if(beatTPosition > endY ){
            beatObj.die();
        }
    }
    handleBeatDie( beatObj ){
        if(!beatObj.isHit){
            this.scoreCallback(false);
        }
        const beatIndex = this.beats.indexOf( beatObj );
        this.beats.splice( beatIndex );
    }
    startBeatsMove() {
      this.beats.forEach(beat => beat.startMove());
    }
    stopBeatsMove() {
      this.beats.forEach(beat => beat.endMove());
    }
    render() {
      this.domElements.bar = $("<div>").addClass("beatBar");
      this.domElements.line = $("<div>").addClass("beatLine");
      this.domElements.triggerPoint = $("<div>").addClass("triggerPoint");
      this.domElements.triggerPointLabel = $("<section>").text(this.triggerLetter);
      this.domElements.triggerPoint.append(this.domElements.triggerPointLabel);
      this.domElements.bar.append(
        this.domElements.line,
        this.domElements.triggerPoint
      );
      return this.domElements.bar;
    }
  }
  