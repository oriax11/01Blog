import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Report } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  createReport(report: Partial<Report>): Observable<Report> {
    return this.http.post<Report>(
      `${environment.apiUrl}/api/reports`,
      report,
      this.authService.getAuthHeaders()
    );
  }
}
