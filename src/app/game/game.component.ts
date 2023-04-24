import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {InstructionsService} from "../instructions.service";
import {ActionType, Instruction} from "../instruction.model";

export enum DirectionIcon {
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
  dataSource: Instruction[] = [];
  actionTriggers: { [key: string]: string } = {};
  maxActions = 10;

  constructor(private cd: ChangeDetectorRef, private instructionsService: InstructionsService) {

  }

  ngOnInit(): void {

    this.instructionsService.instructions$.subscribe(instructions => this.dataSource = instructions);
    this.instructionsService.actionTriggers$.subscribe(actionTriggers => this.actionTriggers = actionTriggers);
    this.instructionsService.maxActions$.subscribe(max => this.maxActions = max);

    this.resetGame();
  }
  protected readonly Array = Array;

  gameState = {
    status: 'Ready!',
    turn: 'Robot'
  }

  robotController = {
    action: 1,
    movesLeft: 10,
    nextEntity: 'Tank 1'
  }

  tank1Controller = {
    action: 1,
    movesLeft: 2,
    nextEntity: 'Tank 2'
  }

  tank2Controller = {
    action: 1,
    movesLeft: 2,
    nextEntity: 'Tank 3'
  }

  tank3Controller = {
    action: 1,
    movesLeft: 2,
    nextEntity: 'Tank 4'
  }

  tank4Controller = {
    action: 1,
    movesLeft: 2,
    nextEntity: 'Robot'
  }

  robot = {
    id: 'Robot',
    position: 4,
    direction: DirectionIcon.DOWN,
    hitPoints: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    range: 8
  }

  tank1 = {
    id: 'Tank 1',
    position: 4,
    direction: DirectionIcon.UP,
    hitPoints: [1, 1, 1, 1],
    range: 4
  }

  tank2 = {
    id: 'Tank 2',
    position: 4,
    direction: DirectionIcon.UP,
    hitPoints: [1, 1, 1, 1],
    range: 4
  }

  tank3 = {
    id: 'Tank 3',
    position: 4,
    direction: DirectionIcon.UP,
    hitPoints: [1, 1, 1, 1],
    range: 4
  }

  tank4 = {
    id: 'Tank 4',
    position: 4,
    direction: DirectionIcon.UP,
    hitPoints: [1, 1, 1, 1],
    range: 4
  }



  controller: any = {
    'Robot': this.robotController,
    'Tank 1': this.tank1Controller,
    'Tank 2': this.tank2Controller,
    'Tank 3': this.tank3Controller,
    'Tank 4': this.tank4Controller
}

  rangeDamage: number[] = [];
  mineLocations: number[] = [];
  aoeDamage: number[] = [];

  getActionDescription(): string {
    return this.dataSource[this.robotController.action - 1].action.toString();
  }

  getTriggerDescription(): string {
    return this.actionTriggers[this.getActionDescription()];
  }

  resetGame() {
    this.gameState.status = 'Ready! Robots turn...';

    this.robot.direction = DirectionIcon.DOWN;
    this.robot.position = 4;
    this.robot.hitPoints = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    this.tank1.direction = DirectionIcon.UP;
    this.tank1.position = 56;
    this.tank1.hitPoints = [1, 1, 1, 1];

    this.tank2.direction = DirectionIcon.UP;
    this.tank2.position = 58;
    this.tank2.hitPoints = [1, 1, 1, 1];

    this.tank3.direction = DirectionIcon.UP;
    this.tank3.position = 61;
    this.tank3.hitPoints = [1, 1, 1, 1];

    this.tank4.direction = DirectionIcon.UP;
    this.tank4.position = 63;
    this.tank4.hitPoints = [1, 1, 1, 1];
  }

