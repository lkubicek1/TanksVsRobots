import { Component, OnInit } from '@angular/core';
import { InstructionsService } from '../instructions.service'; // Import InstructionsService
import {ActionType, Instruction, actionTypeDescriptions} from '../instruction.model'; // Import Instruction model

@Component({
  selector: 'app-programming',
  templateUrl: './programming.component.html',
  styleUrls: ['./programming.component.css'],
})
export class ProgrammingComponent implements OnInit {
  dataSource: Instruction[] = [];
  actionTriggers: { [key: string]: string } = {};
  maxActions = 10;
  displayedColumns = ['position', 'action'];
  actionTypes = Object.values(ActionType);
  actionDescriptions = actionTypeDescriptions;

  constructor(private instructionsService: InstructionsService) {}

  ngOnInit(): void {
    this.instructionsService.instructions$.subscribe(instructions => this.dataSource = instructions);
    this.instructionsService.actionTriggers$.subscribe(actionTriggers => this.actionTriggers = actionTriggers);
    this.instructionsService.maxActions$.subscribe(max => this.maxActions = max);
  }
}
