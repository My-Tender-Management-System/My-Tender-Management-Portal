// import {Component, OnInit} from '@angular/core';
// import {ActivatedRoute,Router} from '@angular/router';
// import {Table} from 'primeng/table';
// import {filter, Subscription} from "rxjs";
// import {map} from "rxjs/operators";
// import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
// import {DialogService} from "primeng/dynamicdialog";
// import {ConfirmationService, MessageService} from "primeng/api";
// import {DomSanitizer} from '@angular/platform-browser';
// import { roleConfig } from 'src/app/layout/roleConfig/roleConfig';
// import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
// import { CamelCaseToTitlePipe } from 'src/app/camel-case-to-title.pipe';
// import { ShowFilesComponent } from '../show-files/show-files.component';
// import {IMember,MemberDto} from "../../dto/Member.dto";
// import {MemberService} from "../../services/Member.service";
// import {CreateUpdateMember } from "./create-update-member/create-update-member";

// import { getDtoNameById } from 'src/app/layout/relationshipConfig/reationshipConfig';

// @Component({
//     selector: 'app-member',
//     templateUrl: './Member.component.html',
//     providers: [CamelCaseToTitlePipe]
// })

// export class MemberComponent implements OnInit {

//     MemberData: MemberDto[] = [];

//     isDataLoading: boolean = false;
//     canUpdate:boolean = true;
//     canDelete:boolean = true;
//     roleConfig=roleConfig

//     dtoName :string | undefined = ''

//     TenderTeam:string = ''

//     private subscription: Subscription = new Subscription();

//     constructor(private route:ActivatedRoute,private sanitizer: DomSanitizer,private memberService: MemberService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router,  private dialogService: DialogService, private breadcrumbService: AppBreadcrumbService, private camelCaseToTitle:CamelCaseToTitlePipe) {
//         this.breadcrumbService.setItems([
//             {label: this.camelCaseToTitle.transform('Member')},
//         ]);
//     }

//     ngOnInit() {

//         this.isDataLoading = true;
//         this.subscription.add(
//             this.route.queryParams.subscribe((params:any) => {
//                 this.dtoName = getDtoNameById(params['id'])

//                 switch(this.dtoName){

//                 case "TenderTeam":
//                     this.TenderTeam = params['primarykey'];
//                     this.findAllMemberByTenderTeamId({});
//                     break;

//                 default:
//                     this.findAllMember({});
//                     break;
//                 }
//               })
//         )

//     }

//     onGlobalFilter(table: Table, event: Event) {
//         table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
//     }

//     navigateToCreateUser() {
//         this.router.navigate(['profile/create'])
//     }

//       downloadFile() {
//         this.memberService.downloadFile().subscribe(
//             (response: HttpResponse<Blob>) => {
//                 // Extract filename from content-disposition header
//                 const contentDispositionHeader: string | null =
//                     response.headers.get('content-disposition');
//                 const filename: string = this.getFilenameFromContentDisposition(
//                     contentDispositionHeader
//                 );

//                 if (response.body) {
//                     // Create URL for the blob data
//                     const blobUrl: string = window.URL.createObjectURL(
//                         response.body
//                     );
//                     // Create an anchor element and trigger download
//                     const a = document.createElement('a');
//                     document.body.appendChild(a);
//                     a.href = blobUrl;
//                     a.download = filename;
//                     a.click();

//                     // Clean up
//                     window.URL.revokeObjectURL(blobUrl);
//                     document.body.removeChild(a);
//                 }
//                 this.messageService.add({
//                     severity: 'success',
//                     summary: 'Download Successfull',
//                     detail: ` Excel successfully downloaded.`,
//                     life: 3000,
//                 });
//             },
//             (error) => {
//                 this.messageService.add({
//                     severity: 'error',
//                     summary: 'Download Failed',
//                     detail: ` Failed to download excel.`,
//                     life: 3000,
//                 });
//             }
//         );
//     }

//     private getFilenameFromContentDisposition(header: string | null): string {
//         const today = new Date();
//         const date = today.toISOString().slice(0, 10);

//         if (!header) {
//             return 'Members_' + date + '.csv';
//         }
//         const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
//         const matches = filenameRegex.exec(header);
//         if (!matches || !matches[1]) {
//             return 'Members_' + date + '.csv';
//         }
//         return matches[1].replace(/['"]/g, '');
//     }

//     uploadFile(event: any) {
//     const file: File = event.target.files[0];
//     const formData: FormData = new FormData();
//     formData.append('file', file);

