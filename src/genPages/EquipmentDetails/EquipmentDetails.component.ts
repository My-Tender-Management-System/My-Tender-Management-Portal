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
import {
    IEquipmentDetails,
    EquipmentDetailsDto,
} from "../../dto/EquipmentDetails.dto";
import { EquipmentDetailsService } from "../../services/EquipmentDetails.service";
import { CreateUpdateEquipmentDetails } from "./create-update-equipmentDetails/create-update-equipmentDetails";

import { SelectRelationshipComponent } from "src/app/layout/select-relationship/select-relationship.component";

import { getDtoNameById } from "src/app/layout/relationshipConfig/reationshipConfig";

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: "app-bid-EquipmentDetail",
    templateUrl: "./EquipmentDetails.component.html",
    providers: [CamelCaseToTitlePipe],
})
export class EquipmentDetailsComponent implements OnInit {
    @Input() tenderId: string;

    EquipmentDetailsData: EquipmentDetailsDto[] = [];
    cols: Column[] = [];
    _selectedColumns: Column[] = [];

    isDataLoading: boolean = false;
    canUpdate: boolean = true;
    canDelete: boolean = true;
    roleConfig = roleConfig;

    dtoName: string | undefined = "EquipmentDetails";

    private subscription: Subscription = new Subscription();
    Tender: any;

