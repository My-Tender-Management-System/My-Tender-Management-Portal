import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
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
import { ITender, TenderDto } from "../../dto/Tender.dto";
import { TenderService } from "../../services/Tender.service";
import { CreateUpdateTender } from "./create-update-tender/create-update-tender";

import { SelectRelationshipComponent } from "src/app/layout/select-relationship/select-relationship.component";

import { getDtoNameById } from "src/app/layout/relationshipConfig/reationshipConfig";

@Component({
    templateUrl: "./Tender.component.html",
    providers: [CamelCaseToTitlePipe],
})
export class TenderComponent implements OnInit {
    @Input() tenderId: string;
    TenderData: TenderDto[] = [];
    layout: string = "grid";
    isDataLoading: boolean = false;
    canUpdate: boolean = true;
    canDelete: boolean = true;
    roleConfig = roleConfig;
    selectedTenderId: string;

    dtoName: string | undefined = "Tender";

    private subscription: Subscription = new Subscription();
    dialogVisible: boolean;
    relationshipDialogVisible: boolean = false;
    CompletionPercentageForTenderIdResponse: number = 0;  

    constructor(
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private tenderService: TenderService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private dialogService: DialogService,
        private breadcrumbService: AppBreadcrumbService,
        private camelCaseToTitle: CamelCaseToTitlePipe
    ) {
        this.breadcrumbService.setItems([
            { label: this.camelCaseToTitle.transform("Tender") },
        ]);
    }

    ngOnInit() {
        this.findAllTender({});
        this.isDataLoading = true;

    }

