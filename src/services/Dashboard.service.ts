import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { BidBondDto, IBidBond } from "../dto/BidBond.dto";

type EntityResponseType = HttpResponse<BidBondDto>;
type EntityArrayResponseType = HttpResponse<BidBondDto[]>;

// @ts-ignore
@Injectable()
export class DashboardService {
    private apiUrl = 'http://localhost:3000/api/dashboard-counts';  // Backend API endpoint

  constructor(private http: HttpClient) { }

  // Method to get the dashboard counts
  getDashboardCounts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
