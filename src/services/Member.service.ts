import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { MemberDto, IMember } from "../dto/Member.dto";

type EntityResponseType = HttpResponse<MemberDto>;
type EntityArrayResponseType = HttpResponse<MemberDto[]>;

// @ts-ignore
@Injectable()
export class MemberService {
    resourceUrl = environment.serverUrl;

    headers = {
        AuthToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImRhbWluZHUifQ.B8BvnQhFGX7QMJzsSH8z5mJwss3YdpHpSBH7M9Zia4k",
    };

    constructor(private http: HttpClient) {}

    createMember(member: IMember): Observable<HttpResponse<MemberDto>> {
        return this.http.post<MemberDto>(
            `${this.resourceUrl}/gateway/tender-app1256/create/member`,
            member,
            { observe: "response", headers: this.headers }
        );
    }

    uploadFile(formData: FormData): Observable<HttpResponse<any>> {
        return this.http.post(
            `${this.resourceUrl}/gateway/tender-app1256/upload/member`,
            formData,
            { observe: "response" }
        );
    }

    updateMember(member: IMember): Observable<HttpResponse<MemberDto>> {
        return this.http.put<MemberDto>(
            `${this.resourceUrl}/gateway/tender-app1256/update/member`,
            member,
            { observe: "response", headers: this.headers }
        );
    }

    deleteMember(req?: any): Observable<HttpResponse<IMember>> {
        return this.http.delete<MemberDto>(
            `${this.resourceUrl}/gateway/tender-app1256/delete/member`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findMember(req?: any): Observable<HttpResponse<IMember>> {
        return this.http.get<MemberDto>(
            `${this.resourceUrl}/gateway/tender-app1256/find/member`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findAllMember(params: any): Observable<HttpResponse<MemberDto[]>> {
        return this.http.get<MemberDto[]>(
            `${this.resourceUrl}/gateway/tender-app1256/findall/member`,
            { params, observe: "response", headers: this.headers }
        );
    }

    findAllMemberForList(params: any): Observable<HttpResponse<{ filteredMembers: MemberDto[]; otherMembers: MemberDto[] }>> {
        return this.http.get<{ filteredMembers: MemberDto[]; otherMembers: MemberDto[] }>(
            `${this.resourceUrl}/gateway/tender-app1256/findall/member`,
            { params, observe: 'response', headers: this.headers }
        );
    }

    downloadFile(): Observable<HttpResponse<Blob>> {
        return this.http.get(
            `${this.resourceUrl}/gateway/tender-app1256/download/member`,
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

    findAllIfMemberByTenderTeamId(
        params: any
    ): Observable<HttpResponse<MemberDto[]>> {
        return this.http.get<MemberDto[]>(
            `${this.resourceUrl}/gateway/tender-app1256/findallif/memberbytenderteamid/tenderteamid`,
            { params, observe: "response", headers: this.headers }
        );
    }
}
