import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProcessHttpmsgService } from './process-httpmsg.service';
import { Feedback } from '../shared/feedback';
import { baseURL } from '../shared/baseurl'

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
    private http: HttpClient,
    private processHttpmsgService: ProcessHttpmsgService
  ) { }

  getFeedback(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(baseURL + 'feedback')
    .pipe(catchError(this.processHttpmsgService.handleError))
  }

  postFeedback(feedback?: Feedback): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<Feedback>(baseURL + 'feedback/', feedback, httpOptions)
      .pipe(catchError(this.processHttpmsgService.handleError));

  }
}
