class Beat {
    constructor(
        /*number*/ interval, 
        /*object{left, top}*/ moveDirections, 
        /*function */moveCallback,
        /*function */dieCallback
      ) {
      this.move = this.move.bind(this);
      this.moveCallback = moveCallback;
      this.dieCallback = dieCallback;
      this.domElements = {
        container: null
      };
      this.isHit = false
      this.position = {
          left: 0,
          top: 0,
          bottom: 0
      }
      this.moveDirections = moveDirections;
      this.timer = null;
      this.timerInterval = interval;
    }
    endMove() {
      clearInterval(this.timer);
      this.timer = null;
    }
    startMove() {
      this.endMove();
      this.timer = setInterval(this.move, this.timerInterval);
    }
    hitBeat(){
        this.isHit = true;
        this.domElements.container.addClass('hit');
    }
    move() {
      this.position.left += this.moveDirections.left;
      this.position.top += this.moveDirections.top;
      this.position.bottom = this.position.top + this.domElements.container.height()
      this.domElements.container.css({
        left:  this.position.left + "px",
        top: this.position.top + "px"
      });
      this.moveCallback(this);
    }
    getPosition(){
        return this.position;
    }
    die(){
        this.endMove();
        this.domElements.container.remove();
        this.dieCallback(this);
    }
    render() {
      this.domElements.container = $("<div>").addClass("beatContainer");
      return this.domElements.container;
    }
  }
  