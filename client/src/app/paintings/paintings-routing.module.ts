import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaintingsListComponent } from './paintings-list/paintings-list.component';
import { PaintingDetailsComponent } from './painting-details/painting-details.component';
import { AddPaintingComponent } from './add-painting/add-painting.component';

import { CanActivateFn } from '@angular/router';
import { AuthGuardService } from '../authGuardService';

const routes: Routes = [

  { path: 'paintings', component: PaintingsListComponent },
  { path: 'paintings/:paintingId', component: PaintingDetailsComponent },
  { path: 'add', component: AddPaintingComponent, canActivate: [AuthGuardService]},
  
  
];

@NgModule({

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaintingsRoutingModule { }