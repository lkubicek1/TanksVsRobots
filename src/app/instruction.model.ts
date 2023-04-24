export enum ActionType {
  LaserEye = 'Laser Eye',
  Fist = 'Fist',
  AtomicMine = 'Atomic Mine',
  Rotate = 'Rotate',
  Move = 'Move',
  None = ''
}

export const actionTypeDescriptions: { [key in ActionType]: string } = {
  [ActionType.None]: '',
  [ActionType.LaserEye]: 'Shoots closest target in a straight line',
  [ActionType.Fist]: 'Attacks all adjacent targets',
  [ActionType.AtomicMine]: 'Drops in Robot\'s square',
  [ActionType.Rotate]: 'Turn 90 degrees',
  [ActionType.Move]: 'Step forward 1 space',
};

export interface Instruction {
  position: number;
  action: ActionType;
}
