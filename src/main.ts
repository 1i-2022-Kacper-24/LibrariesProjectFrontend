import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { BookSearchComponent } from './app/components/book-search/book-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookSearchComponent],
  template: `
    <div class="app-container">
      <h1>Library Book Search</h1>
      <app-book-search></app-book-search>
    </div>
  `,
  styles: [`
    .app-container {
      padding: 20px;
    }
    
    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 30px;
    }
  `]
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient()
  ]
});