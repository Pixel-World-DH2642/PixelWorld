export function sketch(p5) {
  let translateX = 0;
  let translateY = 0;
  let onPositionChange = null;

  let myCircle = new Circle();

  p5.setup = () => p5.createCanvas(400, 400, p5.WEBGL);

  p5.updateWithProps = (props) => {
    if (props.translateX !== undefined) {
      translateX = props.translateX;
      console.log(translateX);
    }
    if (props.translateY !== undefined) {
      translateY = props.translateY;
      console.log(translateY);
    }
    if (props.onPositionChange !== undefined) {
      onPositionChange = props.onPositionChange;
    }
  };

  function checkInput() {
    if (p5.keyIsDown(p5.UP_ARROW)) {
      myCircle.move(0, -1);
    } else if (p5.keyIsDown(p5.DOWN_ARROW)) {
      myCircle.move(0, 1);
    } else if (p5.keyIsDown(p5.LEFT_ARROW)) {
      myCircle.move(-1, 0);
    } else if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      myCircle.move(1, 0);
    }
  }

  function Circle() {
    let speed = 3;
    this.render = function () {
      p5.circle(translateX, translateY, 30);
    };
    this.move = function (xDir, yDir) {
      translateX += xDir * speed;
      translateY += yDir * speed;
      if (onPositionChange === null) return;
      onPositionChange({ target: { id: "x", value: translateX } });
      onPositionChange({ target: { id: "y", value: translateY } });
    };
  }

  p5.draw = () => {
    p5.background(200);
    checkInput();
    myCircle.render();
  };
}
