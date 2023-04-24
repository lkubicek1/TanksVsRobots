export enum ActionType {
  LaserEye = 'Laser Eye',
  Fist = 'Fist',
  AtomicMine = 'Atomic Mine',
  RotateCW = 'Rotate CW',
  RotateCCW = 'Rotate CCW',
  Move = 'Move',
  None = ''
}

export const actionTypeDescriptions: { [key in ActionType]: string } = {
  [ActionType.None]: '',
  [ActionType.LaserEye]: 'Shoots closest target in a straight line',
  [ActionType.Fist]: 'Attacks all adjacent targets',
  [ActionType.AtomicMine]: 'Drops in Robot\'s square',
  [ActionType.RotateCW]: 'Turn 90 degrees clockwise',
  [ActionType.RotateCCW]: 'Turn 90 degrees counter clockwise',
  [ActionType.Move]: 'Step forward 1 space',
};

export interface Instruction {
  position: number;
  action: ActionType;
}
