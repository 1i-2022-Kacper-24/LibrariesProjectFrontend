import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Library } from '../models/library';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private apiUrl = 'http://localhost:8080/library/allLibraries';

  constructor(private http: HttpClient) {}

  getAllLibraries(): Observable<Library[]> {
    return this.http.get<Library[]>(this.apiUrl);
  }
}