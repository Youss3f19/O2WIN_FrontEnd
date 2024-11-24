import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { InMemoryScrollingOptions, provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';


const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',      
};

const inMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, inMemoryScrollingFeature), 
    provideHttpClient()]
};
