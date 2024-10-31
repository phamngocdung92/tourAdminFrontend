import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tour } from '../common/Tour';

@Injectable({
  providedIn: 'root'
})
export class TourService {

  url = "http://localhost:8080/api/tours";

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get(this.url);
  }

  getOne(id: number) {
    return this.httpClient.get(this.url + '/' + id);
  }

  getBestSeller() {
    return this.httpClient.get(this.url + '/bestseller-admin');
  }

  save(tour: Tour) {
    return this.httpClient.post(this.url, tour);
  }

  update(tour: Tour, id: number) {
    return this.httpClient.put(this.url + '/' + id, tour);
  }

  delete(id: number) {
    return this.httpClient.delete(this.url + '/' + id);
  }
}
