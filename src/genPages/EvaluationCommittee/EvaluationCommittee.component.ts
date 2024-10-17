import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Table } from "primeng/table";
import { filter, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { DialogService } from "primeng/dynamicdialog";
import { ConfirmationService, MessageService } from "primeng/api";
import { DomSanitizer } from "@angular/platform-browser";
import { roleConfig } from "src/app/layout/roleConfig/roleConfig";
import { AppBreadcrumbService } from "src/app/app.breadcrumb.service";
import { CamelCaseToTitlePipe } from "src/app/camel-case-to-title.pipe";
import { ShowFilesComponent } from "../show-files/show-files.component";
import {
    IEvaluationCommittee,
    EvaluationCommitteeDto,
} from "../../dto/EvaluationCommittee.dto";
import { EvaluationCommitteeService } from "../../services/EvaluationCommittee.service";
import { CreateUpdateEvaluationCommittee } from "./create-update-evaluationCommittee/create-update-evaluationCommittee";

import { getDtoNameById } from "src/app/layout/relationshipConfig/reationshipConfig";

@Component({
    selector: "app-evaluation-commitee",
    templateUrl: "./EvaluationCommittee.component.html",
    providers: [CamelCaseToTitlePipe],
})
export class EvaluationCommitteeComponent implements OnInit {
    @Input() tenderId: string;
    EvaluationCommitteeData: EvaluationCommitteeDto[] = [];

    isDataLoading: boolean = false;
    canUpdate: boolean = true;
    canDelete: boolean = true;
    roleConfig = roleConfig;

    dtoName: string | undefined = "";

    Tender: string = "";

    private subscription: Subscription = new Subscription();

    constructor(
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private evaluationCommitteeService: EvaluationCommitteeService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private dialogService: DialogService,
        private breadcrumbService: AppBreadcrumbService,
        private camelCaseToTitle: CamelCaseToTitlePipe
    ) {
        this.breadcrumbService.setItems([
            { label: this.camelCaseToTitle.transform("EvaluationCommittee") },
        ]);
    }

    ngOnInit() {
        this.isDataLoading = true;
        this.subscription.add(
            this.route.queryParams.subscribe((params: any) => {
                this.dtoName = getDtoNameById(params["id"]);

                switch (this.dtoName) {
                    case "Tender":
                        this.Tender = params["primarykey"];
                        this.findAllEvaluationCommitteeByTenderId({});
                        break;

                    default:
                        this.findAllEvaluationCommittee({});
                        break;
                }
            })
        );

        if (this.tenderId) {
            this.Tender = this.tenderId;
            this.dtoName = 'Tender';
            this.findAllEvaluationCommitteeByTenderId({});
        }
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
        this.evaluationCommitteeService.downloadFile().subscribe(
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
            return "EvaluationCommittees_" + date + ".csv";
        }
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(header);
        if (!matches || !matches[1]) {
            return "EvaluationCommittees_" + date + ".csv";
        }
        return matches[1].replace(/['"]/g, "");
    }

    uploadFile(event: any) {
        const file: File = event.target.files[0];
        const formData: FormData = new FormData();
        formData.append("file", file);

        this.evaluationCommitteeService.uploadFile(formData).subscribe(
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

    //Find all EvaluationCommittee data from db by Tender
    findAllEvaluationCommitteeByTenderId(params: any) {
        if (this.Tender) {
            this.subscription.add(
                this.evaluationCommitteeService
                    .findAllIfEvaluationCommitteeByTenderId({
                        TenderId: this.Tender,
                    })
                    .pipe(
                        filter(
                            (res: HttpResponse<IEvaluationCommittee[]>) =>
                                res.ok
                        ),
                        map(
                            (res: HttpResponse<IEvaluationCommittee[]>) =>
                                res.body
                        )
                    )
                    .subscribe(
                        (res: IEvaluationCommittee[] | null) => {
                            if (res != null) {
                                this.EvaluationCommitteeData = res;
                            } else {
                                this.EvaluationCommitteeData = [];
                            }
                            this.isDataLoading = false;
                        },

                        (res: HttpErrorResponse) =>
                            console.log(
                                "error in extracting all EvaluationCommittee",
                                res
                            )
                    )
            );
        } else {
            this.subscription.add(
                this.evaluationCommitteeService
                    .findAllEvaluationCommittee(params)
                    .pipe(
                        filter(
                            (res: HttpResponse<IEvaluationCommittee[]>) =>
                                res.ok
                        ),
                        map(
                            (res: HttpResponse<IEvaluationCommittee[]>) =>
                                res.body
                        )
                    )
                    .subscribe(
                        (res: IEvaluationCommittee[] | null) => {
                            if (res != null) {
                                this.EvaluationCommitteeData = res;
                            } else {
                                this.EvaluationCommitteeData = [];
                            }
                            this.isDataLoading = false;
                        },

                        (res: HttpErrorResponse) =>
                            console.log(
                                "error in extracting all EvaluationCommittee",
                                res
                            )
                    )
            );
        }
    }

    //--find all--
    findAllEvaluationCommittee(params: any) {
        this.subscription.add(
            this.evaluationCommitteeService
                .findAllEvaluationCommittee(params)
                .pipe(
                    filter(
                        (res: HttpResponse<IEvaluationCommittee[]>) => res.ok
                    ),
                    map((res: HttpResponse<IEvaluationCommittee[]>) => res.body)
                )
                .subscribe(
                    (res: IEvaluationCommittee[] | null) => {
                        if (res != null) {
                            this.EvaluationCommitteeData = res;
                        } else {
                            this.EvaluationCommitteeData = [];
                        }
                        this.isDataLoading = false;
                    },

                    (res: HttpErrorResponse) =>
                        console.log(
                            "error in extracting all EvaluationCommittee",
                            res
                        )
                )
        );
    }

    //dynamic dialog
    showCreateEvaluationCommitteeDialog() {
        switch (this.dtoName) {
            case "Tender":
                this.showCreateEvaluationCommitteeByTenderDialog();
                break;

            default:
                break;
        }
    }

    //dynamic dialog
    showCreateEvaluationCommitteeByTenderDialog() {
        const ref = this.dialogService.open(CreateUpdateEvaluationCommittee, {
            data: { TenderId: this.Tender },
            header:
                "Create " +
                this.camelCaseToTitle.transform("EvaluationCommittee"),
            width: "60%",
            contentStyle: {
                "max-height": "500px",
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
            this.findAllEvaluationCommitteeByTenderId({});
        });
    }

    //dynamic dialog
    showCreateEvaluationCommitteeDialogDefault() {
        const ref = this.dialogService.open(CreateUpdateEvaluationCommittee, {
            header:
                "Create " +
                this.camelCaseToTitle.transform("EvaluationCommittee"),
            width: "60%",
            contentStyle: {
                "max-height": "500px",
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
    }

    showEditEvaluationCommitteeDialog(
        EvaluationCommittee: EvaluationCommitteeDto
    ) {
        const ref = this.dialogService.open(CreateUpdateEvaluationCommittee, {
            data: EvaluationCommittee,
            header:
                "Update " +
                this.camelCaseToTitle.transform("EvaluationCommittee"),
            width: "60%",
            contentStyle: {
                "max-height": "500px",
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
            this.findAllEvaluationCommittee({});
        });
    }

    //delete EvaluationCommittee
    deleteEvaluationCommittee(EvaluationCommittee: EvaluationCommitteeDto) {
        this.confirmationService.confirm({
            message: `Are you sure that you want to delete ?`,
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.ConfirmDeleteEvaluationCommittee(EvaluationCommittee);
                this.messageService.add({
                    severity: "error",
                    summary: "Deleted",
                    detail: "You have deleted ",
                });
            },
        });
    }
    ConfirmDeleteEvaluationCommittee(
        EvaluationCommittee: EvaluationCommitteeDto
    ) {
        this.EvaluationCommitteeData = this.EvaluationCommitteeData.filter(
            (val) =>
                val.EvaluationCommitteeId !==
                EvaluationCommittee.EvaluationCommitteeId
        );
        this.subscription.add(
            this.evaluationCommitteeService
                .deleteEvaluationCommittee({
                    evaluationCommitteeId:
                        EvaluationCommittee.EvaluationCommitteeId,
                })
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
}
