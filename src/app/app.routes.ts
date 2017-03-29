import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { ReportComponent } from './report';
import { NoContentComponent } from './no-content';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'report', component: ReportComponent },
  { path: '**',    component: NoContentComponent },
];
