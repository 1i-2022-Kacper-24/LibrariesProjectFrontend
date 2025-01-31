import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/library/search';

  constructor(private http: HttpClient) {}

  

  searchBooks(searchParams: {
    title?: string;
    author?: string;
    publicationYear?: number;
    publicationIndicator?: number;
    numberOfPages?: number;
    pagesIndicator?: number;
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

    return this.http.get<Book[]>(this.apiUrl, { params });
  }
}