import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProcessHttpmsgService } from './process-httpmsg.service';
import { Leader } from '../shared/leader';
import { baseURL } from '../shared/baseurl'

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(
    private http: HttpClient,
    private processHttpmsgService: ProcessHttpmsgService
  ) { }

  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leadership')
    .pipe(catchError(this.processHttpmsgService.handleError))
  }

  getLeaderEC(): Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership/3')
    .pipe(catchError(this.processHttpmsgService.handleError))
  }
}
