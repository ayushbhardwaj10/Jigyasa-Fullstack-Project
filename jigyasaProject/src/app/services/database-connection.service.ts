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
    _sampleCode: any,
    _tagList: any
  ) {
    let requestBody = {
      author: _author,
      title: _title,
      description_: _description_,
      sampleCode: _sampleCode,
      tags: _tagList,
    };
    return this.http
      .post(this.baseURL + 'postQuestion', requestBody)
      .pipe(catchError(this.handleError));
  }
  displayQuestions(questionFilter: any, page: any) {
    let parameters = {
      filter: questionFilter,
      pageNumber: page,
    };
    return this.http
      .get(this.baseURL + 'displayAllQuestions', { params: parameters })
      .pipe(catchError(this.handleError));
  }
  tagFilteredQuestions(page: any, tagList: any) {
    let parameters = {
      pageNumber: page,
    };
    let requestBody = {
      filterTag: tagList,
    };
    return this.http
      .post(this.baseURL + 'filterByTags', requestBody, { params: parameters })
      .pipe(catchError(this.handleError));
  }
  displaySpecificQuestion(qid: any) {
    let parameters = {
      qid: qid,
    };
    return this.http
      .get(this.baseURL + 'displaySpecificQuestion', { params: parameters })
      .pipe(catchError(this.handleError));
  }
  displayComments(qid: any) {
    let parameters = {
      qid: qid,
    };
    return this.http
      .get(this.baseURL + 'displayComments', { params: parameters })
      .pipe(catchError(this.handleError));
  }
  postComment(qid: any, author: any, desc: any, code: any, commentsCount: any) {
    let requestBody = {
      qid: qid,
      author: author,
      description_: desc,
      sampleCode: code,
      commentsCount: commentsCount,
    };
    return this.http
      .post(this.baseURL + 'postComment', requestBody)
      .pipe(catchError(this.handleError));
  }
  voteQuestion(qid: any, emailID: any, vote: any,queryType:any) {
    let requestBody = {
      qid: qid,
      emailID: emailID,
      vote: vote,
      queryType : queryType
    };
    return this.http
      .post(this.baseURL + 'voteQuestion', requestBody)
      .pipe(catchError(this.handleError));
  }
  getUserVoteForQuestion(emailID:any, qid:any){
    let requestBody = {
      emailID: emailID,
      qid: qid
    };
    return this.http
      .post(this.baseURL + 'getUserVoteForQuestion', requestBody)
      .pipe(catchError(this.handleError));
  }
  voteComment(emailID: any, commentID: any, vote: any,queryType:any) {
    let requestBody = {
      emailID: emailID,
      commentID: commentID,
      vote: vote,
      queryType : queryType
    };
    return this.http
      .post(this.baseURL + 'voteComment', requestBody)
      .pipe(catchError(this.handleError));
  }
  getUserVotesForComments(emailID:any, commentIDS:any){
    let requestBody = {
      emailID: emailID,
      commentIDS: commentIDS
    };
    return this.http
      .post(this.baseURL + 'getUserVoteForComment', requestBody)
      .pipe(catchError(this.handleError));
  }
  tickQuestion(commentID:any, markStatus:any){
    let requestBody = {
      commentID: commentID,
      markStatus: markStatus
    };
    return this.http
      .post(this.baseURL + 'tickQuestion', requestBody)
      .pipe(catchError(this.handleError));
  }
}
