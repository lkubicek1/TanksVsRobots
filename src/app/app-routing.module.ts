import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstructionsComponent } from './instructions/instructions.component';
import { GameComponent } from './game/game.component';
import { ProgrammingComponent } from './programming/programming.component';

const routes: Routes = [
  { path: 'instructions', component: InstructionsComponent },
  { path: 'game', component: GameComponent },
  { path: 'programming', component: ProgrammingComponent },
  { path: '', redirectTo: '/instructions', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
