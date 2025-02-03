import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BookService } from "../../services/book.service";
import { Book } from "../../models/book";
import { Library } from "../../models/library";
import { LibraryService } from "../../services/library.service";
import { Shelf } from "../../models/shelf";

@Component({
  selector: "app-book-search",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Book Search</h2>

      <div *ngIf="connectionError" class="error-message">
        <p>⚠️ Unable to connect to the library service</p>
        <p>Please ensure:</p>
        <ul>
          <li>The backend server is running</li>
          <li>It's accessible at localhost:8080</li>
          <li>CORS is properly configured</li>
        </ul>
        <button (click)="retryConnection()" class="retry-button">
          Try Again
        </button>
      </div>

      <div class="search-form">
        <div class="form-group">
          <label for="title">Title:</label>
          <input
            id="title"
            type="text"
            [(ngModel)]="searchParams.title"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="author">Author:</label>
          <input
            id="author"
            type="text"
            [(ngModel)]="searchParams.author"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="year">Publication Year:</label>
          <input
            id="year"
            type="number"
            [(ngModel)]="searchParams.publicationYear"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="publicationIndicator">Search by year:</label>
          <select
            id="pubYearDropdown"
            [(ngModel)]="searchParams.publicationIndicator"
            class="indicator-button"
          >
            <option value="-1">Older than year selected</option>
            <option value="0">From selected year</option>
            <option value="1">Newer than selected year</option>
          </select>
        </div>

        <div class="form-group">
          <label for="pages">Number of Pages:</label>
          <input
            id="pages"
            type="number"
            [(ngModel)]="searchParams.numberOfPages"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="pagesIndicator">Search by pages:</label>

          <select
            id="pagesDropdown"
            [(ngModel)]="searchParams.pagesIndicator"
            class="indicator-button"
          >
            <option value="-1">Less pages than number selected</option>
            <option value="0">Pages equal to number selected</option>
            <option value="1">More pages than number selected</option>
          </select>
        </div>

        <div *ngIf="!connectionError" class="form-group">
          <label for="pagesIndicator">Search by library:</label>
          <select
            [(ngModel)]="selectedLibrary"
            (change)="onLibraryChange()"
            class="indicator-button"
          >
            <option value="">Select a Library</option>
            <option *ngFor="let library of libraries" [ngValue]="library">
              {{ library.cityName }}
            </option>
          </select>
          <div *ngIf="selectedLibrary">
            <label for="pagesIndicator">Search by shelf:</label>
            <select
              [(ngModel)]="selectedShelf"
              (change)="onShelfChange()"
              class="indicator-button"
            >
              <option value="">Select a Shelf</option>
              <option
                *ngFor="let shelf of selectedLibrary.shelfList"
                [ngValue]="shelf"
              >
                {{ shelf.shelfNumber }}
              </option>
            </select>
          </div>
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
          <p><strong>Library City:</strong> {{ book.cityName }}</p>
        </div>
      </div>

      <p *ngIf="error" class="error">{{ error }}</p>
      <div></div>
    </div>
  `,
  styles: [
    `
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
        background: rgb(255, 145, 0);
        color: black;
        border: none;
        padding: 10px 20px;
        border-radius: 40px;
        cursor: pointer;
        margin: 10px;
      }

      .indicator-button:hover {
        background: rgb(255, 172, 77);
      }

      .book-card {
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 15px;
      }

      .error {
        color: red;
        padding: 10px;
        background: #ffe6e6;
        border-radius: 4px;
      }
    `,
  ],
})
export class BookSearchComponent implements OnInit {
  searchParams = {
    title: "",
    author: "",
    publicationYear: null as number | null,
    publicationIndicator: 0 as number,
    numberOfPages: null as number | null,
    pagesIndicator: 0 as number,
    cityName: "",
    shelfNumber: null as number | null,
  };

  libraries: Library[] = [];
  selectedLibrary: Library | null = null;
  selectedShelf: Shelf | null = null;
  connectionError = false;

  books: Book[] = [];
  error = "";

  constructor(
    private bookService: BookService,
    private libraryService: LibraryService
  ) {}

  ngOnInit() {
    this.loadLibraries();
  }

  loadLibraries() {
    this.connectionError = false;
    this.libraryService.getAllLibraries().subscribe({
      next: (data) => {
        this.libraries = data;
        this.connectionError = false;
      },
      error: (error) => {
        console.error("Error loading libraries:", error);
        this.connectionError = true;
        this.libraries = [];
        this.selectedLibrary = null;
      },
    });
  }

  retryConnection() {
    this.loadLibraries();
  }

  onLibraryChange() {
    console.log("Selected library:", this.selectedLibrary);
  }
  onShelfChange() {
    console.log("Selected shelf:", this.selectedShelf);
  }

  searchBooks() {
    if (!this.isValidSearch()) {
      this.error = "Please fill at least one search field";
      return;
    }

    this.error = "";
    const params = this.getValidParams();

    this.bookService.searchBooks(params).subscribe({
      next: (results) => {
        this.books = results;
        if (results.length === 0) {
          this.error = "No books found";
        }
      },
      error: (error) => {
        this.error = "Error searching for books. Please try again.";
        console.error("Search error:", error);
      },
    });
  }

  private isValidSearch(): boolean {
    return !!(
      this.searchParams.title ||
      this.searchParams.author ||
      this.searchParams.publicationYear ||
      this.searchParams.publicationIndicator ||
      this.searchParams.numberOfPages ||
      this.searchParams.pagesIndicator ||
      this.selectedLibrary?.cityName ||
      this.selectedShelf?.shelfNumber
    );
  }

  private getValidParams() {
    const params: any = {};
    if (this.searchParams.title) 
      params.title = this.searchParams.title;
    if (this.searchParams.author) 
      params.author = this.searchParams.author;
    if (this.searchParams.publicationYear)
      params.publicationYear = this.searchParams.publicationYear;
    if (this.searchParams.publicationIndicator !== null)
      params.publicationIndicator = this.searchParams.publicationIndicator;
    if (this.searchParams.numberOfPages)
      params.numberOfPages = this.searchParams.numberOfPages;
    if (this.searchParams.pagesIndicator !== null)
      params.pagesIndicator = this.searchParams.pagesIndicator;
    if (this.selectedLibrary !== null)
      params.cityName = this.selectedLibrary?.cityName
    if (this.selectedShelf !== null)
      params.shelfNumber = this.selectedShelf?.shelfNumber
    return params;
  }
}
