import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { NotificationDto, INotification } from "../dto/Notification.dto";

type EntityResponseType = HttpResponse<NotificationDto>;
type EntityArrayResponseType = HttpResponse<NotificationDto[]>;

// @ts-ignore
@Injectable()
export class NotificationService {
    resourceUrl = environment.serverUrl;

    headers = {
        AuthToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImRhbWluZHUifQ.B8BvnQhFGX7QMJzsSH8z5mJwss3YdpHpSBH7M9Zia4k",
    };

    constructor(private http: HttpClient) {}

    createNotification(
        notification: INotification
    ): Observable<HttpResponse<NotificationDto>> {
        return this.http.post<NotificationDto>(
            `${this.resourceUrl}/gateway/notification-app1262/create/notification`,
            notification,
            { observe: "response", headers: this.headers }
        );
    }

    uploadFile(formData: FormData): Observable<HttpResponse<any>> {
        return this.http.post(
            `${this.resourceUrl}/gateway/notification-app1262/upload/notification`,
            formData,
            { observe: "response" }
        );
    }

    updateNotification(
        notification: INotification
    ): Observable<HttpResponse<NotificationDto>> {
        return this.http.put<NotificationDto>(
            `${this.resourceUrl}/gateway/notification-app1262/update/notification`,
            notification,
            { observe: "response", headers: this.headers }
        );
    }

    deleteNotification(req?: any): Observable<HttpResponse<INotification>> {
        return this.http.delete<NotificationDto>(
            `${this.resourceUrl}/gateway/notification-app1262/delete/notification`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findNotification(req?: any): Observable<HttpResponse<INotification>> {
        return this.http.get<NotificationDto>(
            `${this.resourceUrl}/gateway/notification-app1262/find/notification`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findAllNotification(
        params: any
    ): Observable<HttpResponse<NotificationDto[]>> {
        return this.http.get<NotificationDto[]>(
            `${this.resourceUrl}/gateway/notification-app1262/findall/notification`,
            { params, observe: "response", headers: this.headers }
        );
    }

    downloadFile(): Observable<HttpResponse<Blob>> {
        return this.http.get(
            `${this.resourceUrl}/gateway/notification-app1262/download/notification`,
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