  getAdjacentCells(centerIndex: number, radius: number) : number[] {
    const size = 8;
    const adjacentCells = [];

    const centerX = centerIndex % size;
    const centerY = Math.floor(centerIndex / size);

    const minX = Math.max(centerX - radius, 0);
    const maxX = Math.min(centerX + radius, size - 1);
    const minY = Math.max(centerY - radius, 0);
    const maxY = Math.min(centerY + radius, size - 1);

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const index = y * size + x;
        if (index !== centerIndex) {
          adjacentCells.push(index);
        }
      }
    }

    return adjacentCells;
  }

  damageEntity(entity: {hitPoints: number []}): void {
    for (let i = 0; i < entity.hitPoints.length; i++) {
      const hitPoint = entity.hitPoints[i];
      if (hitPoint === 1) {
        entity.hitPoints[i] = 0;
        break;
      }
    }
  }

  applyAoeDamage(location: number, radius: number, damageLocation: boolean = false) {
    let aoe: number[] = this.getAdjacentCells(location, radius);

    if(damageLocation) {
      if(aoe.indexOf(location) === -1) {
        aoe.push(location);
      }
    }

    Array.prototype.push.apply(this.aoeDamage, aoe);

    let entitiesToCheck: { position:number, hitPoints: number[], id: string }[] = [this.robot, this.tank1, this.tank2, this.tank3, this.tank4];

    entitiesToCheck.forEach(entity => {
      if(this.aoeDamage.indexOf(entity.position) !== -1) {
        this.damageEntity(entity);
      }
    });

    for(let i = 0; i < this.aoeDamage.length; i++) {
      setTimeout(() => {
        this.aoeDamage.splice(0, 1); // Remove one item from the array
      }, 500);
    }
  }

  applyRangeDamage(entity: { position: number, direction: DirectionIcon, hitPoints: number [], range: number, id: string}) {
    if(this.hasPermission(entity)) {
      switch (entity.direction) {
        case DirectionIcon.DOWN: {
          for(let i = entity.position + 8; i < Math.min(entity.position + (entity.range * 8), 64); i += 8) {
            this.rangeDamage.push(i);
          }
        }
          break;
        case DirectionIcon.UP: {
          for(let i = entity.position - 8; i >= Math.max(entity.position - (entity.range * 8), 0); i -= 8) {
            this.rangeDamage.push(i);
          }
        }
          break;
        case DirectionIcon.RIGHT: {
          for(let i = entity.position + 1; (i % 8 !== 0 && i <= entity.position + entity.range); i++) {
            this.rangeDamage.push(i);
          }
        }
          break;
        case DirectionIcon.LEFT: {
          for(let i = entity.position - 1; ((i + 1) % 8 !== 0 && i >= entity.position - entity.range); i--) {
            this.rangeDamage.push(i);
          }
        }
          break;
      }

      let entitiesToCheck: { position:number, hitPoints: number[] }[] = [this.robot, this.tank1, this.tank2, this.tank3, this.tank4];

      entitiesToCheck.forEach(entity => {
        if(this.rangeDamage.indexOf(entity.position) !== -1) {
          this.damageEntity(entity);
        }
      });

      for(let i = 0; i < this.rangeDamage.length; i++) {
        setTimeout(() => {
          this.rangeDamage.splice(0, 1); // Remove one item from the array
        }, 50 * i);
      }
      this.cycleTurn(entity);
    }
  }

  placeMine() {
    if(!this.mineLocations.includes(this.robot.position)) {
      this.mineLocations.push(this.robot.position);
    }
  }

  getCurrentPositions(): number[] {
    let currentPositions: number[] = [this.robot.position, this.tank1.position, this.tank2.position, this.tank3.position, this.tank4.position];
    console.log(currentPositions);
    return currentPositions;
  }

  rotateEntity(entity: { position: number, direction: DirectionIcon, hitPoints: number [], id: string}, rotateCW: boolean = true) {
    if(this.hasPermission(entity)) {
      if(rotateCW) {
        switch (entity.direction) {
          case DirectionIcon.DOWN: entity.direction = DirectionIcon.LEFT; break;
          case DirectionIcon.LEFT: entity.direction = DirectionIcon.UP; break;
          case DirectionIcon.UP: entity.direction = DirectionIcon.RIGHT; break;
          case DirectionIcon.RIGHT: entity.direction = DirectionIcon.DOWN;
        }
      } else {
        switch (entity.direction) {
          case DirectionIcon.DOWN: entity.direction = DirectionIcon.RIGHT; break;
          case DirectionIcon.LEFT: entity.direction = DirectionIcon.DOWN; break;
          case DirectionIcon.UP: entity.direction = DirectionIcon.LEFT; break;
          case DirectionIcon.RIGHT: entity.direction = DirectionIcon.UP;
        }
      }
      this.cycleTurn(entity);
      this.cd.detectChanges();
    }
  }

  moveEntity(entity: { position: number, direction: DirectionIcon, hitPoints: number [], id: string}) {
    if(this.hasPermission(entity)) {
      switch (entity.direction) {
        case DirectionIcon.DOWN: {
          if(entity.position <= 56) {
            let newPosition: number = entity.position + 8;
            if(this.getCurrentPositions().indexOf(newPosition) === -1) {
              entity.position = newPosition;
            }
          }
        }
          break;
        case DirectionIcon.UP: {
          if(entity.position > 8) {
            let newPosition: number = entity.position - 8;
            if(this.getCurrentPositions().indexOf(newPosition) === -1) {
              entity.position = newPosition;
            }
          }
        }
          break;
        case DirectionIcon.RIGHT: {
          if((entity.position + 1) % 8 !== 0) {
            let newPosition: number = entity.position + 1;
            if(this.getCurrentPositions().indexOf(newPosition) === -1) {
              entity.position = newPosition;
            }
          }
        }
          break;
        case DirectionIcon.LEFT: {
          if(entity.position % 8 !== 0) {
            let newPosition: number = entity.position - 1;
            if(this.getCurrentPositions().indexOf(newPosition) === -1) {
              entity.position = newPosition;
            }
          }
        }
      }

      let potentialMine = this.mineLocations.indexOf(entity.position);

      if(potentialMine !== -1) {
        this.mineLocations.splice(potentialMine, 1);
        this.applyAoeDamage(entity.position, 1, true);
      }
      this.cycleTurn(entity);
    }
  }

  getRobotImage(): string {
    return 'assets/robot.png';
  }

  getTankImage(tank: {direction: DirectionIcon, hitPoints: number[]}): string {
    let imageSuffix: string = tank.hitPoints[2] === 0 ? '-damaged.png' : '.png';

    switch(tank.direction) {
      case DirectionIcon.UP: return 'assets/tank-up' + imageSuffix;
      case DirectionIcon.DOWN: return 'assets/tank-down' + imageSuffix;
      case DirectionIcon.RIGHT: return 'assets/tank-right' + imageSuffix;
      case DirectionIcon.LEFT: return 'assets/tank-left' + imageSuffix;
      default: return 'assets/tank-up' + imageSuffix;
    }
  }

  executeRobotAction(): void {
    if(this.hasPermission(this.robot)) {

      switch(this.getActionDescription()) {
        case ActionType.LaserEye.toString():
          this.applyRangeDamage(this.robot);
          break;
        case ActionType.Fist.toString():
          this.applyAoeDamage(this.robot.position, 1);
          this.cycleTurn(this.robot);
          break;
        case ActionType.AtomicMine.toString():
          this.placeMine();
          this.cycleTurn(this.robot);
          break;
        case ActionType.Move.toString():
          this.moveEntity(this.robot);
          if(this.robot.position >= 56) {
            this.gameState.status = "GAME OVER: Robot wins!";
            this.gameState.turn = "GAME OVER";
            return;
          }
          break;
        case ActionType.RotateCW.toString():
          this.rotateEntity(this.robot);
          break;
        case ActionType.RotateCCW.toString():
          this.rotateEntity(this.robot, false);
          break;
      }

    }
  }

  skipAction(entity: {id:string}): void {
    if(this.hasPermission(entity)) {
      this.cycleTurn(entity);
    }
  }

  hasPermission(entity: {id:string}): boolean {
    return this.gameState.turn === entity.id;
  }

  cycleTurn(entity: {id:string}): void {
      if(this.controller[entity.id].movesLeft <= 1) {
        if(entity.id == this.robot.id) {
          this.controller[entity.id].movesLeft = this.maxActions;
        } else {
          this.controller[entity.id].movesLeft = 2;
        }

        this.gameState.turn = this.controller[entity.id].nextEntity;
      } else {
        this.controller[entity.id].movesLeft--;
        this.controller[entity.id].action++;
        if(this.controller[entity.id].action >= this.maxActions) {
          this.controller[entity.id].action = 1;
        }
      }
  }

}
