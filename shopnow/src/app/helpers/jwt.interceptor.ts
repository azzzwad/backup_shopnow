import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { deleteCookie } from './cookie-utils';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return <any>next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // // auto logout if 401 response returned from api
                // // location.reload();
                // deleteCookie('current_session');
                // //localStorage.clear();
                // window.location.href = '/auth/signin';
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }


}
