import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpHandler, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {configDataTpye} from '../assets/configTypeData';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


const apiURLCall="http://localhost:18731";
@Injectable()
export class AppService {
private _url: string='/assets/config.json';

  constructor(private http:HttpClient) { }

  getConfigData():Observable<configDataTpye[]>{
    return this.http.get<configDataTpye[]>(this._url).catch(this.errorHandler);   
  }

  errorHandler(error : HttpErrorResponse){
    return Observable.throw(error.message || "Server Error");
  };

}