//     this.memberService.uploadFile(formData).subscribe(
//         (response) => {
//             // Handle success
//             this.messageService.add({
//                 severity: 'success',
//                 summary: 'Upload Successful',
//                 detail: `File "${file.name}" successfully uploaded.`,
//                 life: 3000,
//             });
//         },
//         (error) => {
//             // Handle error
//             this.messageService.add({
//                 severity: 'error',
//                 summary: 'Upload Failed',
//                 detail: `Failed to upload file "${file.name}".`,
//                 life: 3000,
//             });
//         }
//     );
//     }

//     //Find all Member data from db by TenderTeam
//     findAllMemberByTenderTeamId(params: any) {
//         if (this.TenderTeam){
//         this.subscription.add(
//         this.memberService.findAllIfMemberByTenderTeamId({ TenderTeamId:this.TenderTeam }).pipe(
//             filter((res: HttpResponse<IMember[]>) => res.ok),
//             map((res: HttpResponse<IMember[]>) => res.body)
//         )
//             .subscribe(
//                 (res: IMember[] | null) => {
//                     if (res != null) {
//                         this.MemberData = res;
//                     } else {
//                         this.MemberData = [];
//                     }
//                     this.isDataLoading = false;
//                 },

//                 (res: HttpErrorResponse) => console.log("error in extracting all Member", res)
//             )
//         );
//         } else {
//             this.subscription.add(
//             this.memberService.findAllMember(params).pipe(
//             filter((res: HttpResponse<IMember[]>) => res.ok),
//             map((res: HttpResponse<IMember[]>) => res.body)
//         )
//             .subscribe(
//                 (res: IMember[] | null) => {
//                     if (res != null) {
//                         this.MemberData = res;
//                     } else {
//                         this.MemberData = [];
//                     }
//                     this.isDataLoading = false;
//                 },

//                 (res: HttpErrorResponse) => console.log("error in extracting all Member", res)
//             )
//         );

//         }
//     }

//     //--find all--
//     findAllMember(params: any) {
//     this.subscription.add(
//                 this.memberService.findAllMember(params).pipe(
//                 filter((res: HttpResponse<IMember[]>) => res.ok),
//                 map((res: HttpResponse<IMember[]>) => res.body)
//             )
//                 .subscribe(
//                     (res: IMember[] | null) => {
//                         if (res != null) {
//                             this.MemberData = res;
//                         } else {
//                             this.MemberData = [];
//                         }
//                         this.isDataLoading = false;
//                     },

//                     (res: HttpErrorResponse) => console.log("error in extracting all Member", res)
//                 )
//             );
//         }

//     //dynamic dialog
//     showCreateMemberDialog() {

//             switch(this.dtoName){

//                 case "TenderTeam":
//                     this.showCreateMemberByTenderTeamDialog()
//                     break;

//                 default:

//                     break;
//                 }

//     }

//     //dynamic dialog
//     showCreateMemberByTenderTeamDialog() {
//         const ref = this.dialogService.open(CreateUpdateMember, {
//             data: { TenderTeamId:this.TenderTeam },
//             header: 'Create ' + this.camelCaseToTitle.transform('Member'),
//             width: '60%',
//             contentStyle: {
//                 "max-height": "500px",
//                 "overflow": "auto",
//                 "border-bottom-left-radius": "0.25rem",
//                 "border-bottom-right-radius": "0.25rem",
//                 "border-top-width": "1px",
//                 "border-top-style": "solid",
//                 "border-width": "0px",
//                 "border-style": "solid",
//                 "border-color": "#e4e4e4",
//                 "baseZIndex": "10000",
//                 "closable": "true"
//             }
//         })
//         ref.onClose.subscribe(() => {
//             this.findAllMemberByTenderTeamId({})
//         })
//     }

//     //dynamic dialog
//     showCreateMemberDialogDefault() {
//         const ref = this.dialogService.open(CreateUpdateMember, {
//             header: 'Create ' + this.camelCaseToTitle.transform('Member'),
//             width: '60%',
//             contentStyle: {
//                 "max-height": "500px",
//                 "overflow": "auto",
//                 "border-bottom-left-radius": "0.25rem",
//                 "border-bottom-right-radius": "0.25rem",
//                 "border-top-width": "1px",
//                 "border-top-style": "solid",
//                 "border-width": "0px",
//                 "border-style": "solid",
//                 "border-color": "#e4e4e4",
//                 "baseZIndex": "10000",
//                 "closable": "true"
//             }
//         })}

//     showEditMemberDialog(Member: MemberDto) {
//         const ref = this.dialogService.open(CreateUpdateMember , {
//             data: Member,
//            header: 'Update ' + this.camelCaseToTitle.transform('Member'),
//             width: '60%',
//             contentStyle: {
//                 "max-height": "500px",
//                 "overflow": "auto",
//                 "border-bottom-left-radius": "0.25rem",
//                 "border-bottom-right-radius": "0.25rem",
//                 "border-top-width": "1px",
//                 "border-top-style": "solid",
//                 "border-width": "0px",
//                 "border-style": "solid",
//                 "border-color": "#e4e4e4",
//                 "baseZIndex": "10000",
//                 "closable": "true"
//             }
//         })
//         ref.onClose.subscribe(() => {
//             this.findAllMember({})
//         })
//     }

