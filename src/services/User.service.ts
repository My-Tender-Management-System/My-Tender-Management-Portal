import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { UserDto, IUser } from "../dto/User.dto";

type EntityResponseType = HttpResponse<UserDto>;
type EntityArrayResponseType = HttpResponse<UserDto[]>;

// @ts-ignore
@Injectable()
export class UserService {
    resourceUrl = environment.serverUrl;

    headers = {
        AuthToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImRhbWluZHUifQ.B8BvnQhFGX7QMJzsSH8z5mJwss3YdpHpSBH7M9Zia4k",
    };

    constructor(private http: HttpClient) {}

    createUser(user: IUser): Observable<HttpResponse<UserDto>> {
        return this.http.post<UserDto>(
            `${this.resourceUrl}/gateway/user-mgt-app1254/create/user`,
            user,
            { observe: "response", headers: this.headers }
        );
    }

    uploadFile(formData: FormData): Observable<HttpResponse<any>> {
        return this.http.post(
            `${this.resourceUrl}/gateway/user-mgt-app1254/upload/user`,
            formData,
            { observe: "response" }
        );
    }

    updateUser(user: IUser): Observable<HttpResponse<UserDto>> {
        return this.http.put<UserDto>(
            `${this.resourceUrl}/gateway/user-mgt-app1254/update/user`,
            user,
            { observe: "response", headers: this.headers }
        );
    }

    deleteUser(req?: any): Observable<HttpResponse<IUser>> {
        return this.http.delete<UserDto>(
            `${this.resourceUrl}/gateway/user-mgt-app1254/delete/user`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findUser(req?: any): Observable<HttpResponse<IUser>> {
        return this.http.get<UserDto>(
            `${this.resourceUrl}/gateway/user-mgt-app1254/find/user`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findAllUser(params: any): Observable<HttpResponse<UserDto[]>> {
        return this.http.get<UserDto[]>(
            `${this.resourceUrl}/gateway/user-mgt-app1254/findall/user`,
            { params, observe: "response", headers: this.headers }
        );
    }

    downloadFile(): Observable<HttpResponse<Blob>> {
        return this.http.get(
            `${this.resourceUrl}/gateway/user-mgt-app1254/download/user`,
            { observe: "response", responseType: "blob" }
        );
    }

    fileUpload(formData: FormData): Observable<HttpResponse<any>> {
        return this.http.post(
            `https://filedrop.cgaas.ai/FileMangerService/api/UploadToLocal`,
            formData,
            { observe: "response" }
        );
    }
}
