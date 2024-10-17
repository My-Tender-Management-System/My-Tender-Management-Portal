import {
    HttpClient,
    HttpHeaders,
    HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoleConfig } from 'src/app/layout/roleConfig/roleConfig';

@Injectable({
  providedIn: 'root'
})
export class RoleConfigService {
   constructor(private http: HttpClient) {}
  private roleConfigSubject = new BehaviorSubject<RoleConfig>({});
  roleConfig$ = this.roleConfigSubject.asObservable();

  setRoleConfig(config: RoleConfig) {
    this.roleConfigSubject.next(config);
  }

  getRoleConfig() {
    return this.roleConfigSubject.value;
  }
     SendFirstLoginEmail(req: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(
            `https://manifest.cgaas.ai/CGaaS-Manifest/api/Send/first/login/email`,
            req
        );
    }
}