//     //delete Member
//     deleteMember(Member: MemberDto) {
//         this.confirmationService.confirm({
//            message: `Are you sure that you want to delete ?`,
//             header: 'Confirmation',
//             icon: 'pi pi-exclamation-triangle',
//             accept: () => {
//                 this.ConfirmDeleteMember(Member)
//                 this.messageService.add({
//                     severity: 'error',
//                     summary: 'Deleted',
//                     detail: 'You have deleted '
//                 });
//             },
//         });
//     }
// ConfirmDeleteMember(Member: MemberDto) {
//     this.MemberData = this.MemberData.filter(val => val.MemberId !== Member.MemberId);
//     this.subscription.add(
//         this.memberService.deleteMember({ memberId: Member.MemberId }).subscribe(() => {
//         })
//     );
// }    //remove html meta data
//     removeHtmlTags(description: string): string {
//         return description.replace(/<[^>]*>/g, '');
//     }

//     hasAccess(dtoId: string, accessType: string): boolean {
//         const roleName = localStorage.getItem('roleName');

//         if (roleName !== null) {
//             // console.log(roleName);
//             const rolePermissions = roleConfig[roleName];

//             if (rolePermissions && rolePermissions[dtoId]) {
//                 if (rolePermissions[dtoId]?.includes(accessType)) {
//                     return true;
//                 } else {
//                     if (accessType == 'DELETE') {
//                         this.canDelete = false;
//                     }
//                     if (accessType == 'UPDATE') {
//                         this.canUpdate = false;
//                     }
//                 }
//             }
//         }
//         return false;
//     }

