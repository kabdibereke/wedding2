import { Routes } from '@angular/router';
import { MainPageComponent } from './page/main-page/main-page.component';
import { TableComponent } from './page/table/table.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'table',
    component: TableComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  }
];
