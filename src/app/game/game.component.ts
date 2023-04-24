import {Component, OnInit} from '@angular/core';

export enum RobotDirectionIcon {
  UP = 'arrow_upward',
  RIGHT = 'arrow_forward',
  DOWN = 'arrow_downward',
  LEFT = 'arrow_back'
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  ngOnInit(): void {
      this.resetGame();
  }
  protected readonly Array = Array;
  robotPosition = 4; // initial position of the robot
  robotDirection: RobotDirectionIcon = RobotDirectionIcon.DOWN;

  robotHitPoints: number[] = [];
  laserShot: number[] = [];

  resetGame() {
    this.robotHitPoints = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    this.robotPosition = 4; // initial position of the robot
    this.robotDirection = RobotDirectionIcon.DOWN;
  }

  rotateRobot() {
    switch (this.robotDirection) {
      case RobotDirectionIcon.DOWN: this.robotDirection = RobotDirectionIcon.LEFT; break;
      case RobotDirectionIcon.LEFT: this.robotDirection = RobotDirectionIcon.UP; break;
      case RobotDirectionIcon.UP: this.robotDirection = RobotDirectionIcon.RIGHT; break;
      case RobotDirectionIcon.RIGHT: this.robotDirection = RobotDirectionIcon.DOWN;
    }
  }

  laserEye() {
    switch (this.robotDirection) {
      case RobotDirectionIcon.DOWN: {
        for(let i = this.robotPosition+8; i < 64; i += 8) {
          this.laserShot.push(i);
        }
      }
      break;
      case RobotDirectionIcon.UP: {
        for(let i = this.robotPosition - 8; i >= 0; i -= 8) {
          this.laserShot.push(i);
        }
      }
      break;
      case RobotDirectionIcon.RIGHT: {
        for(let i = this.robotPosition + 1; i % 8 !== 0; i++) {
          this.laserShot.push(i);
        }
      }
      break;
      case RobotDirectionIcon.LEFT: {
        for(let i = this.robotPosition - 1; (i+1)%8 !== 0; i--) {
          this.laserShot.push(i);
        }
      }
      break;
    }

    for(let i = 0; i < this.laserShot.length; i++) {
      setTimeout(() => {
        this.laserShot.splice(0, 1); // Remove one item from the array
      }, 50 * i);
    }
  }
  moveRobot() {
    switch (this.robotDirection) {
      case RobotDirectionIcon.DOWN: {
        if(this.robotPosition <= 56) {
          this.robotPosition += 8;
        }
      }
      break;
      case RobotDirectionIcon.UP: {
        if(this.robotPosition > 8) {
          this.robotPosition -= 8;
        }
      }
      break;
      case RobotDirectionIcon.RIGHT: {
        if((this.robotPosition + 1) % 8 !== 0) {
          this.robotPosition++;
        } else {
          console.log(this.robotPosition);
          console.log((this.robotPosition) % 8)
        }
      }
      break;
      case RobotDirectionIcon.LEFT: {
        if(this.robotPosition % 8 !== 0) {
          this.robotPosition--;
        }
      }
    }
  }

  hurtRobot() {

    for (let i = 0; i < this.robotHitPoints.length; i++) {
      const hitPoint = this.robotHitPoints[i];
      if (hitPoint === 1) {
        this.robotHitPoints[i] = 0;
        break;
      }
    }

    console.log(this.robotHitPoints);
  }
}
