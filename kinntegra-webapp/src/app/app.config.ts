import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { importProvidersFrom } from '@angular/core';
import { environment } from '../environments/environment';

const config: SocketIoConfig = { url: environment.REAL_COMM_URL, options: {} };

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  importProvidersFrom(SocketIoModule.forRoot(config))]
};
