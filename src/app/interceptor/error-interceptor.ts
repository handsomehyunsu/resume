import {
    HttpRequest,
    HttpHandler,
    HttpErrorResponse,
    HttpInterceptor
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ErrorComponent } from '../components/error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) {}

    intercept(req: HttpRequest<any>, next: HttpHandler){
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log("error interceptor error " + error.error.message);
                let errorMessage = "unknown error";
                if(error.error.message){
                    errorMessage = error.error.message;
                    console.log("애미뒤진에러 도대체 어디야 " + errorMessage);
                }
                console.log("error?!");
                this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
                
                return throwError(error);
            })
        );
    }
}