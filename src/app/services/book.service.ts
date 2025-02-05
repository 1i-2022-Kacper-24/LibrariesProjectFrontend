import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/library/search';
  private checkApiUrl = 'http://localhost:8080/library/check';

  constructor(private http: HttpClient) {}

  

  searchBooks(searchParams: {
    title?: string;
    author?: string;
    publicationYear?: number;
    publicationIndicator?: number;
    numberOfPages?: number;
    pagesIndicator?: number;
    cityName?: string;
    shelfNumber?: number;
  }): Observable<Book[]> {
    let params = new HttpParams();
    
    if (searchParams.title) {
      params = params.set('title', searchParams.title);
    }
    if (searchParams.author) {
      params = params.set('author', searchParams.author);
    }
    if (searchParams.publicationYear) {
      params = params.set('publicationYear', searchParams.publicationYear.toString());
    }
    if (searchParams.publicationIndicator) {
      params = params.set('publicationIndicator', searchParams.publicationIndicator.toString());
    }
    if (searchParams.numberOfPages) {
      params = params.set('numberOfPages', searchParams.numberOfPages.toString());
    }
    if (searchParams.pagesIndicator) {
      params = params.set('pagesIndicator', searchParams.pagesIndicator.toString());
    }
    if (searchParams.cityName) {
      params = params.set('cityName', searchParams.cityName.toString());
      if (searchParams.shelfNumber) {
        params = params.set('shelfNumber', searchParams.shelfNumber.toString());
      }
    }

    return this.http.get<Book[]>(this.apiUrl, { params });
  }

  checkApi(){
  return this.http.get(this.checkApiUrl);
  }
}