    constructor(
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private equipmentDetailsService: EquipmentDetailsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private dialogService: DialogService,
        private breadcrumbService: AppBreadcrumbService,
        private camelCaseToTitle: CamelCaseToTitlePipe
    ) {
        this.breadcrumbService.setItems([
            { label: this.camelCaseToTitle.transform("EquipmentDetails") },
        ]);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes["tenderId"]) {
            this.Tender = this.tenderId;
            this.dtoName = "Tender";
            this.findIfEquipmentDetailsByTenderId({});
        }
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            if ("isDetail" == params["equipments"]) {
                this.showCreateEquipmentDetailsDialogDefault();
            }
        });
        this.route.queryParams.subscribe((params: any) => {
            this.Tender = params["primarykey"];
        });

        this.route.queryParams.subscribe((params: any) => {
            this.dtoName = getDtoNameById(params["id"]);

            switch (this.dtoName) {
                case "Tender":
                    this.Tender = params["primarykey"];
                    console.log(this.Tender);
                    this.findIfEquipmentDetailsByTenderId({});
                    break;

                default:
                    this.findAllEquipmentDetails({});
                    break;
            }
        });

        this.isDataLoading = true;

        this.cols = [
            // {field: 'EquipmentID', header: 'EquipmentID'},
            { field: "Qty", header: "Qty" },
            { field: "BidAmount", header: "Bid Amount" },
            { field: "BidBankCharge", header: "Bid Bank Charge" },
            { field: "Remark", header: "Remark" },
            { field: "Cost", header: "Cost" },
            { field: "TenderId", header: "Tender ID" },
        ];

        this._selectedColumns = this.cols;

        if (this.tenderId) {
            this.Tender = this.tenderId;
            this.dtoName = "Tender";
            this.findIfEquipmentDetailsByTenderId({});
        }
    }

    get selectedColumns(): Column[] {
        return this._selectedColumns;
    }

    set selectedColumns(val: Column[]) {
        // Restore original order
        this._selectedColumns = this.cols.filter((col) => val.includes(col));
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
        this.equipmentDetailsService.downloadFile().subscribe(
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
            return "EquipmentDetailss_" + date + ".csv";
        }
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(header);
        if (!matches || !matches[1]) {
            return "EquipmentDetailss_" + date + ".csv";
        }
        return matches[1].replace(/['"]/g, "");
    }

    uploadFile(event: any) {
        const file: File = event.target.files[0];
        const formData: FormData = new FormData();
        formData.append("file", file);

        this.equipmentDetailsService.uploadFile(formData).subscribe(
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

    findIfEquipmentDetailsByTenderId(params: any) {
        // console.log("call wenawa findIfUpdatesByTenderId")
        if (this.Tender) {
            this.subscription.add(
                this.equipmentDetailsService
                    .findIfEquipmentDetailsByTenderId({ TenderId: this.Tender })
                    .pipe(
                        filter(
                            (res: HttpResponse<IEquipmentDetails>) => res.ok
                        ),
                        map((res: HttpResponse<IEquipmentDetails>) => res.body)
                    )
                    .subscribe(
                        (res: IEquipmentDetails | null) => {
                            if (res != null) {
                                let data = res;
                                let dataList = [data];
                                this.EquipmentDetailsData = dataList;
                            } else {
                                this.EquipmentDetailsData = [];
                            }
                            this.isDataLoading = false;
                        },

                        (res: HttpErrorResponse) =>
                            console.log("error in extracting all Updates", res)
                    )
            );
        } else {
            // this.subscription.add(
            //     this.equipmentDetailsService
            //         .findAllEquipmentDetails(params)
            //         .pipe(
            //             filter(
            //                 (res: HttpResponse<IEquipmentDetails[]>) => res.ok
            //             ),
            //             map(
            //                 (res: HttpResponse<IEquipmentDetails[]>) => res.body
            //             )
            //         )
            //         .subscribe(
            //             (res: IEquipmentDetails[] | null) => {
            //                 if (res != null) {
            //                     this.EquipmentDetailsData = res;
            //                 } else {
            //                     this.EquipmentDetailsData = [];
            //                 }
            //                 this.isDataLoading = false;
            //             },
            //             (res: HttpErrorResponse) =>
            //                 console.log("error in extracting all Updates", res)
            //         )
            // );
        }
    }

    //--find all--
    findAllEquipmentDetails(params: any) {
        console.log("meka wada");
        this.subscription.add(
            this.equipmentDetailsService
                .findAllEquipmentDetails(params)
                .pipe(
                    filter((res: HttpResponse<IEquipmentDetails[]>) => res.ok),
                    map((res: HttpResponse<IEquipmentDetails[]>) => res.body)
                )
                .subscribe(
                    (res: IEquipmentDetails[] | null) => {
                        if (res != null) {
                            this.EquipmentDetailsData = res;
                        } else {
                            this.EquipmentDetailsData = [];
                        }
                        this.isDataLoading = false;
                    },

                    (res: HttpErrorResponse) =>
                        console.log(
                            "error in extracting all EquipmentDetails",
                            res
                        )
                )
        );
    }

    //dynamic dialog
    showCreateEquipmentDetailsDialog() {
        this.showCreateEquipmentDetailsDialogDefault();
    }

    //dynamic dialog
    showCreateEquipmentDetailsDialogDefault() {
        const ref = this.dialogService.open(CreateUpdateEquipmentDetails, {
            header:
                "Create " + this.camelCaseToTitle.transform("EquipmentDetails"),
            width: "60%",
            data: { TenderId: this.Tender },
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
            this.findIfEquipmentDetailsByTenderId({});
        });
    }

    showEditEquipmentDetailsDialog(EquipmentDetails: EquipmentDetailsDto) {
        const ref = this.dialogService.open(CreateUpdateEquipmentDetails, {
            data: EquipmentDetails,
            header:
                "Update " + this.camelCaseToTitle.transform("EquipmentDetails"),
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
            this.findIfEquipmentDetailsByTenderId({});
        });
    }

    //delete EquipmentDetails
    deleteEquipmentDetails(EquipmentDetails: EquipmentDetailsDto) {
        this.confirmationService.confirm({
            message: `Are you sure that you want to delete ?`,
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.ConfirmDeleteEquipmentDetails(EquipmentDetails);
                this.messageService.add({
                    severity: "error",
                    summary: "Deleted",
                    detail: "You have deleted ",
                });
            },
        });
    }
    ConfirmDeleteEquipmentDetails(EquipmentDetails: EquipmentDetailsDto) {
        this.EquipmentDetailsData = this.EquipmentDetailsData.filter(
            (val) =>
                val.EquipmentDetailsId !== EquipmentDetails.EquipmentDetailsId
        );
        this.subscription.add(
            this.equipmentDetailsService
                .deleteEquipmentDetails({
                    equipmentDetailsId: EquipmentDetails.EquipmentDetailsId,
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

    //--select relationship--
    showSelectRelationShip(
        EquipmentDetails: EquipmentDetailsDto,
        dtoId: string,
        id: string
    ) {
        const ref = this.dialogService.open(SelectRelationshipComponent, {
            data: { EquipmentDetails, dtoId, id },
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
            this.findIfEquipmentDetailsByTenderId({});
        });
    }
}
