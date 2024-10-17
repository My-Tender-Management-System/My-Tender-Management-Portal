import {HttpClient, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../environments/environment";
import { EvaluationCommitteeDto, IEvaluationCommittee } from "../dto/EvaluationCommittee.dto";

type EntityResponseType = HttpResponse<EvaluationCommitteeDto>;
type EntityArrayResponseType = HttpResponse<EvaluationCommitteeDto[]>;

// @ts-ignore
@Injectable()
export class EvaluationCommitteeService {

    resourceUrl = environment.serverUrl

    headers = {
        AuthToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImRhbWluZHUifQ.B8BvnQhFGX7QMJzsSH8z5mJwss3YdpHpSBH7M9Zia4k"
    }

    constructor(private http: HttpClient) { }
    

    
    
    
        createEvaluationCommittee(evaluationcommittee: IEvaluationCommittee): Observable<HttpResponse<EvaluationCommitteeDto>> {
            
            return this.http.post<EvaluationCommitteeDto>(`${this.resourceUrl}/gateway/tenderrequirement-app1260/create/evaluationcommittee`, evaluationcommittee, { observe: 'response', headers: this.headers });
            
        }

        uploadFile(formData: FormData): Observable<HttpResponse<any>> {
                
                return this.http.post(`${this.resourceUrl}/gateway/tenderrequirement-app1260/upload/evaluationcommittee`,formData,{ observe: 'response' });
                
        }
    


    

    

    

    

    

    

    

    

    

    

    

    


    

    
    
    
    


    
        updateEvaluationCommittee(evaluationcommittee: IEvaluationCommittee): Observable<HttpResponse<EvaluationCommitteeDto>> {
             
             return this.http.put<EvaluationCommitteeDto>(`${this.resourceUrl}/gateway/tenderrequirement-app1260/update/evaluationcommittee`, evaluationcommittee, { observe: 'response', headers: this.headers });
             
        }
    

    

    

    

    

    

    

    

    

    

    

    


    

    
    
    
    


    

    

    

    

    

    

    

    

    

    

    
    deleteEvaluationCommittee(req?: any): Observable<HttpResponse<IEvaluationCommittee>> {
             
              return this.http.delete<EvaluationCommitteeDto>(`${this.resourceUrl}/gateway/tenderrequirement-app1260/delete/evaluationcommittee`, { params: req, observe: 'response', headers: this.headers });
             
    }
    

    


    

    
    
    
    


    

    

    

    

    

    

    

    

    

    
    findEvaluationCommittee(req?: any): Observable<HttpResponse<IEvaluationCommittee>> {
            
             return this.http.get<EvaluationCommitteeDto>(`${this.resourceUrl}/gateway/tenderrequirement-app1260/find/evaluationcommittee`, { params: req, observe: 'response', headers: this.headers });
             
    }
    

    

    


    

    
    
    
    


    

    

    
    findAllEvaluationCommittee(params: any): Observable<HttpResponse<EvaluationCommitteeDto[]>> {
            
            return this.http.get<EvaluationCommitteeDto[]>(`${this.resourceUrl}/gateway/tenderrequirement-app1260/findall/evaluationcommittee`, { params, observe: 'response', headers: this.headers });
            
    }

    downloadFile(): Observable<HttpResponse<Blob>> {
        
        return this.http.get(`${this.resourceUrl}/gateway/tenderrequirement-app1260/download/evaluationcommittee`, { observe: 'response', responseType: "blob" });
        
    }
    

    

    

    

    

    

    

    

    

    


    

    
    
    
    


    

    
        fileUpload(formData: FormData): Observable<HttpResponse<any>> {
                return this.http.post(`https://filedrop.cgaas.ai/FileMangerService/api/UploadToLocal`,formData,{ observe: 'response' });
        }
    

    

    

    

    

    

    

    

    

    

    


    

    
    
    
    


    

    

    

    

    

    

    

    

    

    

    

    


    

    
    
    
    


    

    

    

    

    

    
    
    findAllIfEvaluationCommitteeByTenderId(params: any): Observable<HttpResponse<EvaluationCommitteeDto[]>> {
            
            return this.http.get<EvaluationCommitteeDto[]>(`${this.resourceUrl}/gateway/tenderrequirement-app1260/findallif/evaluationcommitteebytenderid/tenderid`, { params, observe: 'response', headers: this.headers });
            
    }
    
    

    

    

    

    

    

    


    

    
    


}
