import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Table } from "primeng/table";
import { filter, Subscription } from "rxjs";
import { finalize, map } from "rxjs/operators";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { DialogService } from "primeng/dynamicdialog";
import { ConfirmationService, MessageService } from "primeng/api";
import { DomSanitizer } from "@angular/platform-browser";
import { roleConfig } from "src/app/layout/roleConfig/roleConfig";
import { AppBreadcrumbService } from "src/app/app.breadcrumb.service";
import { CamelCaseToTitlePipe } from "src/app/camel-case-to-title.pipe";
import { ITenderTeam, TenderTeamDto } from "../../../dto/TenderTeam.dto";
import { TenderTeamService } from "../../../services/TenderTeam.service";

import { SelectRelationshipComponent } from "src/app/layout/select-relationship/select-relationship.component";

import { getDtoNameById } from "src/app/layout/relationshipConfig/reationshipConfig";
import { MemberService } from "src/services/Member.service";
import { IMember, MemberDto } from "src/dto/Member.dto";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-team",
    templateUrl: "./TenderTeam.component.html",
    providers: [CamelCaseToTitlePipe],
})
export class TeamComponent implements OnInit {
    @Input() tenderId: string;
    TenderTeamData: TenderTeamDto[] = [];
    TenderTeam: TenderTeamDto[] = [];
    isDataLoading: boolean = false;
    canUpdate: boolean = true;
    canDelete: boolean = true;
    roleConfig = roleConfig;
    sourceProducts!: MemberDto[];
    targetProducts!: MemberDto[];
    tenderTeamForm!: FormGroup;
    dtoName: string | undefined = "TenderTeam";

    Tender: string = "";

    submitted: boolean = false;
    private subscription: Subscription = new Subscription();
isLoading: any;

    constructor(
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private tenderTeamService: TenderTeamService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private dialogService: DialogService,
        private breadcrumbService: AppBreadcrumbService,
        private camelCaseToTitle: CamelCaseToTitlePipe,
        private memberService: MemberService,
        private fb: FormBuilder
    ) {
        this.breadcrumbService.setItems([
            { label: this.camelCaseToTitle.transform("TenderTeam") },
        ]);
    }