    // ngOnChanges(changes: SimpleChanges) {
    //     if (changes['tenderId']) {
    //         this.getTenderCompletionPercentage(this.tenderId);
    //         console.log("get tender function ", this.tenderId)   
    //         }
    //   }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            "contains"
        );
    }

    navigateToCreateUser() {
        this.router.navigate(["profile/create"]);
    }

    NavigateToProgress(tenderId: any) {
        console.log(tenderId)
        this.router.navigate(["/pages/tenderProgress"], {
            queryParams: { id: 'DTO2791', primarykey: tenderId },
        });
    }

    // showTenderRelationShip(tenderId: any) {
    //     console.log(tenderId)
    //     this.dialogVisible = true;
    //     this.router.navigate(["/pages/RealationshipDialog"], {
    //         queryParams: { id: 'DTO2791', primarykey: tenderId },
    //     });
    // }

    showDialogRelationship(tenderId: string) {
        console.log('Tender ID to show dialog:', tenderId); 
        this.selectedTenderId = tenderId; 
        this.relationshipDialogVisible = true;
    }
    

    downloadFile() {
        this.tenderService.downloadFile().subscribe(
            (response: HttpResponse<Blob>) => {
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
            return "Tenders_" + date + ".csv";
        }
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(header);
        if (!matches || !matches[1]) {
            return "Tenders_" + date + ".csv";
        }
        return matches[1].replace(/['"]/g, "");
    }

    uploadFile(event: any) {
        const file: File = event.target.files[0];
        const formData: FormData = new FormData();
        formData.append("file", file);

        this.tenderService.uploadFile(formData).subscribe(
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
    findAllTender(params: any) {
        this.subscription.add(
            this.tenderService
                .findAllTender(params)
                .pipe(
                    filter((res: HttpResponse<ITender[]>) => res.ok),
                    map((res: HttpResponse<ITender[]>) => res.body)
                )
                .subscribe(
                    (res: ITender[] | null) => {
                        if (res != null) {
                            this.TenderData = res;
                        } else {
                            this.TenderData = [];
                        }
                        this.isDataLoading = false;
                    },

                    (res: HttpErrorResponse) =>
                        console.log("error in extracting all Tender", res)
                )
        );
    }

    //dynamic dialog
    showCreateTenderDialog() {
        this.showCreateTenderDialogDefault();
    }

    //dynamic dialog
    showCreateTenderDialogDefault() {
        const ref = this.dialogService.open(CreateUpdateTender, {
            header: "Create " + this.camelCaseToTitle.transform("Tender"),
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
            this.findAllTender({});
        });
    }

    showEditTenderDialog(Tender: TenderDto) {
        const ref = this.dialogService.open(CreateUpdateTender, {
            data: Tender,
            header: "Update " + this.camelCaseToTitle.transform("Tender"),
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
            this.findAllTender({});
        });
    }

    //delete Tender
    deleteTender(Tender: TenderDto) {
        this.confirmationService.confirm({
            message: `Are you sure that you want to delete ?`,
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.ConfirmDeleteTender(Tender);
                this.messageService.add({
                    severity: "error",
                    summary: "Deleted",
                    detail: "You have deleted ",
                });
            },
        });
    }
    ConfirmDeleteTender(Tender: TenderDto) {
        this.TenderData = this.TenderData.filter(
            (val) => val.TenderId !== Tender.TenderId
        );
        this.subscription.add(
            this.tenderService
                .deleteTender({ tenderId: Tender.TenderId })
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

    //--select relationship--
    showSelectRelationShip(Tender: TenderDto, dtoId: string, id: string) {
        const ref = this.dialogService.open(SelectRelationshipComponent, {
            data: { Tender, dtoId, id },
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
            this.findAllTender({});
        });
    }

    checkTenderNotification(tenderId: string) {
        console.log("Tender ID:", tenderId); // This will log the correct Tender ID
        this.tenderService.GetTenderNotification(tenderId).subscribe(
            (response: any) => {
                const status = response.body?.status; // Ensure you access the body
                if (status) {
                    this.showNotification(status);
                } else {
                    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No status found.' });
                }
            },
            (error) => {
                // Handle error response
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch tender notification.' });
            }
        );
    }

    showNotification(status: string) {
        let severity: string;

        switch (status) {
            case 'CRITICAL':
                severity = 'error'; // Red alert
                break;
            case 'WARNING':
                severity = 'warn'; // Yellow alert
                break;
            case 'OK':
                severity = 'success'; // Green alert
                break;
            default:
                severity = 'info'; // Default info alert
                break;
        }

        // Show the notification
        this.messageService.add({ severity, summary: 'Tender Status', detail: `Status: ${status}` });
    }

    getTenderCompletionPercentage(tenderId: string): void {
        console.log("trigger getTenderCompletionPercentage");
        this.tenderService.GetTenderCompletionPercentageByTenderId(tenderId).subscribe(
          (response: HttpResponse<any>) => {
            const body = response.body;
            if (body && body.CompletionPercentageForTenderIdResponse !== undefined) {
              this.CompletionPercentageForTenderIdResponse = body.CompletionPercentageForTenderIdResponse;
            }
          },
          (error) => {
            console.error('Error fetching tender completion percentage:', error);
          }
        );
      }
    
      setTenderData(tenderData: any): void {
        if (tenderData && tenderData.TenderId) {
          this.getTenderCompletionPercentage(tenderData.TenderId);
        }
      }

      
      downloadTenderPDF(tenderId: string): void {
        if (!tenderId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Invalid Tender ID',
                life: 3000,
            });
            return;
        }
    
        this.subscription.add(
            this.tenderService.generateTenderPDF(tenderId).subscribe(
                (res) => {
                    if (res.body) {
                        const url = window.URL.createObjectURL(res.body);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${tenderId}_TenderReport.pdf`; 
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
    
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Downloaded Successfully',
                            detail: `Tender report for "${tenderId}" downloaded successfully.`,
                            life: 3000,
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to download the tender report',
                            life: 3000,
                        });
                    }
                },
                (error: HttpErrorResponse) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'An error occurred while downloading the tender report',
                        life: 3000,
                    });
                    console.error('Error downloading tender report:', error);
                }
            )
        );
    }
    
}
