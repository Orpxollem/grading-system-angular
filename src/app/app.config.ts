import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), importProvidersFrom(ToastrModule.forRoot({
    timeOut: 5000,
    positionClass: 'toast-top-right',
  })),
  FormsModule
]
};
