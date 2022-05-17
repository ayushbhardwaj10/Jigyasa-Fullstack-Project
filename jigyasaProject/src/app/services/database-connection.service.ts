import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DatabaseConnectionService {
  constructor(private http: HttpClient) {}

  baseURL = environment.baseURL;

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  createUser(_email: any, _userName: any, _password: any) {
    let requestBody = {
      emailID: _email,
      userName: _userName,
      password: _password,
    };
    return this.http
      .post(this.baseURL + 'createUser', requestBody)
      .pipe(catchError(this.handleError));
  }
}
