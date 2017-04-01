import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { ReportComponent } from './report';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'report', component: ReportComponent },
];
