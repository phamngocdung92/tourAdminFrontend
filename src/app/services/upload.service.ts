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
    data.append('upload_preset', 'tour-image');
    data.append('cloud_name', 'slack');
    return this.http.post('LinkImage', data)
  }

  uploadCustomer(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'user-image');
    data.append('cloud_name', 'slack');
    return this.http.post('LinkImage', data)
  }
}
