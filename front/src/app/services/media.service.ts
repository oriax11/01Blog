import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment';
import { AuthService } from './auth.service';

export interface MediaUploadResponse {
  id: number;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  temporary: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MediaUploadService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Upload file to backend temporary storage
   */
  uploadFile(file: File, userId: number): Observable<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<MediaUploadResponse>(
      `${environment.apiUrl}/api/media/upload`,
      formData,
      this.authService.getAuthHeaders()
    );
  }

  /**
   * Get user's temporary uploads
   */
  getTemporaryUploads(userId: number): Observable<MediaUploadResponse[]> {
    return this.http.get<MediaUploadResponse[]>(
      `${environment.apiUrl}/api/temp`,
      this.authService.getAuthHeaders()
    );
  }

  /**
   * Delete temporary file
   */
  deleteTemporaryFile(fileUrl: string, userId: number): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/api/temp?fileUrl=${encodeURIComponent(fileUrl)}`,
      this.authService.getAuthHeaders()
    );
  }
}
