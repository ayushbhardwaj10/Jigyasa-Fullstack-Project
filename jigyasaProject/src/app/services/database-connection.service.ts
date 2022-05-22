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
    return throwError(error);
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
  emailExists(_email: any) {
    let requestBody = {
      emailID: _email,
    };
    return this.http
      .post(this.baseURL + 'isEmailExist', requestBody)
      .pipe(catchError(this.handleError));
  }
  validatepassword(_email: any, _password: any) {
    let requestBody = {
      emailID: _email,
      password: _password,
    };
    return this.http
      .post(this.baseURL + 'loginUser', requestBody)
      .pipe(catchError(this.handleError));
  }
  postQuestion(
    _author: any,
    _title: any,
    _description_: any,
    _sampleCode: any
  ) {
    let requestBody = {
      author: _author,
      title: _title,
      description_: _description_,
      sampleCode: _sampleCode,
      tags: ['deep-l', 'nlp', 'high-performance'],
    };
    return this.http
      .post(this.baseURL + 'postQuestion', requestBody)
      .pipe(catchError(this.handleError));
  }
  fetchAllQuestions() {
    return this.http
      .get(this.baseURL + 'displayAllQuestions')
      .pipe(catchError(this.handleError));
  }
}
