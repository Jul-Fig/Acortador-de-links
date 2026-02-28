import { Injectable, inject } from '@angular/core';
import { Url, ApiError } from '../models/url.interface'
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private http=inject(HttpClient)

  private apiUrl= 'http://localhost:3000/api/shorten'

  CreateShortUrl(originalUrl:string): Observable<Url>{
    return this.http.post<Url>(this.apiUrl, {url:originalUrl} )
    .pipe(
        catchError((error) => this.handleError(error)) 
      );

  }

  getUrl(shortCode:string):Observable<Url>{
    return this.http.get<Url>(`${this.apiUrl}/${shortCode}`)
    .pipe(
      catchError((error) => this.handleError(error)) 
    )
  }

  updateUrl(shortCode:string, newUrl:string):Observable<Url>{
    return this.http.put<Url>( `${this.apiUrl}/${shortCode}`, {url: newUrl})
    .pipe(
      catchError((error) => this.handleError(error)) 
    )
  }


  deleteUrl(shortCode:string):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${shortCode}`)
    .pipe(
    catchError((error) => this.handleError(error)) 
    )
  }

  getStatsUrl(shortCode:string): Observable<Url>{
    return this.http.get<Url>(`${this.apiUrl}/${shortCode}/stats`)
    .pipe(
      catchError((error) => this.handleError(error))
    )
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent){
      errorMessage = ` Error:${error.error.message}`
    } else {
      const apiError = error.error as ApiError
      errorMessage = apiError.error || ` Error ${error.status}:${error.message}`
    }
    console.error('Error en la petición',errorMessage)
    return throwError(()=> new Error(errorMessage))

  }
}
