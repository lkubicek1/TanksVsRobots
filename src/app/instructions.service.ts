import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {ActionType, Instruction} from './instruction.model'; // Import the Instruction model

@Injectable({
  providedIn: 'root',
})
export class InstructionsService {
  private _instructions$: BehaviorSubject<Instruction[]> = new BehaviorSubject<Instruction[]>( // Add explicit type annotation
    Array.from({ length: 10 }, (_, i) => ({
      position: i + 1,
      action: ActionType.None,
    }))
  );

  private _actionTriggers = new BehaviorSubject<{ [key: string]: string }>({});
  public readonly actionTriggers$ = this._actionTriggers.asObservable();

  public readonly instructions$: Observable<Instruction[]> = this._instructions$.asObservable();

  constructor() {}

  // Add other methods to modify the data as needed
}
