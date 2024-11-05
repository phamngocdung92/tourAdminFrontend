import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadTour(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'shopdemo');
    data.append('cloud_name', 'shopdemo');
    return this.http.post('https://api.cloudinary.com/v1_1/shopdemo/image/upload', data)
  }

  uploadCustomer(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'shopdemo');
    data.append('cloud_name', 'shopdemo');
    return this.http.post('https://api.cloudinary.com/v1_1/shopdemo/image/upload', data)
  }
}
