import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfficeTableComponent } from './components/office/office-table/office-table.component';
import { EmployeeTableComponent } from './components/employee/employee-table/employee-table.component';
import { TagTableComponent } from './components/tag/tag-table/tag-table.component';

const routes: Routes = [
  { path: 'offices', component: OfficeTableComponent },
  { path: 'employees', component: EmployeeTableComponent },
  { path: 'tags', component: TagTableComponent },
  { path: '', redirectTo: 'employees', pathMatch: 'full' }
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
