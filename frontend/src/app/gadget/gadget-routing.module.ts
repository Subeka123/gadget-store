import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GadgetListComponent } from './gadget-list/gadget-list.component';

const routes: Routes = [
  {path:'', component: GadgetListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GadgetRoutingModule { }
