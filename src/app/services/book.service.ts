import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  url = "http://localhost:8080/api/books";

  urlBookDetail = "http://localhost:8080/api/bookDetail";

  constructor(private httpClient: HttpClient) { }

  get() {
    return this.httpClient.get(this.url);
  }

  getById(id:number) {
    return this.httpClient.get(this.url+'/'+id);
  }

  getByBook(id:number) {
    return this.httpClient.get(this.urlBookDetail+'/book/'+id);
  }

  cancel(id: number) {
    return this.httpClient.get(this.url+'/cancel/'+id);
  }

  confirm(id: number) {
    return this.httpClient.get(this.url+'/confirm/'+id);
  }

  thanks(id: number) {
    return this.httpClient.get(this.url+'/thanks/'+id);
  }
}
