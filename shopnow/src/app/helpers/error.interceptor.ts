import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private toast:ToastrService , private spinner: NgxSpinnerService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status != null) {
                const error = err.error.Message || err.statusText;
                this.spinner.hide();
                this.toast.error(error);
            }

            const error = err?err:"Corrupted Data";
            this.spinner.hide();
            return throwError(error);
        }));
    }
}