    ngOnInit() {
        this.targetProducts = [];
        this.isDataLoading = true;
        this.tenderTeamForm = this.fb.group({
            TenderTeamId: [""],
            TeamName: ["", Validators.required],
            TeamLead: [""],
            NumberOfMembers: [null],
            IsActive: [null],
            Members: this.fb.array([]),
            TenderId: [""]
        });
        this.route.queryParams.subscribe((params: any) => {
            const TenderId = params["primarykey"];  
            this.tenderTeamForm.patchValue({ TenderId: TenderId });  
            if (TenderId) {
                this.findAllTenderTeam(TenderId); 
                this.findAllMember(TenderId); 
            } else {
                this.findAllTenderTeam({});  
            }
        });

        if (this.tenderId) {
            this.Tender = this.tenderId;
            this.dtoName = 'Tender';
            this.findAllTenderTeam(this.tenderId); 
            this.findAllMember(this.tenderId);

          }
    }




    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            "contains"
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['tenderId']) {
                this.Tender = this.tenderId
                this.dtoName = 'Tender'
                this.findAllTenderTeam({});
    
            }
      }

    navigateToCreateUser() {
        this.router.navigate(["profile/create"]);
    }

    downloadFile() {
        this.tenderTeamService.downloadFile().subscribe(
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
            return "TenderTeams_" + date + ".csv";
        }
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(header);
        if (!matches || !matches[1]) {
            return "TenderTeams_" + date + ".csv";
        }
        return matches[1].replace(/['"]/g, "");
    }

    uploadFile(event: any) {
        const file: File = event.target.files[0];
        const formData: FormData = new FormData();
        formData.append("file", file);

        this.tenderTeamService.uploadFile(formData).subscribe(
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
    findAllTenderTeam(params: any,) {
        this.subscription.add(
            this.tenderTeamService
                .findAllTenderTeam({TenderId:params})
                .pipe(
                    filter((res: HttpResponse<ITenderTeam[]>) => res.ok),
                    map((res: HttpResponse<ITenderTeam[]>) => res.body)
                )
                .subscribe(
                    (res: ITenderTeam[] | null) => {
                        if (res != null) {
                            if (params){
                                this.TenderTeamData = [];
                                this.TenderTeam = res;
                                this.tenderTeamForm.patchValue( {...this.TenderTeam[0]});
                            } else {
                                this.TenderTeamData = res;
                            }
                        } else {
                            this.TenderTeamData = [];
                        }
                        this.isDataLoading = false;
                    },

                    (res: HttpErrorResponse) =>
                        console.log("error in extracting all TenderTeam", res)
                )
        );
    }

    //delete TenderTeam
    deleteTenderTeam(TenderTeam: TenderTeamDto) {
        this.confirmationService.confirm({
            message: `Are you sure that you want to delete ?`,
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.ConfirmDeleteTenderTeam(TenderTeam);
                this.messageService.add({
                    severity: "error",
                    summary: "Deleted",
                    detail: "You have deleted ",
                });
            },
        });
    }
    ConfirmDeleteTenderTeam(TenderTeam: TenderTeamDto) {
        this.TenderTeamData = this.TenderTeamData.filter(
            (val) => val.TenderTeamId !== TenderTeam.TenderTeamId
        );
        this.subscription.add(
            this.tenderTeamService
                .deleteTenderTeam({ tenderTeamId: TenderTeam.TenderTeamId })
                .subscribe(() => {})
        );
    } //remove html meta data
    removeHtmlTags(description: string): string {
        return description.replace(/<[^>]*>/g, "");
    }

    hasAccess(dtoId: string, accessType: string): boolean {
        const roleName = localStorage.getItem("roleName");

        if (roleName !== null) {
            // console.log(roleName);
            const rolePermissions = roleConfig[roleName];

            if (rolePermissions && rolePermissions[dtoId]) {
                if (rolePermissions[dtoId]?.includes(accessType)) {
                    return true;
                } else {
                    if (accessType == "DELETE") {
                        this.canDelete = false;
                    }
                    if (accessType == "UPDATE") {
                        this.canUpdate = false;
                    }
                }
            }
        }
        return false;
    }

    findAllMember(params: any) { 
        this.subscription.add(
            this.memberService
                .findAllMemberForList({TenderId: params})
                .pipe(
                    filter((res: HttpResponse<{filteredMembers: IMember[], otherMembers: IMember[]}>) => res.ok),
                    map((res: HttpResponse<{filteredMembers: IMember[], otherMembers: IMember[]}>) => res.body)
                )
                .subscribe(
                    (res: {filteredMembers: IMember[] | null, otherMembers: IMember[] | null} | null) => {
                        if (res) {
                            this.targetProducts = res.filteredMembers || []; 
                            this.sourceProducts = res.otherMembers || [];    

                        } else {
                            this.sourceProducts = [];
                            this.targetProducts = [];
                        }
                        this.isDataLoading = false;
                    },
    
                    (res: HttpErrorResponse) =>
                        this.findAllMemberForTeam({})
                       
                )
        );
    }


    findAllMemberForTeam(params: any) {
        this.subscription.add(
            this.memberService
                .findAllMember(params)
                .pipe(
                    filter((res: HttpResponse<IMember[]>) => res.ok),
                    map((res: HttpResponse<IMember[]>) => res.body)
                )
                .subscribe(
                    (res: IMember[] | null) => {
                        if (res != null) {
                            this.sourceProducts = res;
                        } else {
                            this.sourceProducts = [];
                        }
                        this.isDataLoading = false;
                    },

                    (res: HttpErrorResponse) =>
                        console.log("error in extracting all Member", res)
                )
        );
    }

    //--select relationship--
    showSelectRelationShip(
        TenderTeam: TenderTeamDto,
        dtoId: string,
        id: string
    ) {
        const ref = this.dialogService.open(SelectRelationshipComponent, {
            data: { TenderTeam, dtoId, id },
            header: "Select Table",
            width: "50%",
            contentStyle: {
                "max-height": "600px",
                overflow: "auto",
                "border-bottom-left-radius": "0.25rem",
                "border-bottom-right-radius": "0.25rem",
                "border-top-width": "1px",
                "border-top-style": "solid",
                "border-width": "0px",
                "border-style": "solid",
                "border-color": "#e4e4e4",
                baseZIndex: "10000",
                closable: "true",
            },
        });
        ref.onClose.subscribe(() => {
            this.findAllTenderTeam({});
        });
    }

    save() {
        
        this.submitted = true;
        this.SaveMemberToTeam()
        if (this.tenderTeamForm.invalid) {
            return;
        }
        this.isLoading = true;

        const tenderTeam = this.tenderTeamForm.value;

        if (tenderTeam.TenderTeamId) {
            this.subscription.add(
                this.tenderTeamService
                    .updateTenderTeam(tenderTeam)
                    .pipe(finalize(() => {}))
                    .subscribe(
                        (res) => {
                            if (res.body) {
                                this.messageService.add({
                                    severity: "success",
                                    summary: "Successful",
                                    detail: `TenderTeam Updated Successfully.`,
                                    life: 3000,
                                });
                            }
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Update TenderTeam.`,
                                life: 3000,
                            });
                        }
                    )
            );
            this.isLoading = false;
        } else {
            this.subscription.add(
                this.tenderTeamService
                    .createTenderTeam(tenderTeam)
                    .pipe(finalize(() => {}))
                    .subscribe(
                        (res) => {
                            if (res.body) {
                                this.messageService.add({
                                    severity: "success",
                                    summary: "Successful",
                                    detail: `TenderTeam Created Successfully.`,
                                    life: 3000,
                                });
                            }
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Create TenderTeam.`,
                                life: 3000,
                            });
                        }
                    )
            );
            this.isLoading = false;
        }
    }

    SaveMemberToTeam() {
        const filter = this.targetProducts.map(product => product.MemberId);
        const membersFormArray = this.fb.array(filter.map(id => this.fb.control(id)));
        this.tenderTeamForm.setControl('Members', membersFormArray); 
    }
}
