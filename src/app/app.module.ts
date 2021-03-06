import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';
import { ReportComponent } from './report';

import '../styles/styles.scss';
import '../styles/headings.css';
import { ReportRestAPI } from './services/rest_services/report_rest_api.service';

import { ChartModule } from 'angular2-chartjs';
import { MomentModule } from 'angular2-moment';
import { Spinner } from './services/spinner/spinner.service';
import '../styles/_preloader.scss';
import { FullCalendarComponent } from './components/fullcalendar/fullCalendar.component';
import { OccurrencesPerDayComponent } from './components/occurrencesPerDay/occurrencesPerDay.component';
import { ApiLoaderService } from './api_loader/api_loader.service';
import { BubbleMapComponent } from './components/bubblemap/bubbleMap.component';
import { PunchcardComponent } from './components/punchcard/punchcard.component';
import { OccurrencesDetailsComponent } from './components/occurrencesDetails/occurrencesDetails.component';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    ReportComponent,
    HomeComponent,
    FullCalendarComponent,
    OccurrencesPerDayComponent,
    PunchcardComponent,
    BubbleMapComponent,
    OccurrencesDetailsComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, {useHash: true, preloadingStrategy: PreloadAllModules}),
    ChartModule,
    MomentModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    ReportRestAPI,
    Spinner,
    ApiLoaderService
  ]
})
export class AppModule {

  constructor(public appRef: ApplicationRef,
              public appState: AppState) {
  }

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