// }
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Table } from "primeng/table";
import { filter, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { DialogService } from "primeng/dynamicdialog";
import { ConfirmationService, MessageService } from "primeng/api";
import { DomSanitizer } from "@angular/platform-browser";
import { roleConfig } from "src/app/layout/roleConfig/roleConfig";
import { IMember, MemberDto } from "../../dto/Member.dto";
import { MemberService } from "../../services/Member.service";
import {CreateUpdateMember } from "./create-update-member/create-update-member";
import { SelectRelationshipComponent } from "src/app/layout/select-relationship/select-relationship.component";

import { getDtoNameById } from "src/app/layout/relationshipConfig/reationshipConfig";
import { HttpClient } from "@angular/common/http";

@Component({
    templateUrl: "./Member.component.html",
})
export class MemberComponent implements OnInit {
    MemberData: MemberDto[] = [];

    isDataLoading: boolean = false;
    canUpdate: boolean = true;
    canDelete: boolean = true;
    roleConfig = roleConfig;

    dtoName: string | undefined = "Member";

    private subscription: Subscription = new Subscription();

    constructor(
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private MemberService: MemberService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private dialogService: DialogService
    ) {}

    ngOnInit() {
        this.isDataLoading = true;
        this.findAllMember({});
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            "contains"
        );
    }

    navigateToCreateUser() {
        this.router.navigate(["profile/create"]);
    }

    downloadFile() {
        this.MemberService.downloadFile().subscribe(
            (response: HttpResponse<Blob>) => {
                // Extract filename from content-disposition header
                const contentDispositionHeader: string | null =
                    response.headers.get("content-disposition");
                const filename: string = this.getFilenameFromContentDisposition(
                    contentDispositionHeader
                );

                if (response.body) {
                    // Create URL for the blob data
                    const blobUrl: string = window.URL.createObjectURL(
                        response.body
                    );
                    // Create an anchor element and trigger download
                    const a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = blobUrl;
                    a.download = filename;
                    a.click();

                    // Clean up
                    window.URL.revokeObjectURL(blobUrl);
                    document.body.removeChild(a);
                }
                this.messageService.add({
                    severity: "success",
                    summary: "Download Successfull",
                    detail: ` Excel successfully downloaded.`,
                    life: 3000,
                });
            },
            (error) => {
                this.messageService.add({
                    severity: "error",
                    summary: "Download Failed",
                    detail: ` Failed to download excel.`,
                    life: 3000,
                });
            }
        );
    }

    private getFilenameFromContentDisposition(header: string | null): string {
        const today = new Date();
        const date = today.toISOString().slice(0, 10);

        if (!header) {
            return "Members_" + date + ".csv";
        }
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(header);
        if (!matches || !matches[1]) {
            return "Members_" + date + ".csv";
        }
        return matches[1].replace(/['"]/g, "");
    }

    uploadFile(event: any) {
        const file: File = event.target.files[0];
        const formData: FormData = new FormData();
        formData.append("file", file);

        this.MemberService.uploadFile(formData).subscribe(
            (response) => {
                // Handle success
                this.messageService.add({
                    severity: "success",
                    summary: "Upload Successful",
                    detail: `File "${file.name}" successfully uploaded.`,
                    life: 3000,
                });
            },
            (error) => {
                // Handle error
                this.messageService.add({
                    severity: "error",
                    summary: "Upload Failed",
                    detail: `Failed to upload file "${file.name}".`,
                    life: 3000,
                });
            }
        );
    }

    //--find all--
    findAllMember(params: any) {
        this.subscription.add(
            this.MemberService.findAllMember(params)
                .pipe(
                    filter((res: HttpResponse<IMember[]>) => res.ok),
                    map((res: HttpResponse<IMember[]>) => res.body)
                )
                .subscribe(
                    (res: IMember[] | null) => {
                        if (res != null) {
                            this.MemberData = res;
                        } else {
                            this.MemberData = [];
                        }
                        this.isDataLoading = false;
                    },

                    (res: HttpErrorResponse) =>
                        console.log("error in extracting all Member", res)
                )
        );
    }

    //dynamic dialog
    showCreateMemberDialog() {
        const screenWidth = window.innerWidth;
        let dialogWidth = "80%"; // Default width

        // Define width based on screen size
        if (screenWidth > 431) {
            dialogWidth = "60%"; // Adjust as needed for smaller screens
        } else {
            dialogWidth = "80%"; // Adjust as needed for larger screens
        }
        const ref = this.dialogService.open(CreateUpdateMember, {
            header: "Create Member",
            width: dialogWidth,
            closable: true,
            contentStyle: {
                "max-height": "720px",
                overflow: "auto",
                closable: "true",
            },
        });
        ref.onClose.subscribe(() => {
            this.findAllMember({});
        });
    }

    //dynamic dialog
    //  showCreateMemberDialogDefault() {
    //      const ref = this.dialogService.open(CreateUpdateMember, {
    //          header: 'Create Member',
    //          width: '60%',
    //          closable: true,
    //          contentStyle: {
    //              "max-height": "720px",
    //              "overflow": "auto",
    //              "closable": "true"
    //          }
    //      })
    //      ref.onClose.subscribe(() => {
    //          this.findAllMember({})
    //     })
    //  }

    showEditMemberDialog(Member: MemberDto) {
        const screenWidth = window.innerWidth;
        let dialogWidth = "80%"; // Default width

        // Define width based on screen size
        if (screenWidth > 431) {
            dialogWidth = "60%"; // Adjust as needed for smaller screens
        } else {
            dialogWidth = "80%"; // Adjust as needed for larger screens
        }
        const ref = this.dialogService.open(CreateUpdateMember, {
            data: Member,
            // header: 'Update Member ' + Member.itemName,
            width: dialogWidth,
            closable: true,
            contentStyle: {
                "max-height": "720px",
                overflow: "auto",
                closable: "true",
            },
        });
        ref.onClose.subscribe(() => {
            this.findAllMember({});
        });
    }

    //delete Member
    deleteMember(event: MouseEvent, Member: MemberDto) {
        event.stopPropagation();
        this.confirmationService.confirm({
            // message: `Are you sure that you want to delete "${ Member.itemName}"?`,
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.ConfirmDeleteMember(Member);
                this.messageService.add({
                    severity: "error",
                    summary: "Deleted",
                    detail: "You have deleted ",
                });
            },
        });
    }
    ConfirmDeleteMember(Member: MemberDto) {
        this.MemberData = this.MemberData.filter(
            (val) => val.MemberId !== Member.MemberId
        );
        this.subscription.add(
            this.MemberService.deleteMember({
                MemberId: Member.MemberId,
            }).subscribe(() => {})
        );
    }
    //remove html meta data
    removeHtmlTags(description: string): string {
        return description.replace(/<[^>]*>/g, "");
    }

    //--select relationship--
    showSelectRelationShip(
        event: MouseEvent,
        Member: MemberDto,
        dtoId: string,
        id: string
    ) {
        event.stopPropagation();

        const ref = this.dialogService.open(SelectRelationshipComponent, {
            data: { Member, dtoId, id },
            header: "Select Table",
            width: "50%",
            contentStyle: {
                "max-height": "600px",
                overflow: "auto",
                "border-bottom-left-radius": "0.25rem",
                "border-bottom-right-radius": "0.25rem",
                "border-top-width": "1px",
                "border-top-style": "solid",
                "border-width": "1px",
                "border-style": "solid",
                "border-color": "#e4e4e4",
                baseZIndex: "10000",
                closable: "true",
            },
        });
        ref.onClose.subscribe(() => {
            this.findAllMember({});
        });
    }
}
