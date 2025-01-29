import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Book Search</h2>
      
      <div class="search-form">
        <div class="form-group">
          <label for="title">Title:</label>
          <input id="title" type="text" [(ngModel)]="searchParams.title" class="form-control">
        </div>

        <div class="form-group">
          <label for="author">Author:</label>
          <input id="author" type="text" [(ngModel)]="searchParams.author" class="form-control">
        </div>

        <div class="form-group">
          <label for="year">Publication Year:</label>
          <input id="year" type="number" [(ngModel)]="searchParams.publicationYear" class="form-control">
        </div>

        <div class="form-group">
          <label for="pages">Number of Pages:</label>
          <input id="pages" type="number" [(ngModel)]="searchParams.numberOfPages" class="form-control">
        </div>

        <div class="form-group">
          <label for="pagesIndicator">Please select one:</label>
          <button (click)="setPagesIndicator(-1)" class="indicator-button">Pages less than</button>
          <button (click)="setPagesIndicator(0)" class="indicator-button">Pages equal to</button>
          <button (click)="setPagesIndicator(1)" class="indicator-button">Pages more than</button>
        </div>

        <button (click)="searchBooks()" class="search-button">Search</button>
      </div>

      <div class="results" *ngIf="books.length > 0">
        <h3>Search Results</h3>
        <div class="book-card" *ngFor="let book of books">
          <h4>{{ book.title }}</h4>
          <p><strong>Author:</strong> {{ book.author }}</p>
          <p><strong>Publication Year:</strong> {{ book.publicationYear }}</p>
          <p><strong>Number of Pages:</strong> {{ book.numberOfPages }}</p>
          <p><strong>Shelf Number:</strong> {{ book.shelfNumber }}</p>
          <p><strong>Library City:</strong> {{ book.city }}</p>
        </div>
      </div>

      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .search-form {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
    }

    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .search-button {
      background: #007bff;
      color: black;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }

    .search-button:hover {
      background: #0056b3;
    }

    .indicator-button {
      background:rgb(255, 0, 0);
      color: black;
      border: none;
      padding: 10px 20px;
      border-radius: 40px;
      cursor: pointer;
      margin: 10px;
    }

    .indicator-button:hover {
      background:rgb(179, 0, 0);
    }

    .book-card {
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 15px;
    }

    .error {
      color: red;
      padding: 10px;
      background: #ffe6e6;
      border-radius: 4px;
    }
  `]
})
export class BookSearchComponent {
  searchParams = {
    title: '',
    author: '',
    publicationYear: null as number | null,
    numberOfPages: null as number | null,
    pagesIndicator: null as number | null
  };

  books: Book[] = [];
  error = '';

  constructor(private bookService: BookService) {}

  pagesIndicator: number = 0;

  setPagesIndicator(value: number): void {
    this.pagesIndicator = value;
    this.searchBooks();
  }

  searchBooks() {
    if (!this.isValidSearch()) {
      this.error = 'Please fill at least one search field';
      return;
    }

    this.error = '';
    const params = this.getValidParams();

    this.bookService.searchBooks(params).subscribe({
      next: (results) => {
        this.books = results;
        if (results.length === 0) {
          this.error = 'No books found';
        }
      },
      error: (error) => {
        this.error = 'Error searching for books. Please try again.';
        console.error('Search error:', error);
      }
    });
  }

  private isValidSearch(): boolean {
    return !!(
      this.searchParams.title ||
      this.searchParams.author ||
      this.searchParams.publicationYear ||
      this.searchParams.numberOfPages ||
      this.searchParams.pagesIndicator
    );
  }

  private getValidParams() {
    const params: any = {};
    if (this.searchParams.title) params.title = this.searchParams.title;
    if (this.searchParams.author) params.author = this.searchParams.author;
    if (this.searchParams.publicationYear) params.publicationYear = this.searchParams.publicationYear;
    if (this.searchParams.numberOfPages) params.numberOfPages = this.searchParams.numberOfPages;
    if (this.searchParams.pagesIndicator) params.pagesIndicator = this.searchParams.pagesIndicator
    return params;
  }
}