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
import { IBidBond, BidBondDto } from "../../dto/BidBond.dto";
import { BidBondService } from "../../services/BidBond.service";
import { CreateUpdateBidBond } from "./create-update-bidBond/create-update-bidBond";

import { getDtoNameById } from "src/app/layout/relationshipConfig/reationshipConfig";
import { CompanyService } from "src/services/Company.service";
import { CompanyDto, ICompany } from "src/dto/Company.dto";
import { formatDate } from "@angular/common";

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: "app-bid-bond",
    templateUrl: "./BidBond.component.html",
    providers: [CamelCaseToTitlePipe],
})
export class BidBondComponent implements OnInit {
    @Input() tenderId: string;
    
    BidBondData: BidBondDto[] = [];
    CompanyData: CompanyDto[] = [];

    cols: Column[] = [];
    _selectedColumns: Column[] = [];
    
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
        private bidBondService: BidBondService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private dialogService: DialogService,
        private breadcrumbService: AppBreadcrumbService,
        private camelCaseToTitle: CamelCaseToTitlePipe
    ) {
        this.breadcrumbService.setItems([
            { label: this.camelCaseToTitle.transform("BidBond") },
        ]);
    }

    ngOnInit() {
        this.isDataLoading = true;

        // this.initializeColumns();
        // this.loadBidBondData();
        
        this.subscription.add(
            this.route.queryParams.subscribe((params: any) => {
                this.dtoName = getDtoNameById(params["id"]);

                switch (this.dtoName) {
                    case "Tender":
                        this.Tender = params["primarykey"];
                        this.findIfBidBondByTenderId({});
                        break;

                    default:
                        this.findAllBidBond({});
                        break;
                }
            })


        );

        if (this.tenderId) {
            this.Tender = this.tenderId;
            this.dtoName = 'Tender';
            this.findIfBidBondByTenderId({});
          }
        // this._selectedColumns = this.cols;
    }


    ngOnChanges(changes: SimpleChanges) {
        if (changes['tenderId']) {
                this.Tender = this.tenderId
                this.dtoName = 'Tender'
                this.findIfBidBondByTenderId({});
    
            }
      }


    
    // initializeColumns() {
    //     this.cols = [
    //         { field: 'BidBondId', header: 'Bid Bond ID' },
    //         { field: 'Amount', header: 'Amount' },
    //         { field: 'Status', header: 'Status' },
    //         { field: 'Company', header: 'Company' },
    //         { field: 'RefNo', header: 'Reference No' },
    //         { field: 'ValidityPeriod', header: 'Validity Period' },
    //         { field: 'GuaranteeType', header: 'Guarantee Type' },
    //         { field: 'BeneficiaryName', header: 'Beneficiary Name' },
    //         { field: 'Remark', header: 'Remark' },
    //         { field: 'BeneficiaryMobile', header: 'Beneficiary Mobile' },
    //         { field: 'RequestedDate', header: 'Requested Date' },
    //         { field: 'RequiredDate', header: 'Required Date' },
    //         { field: 'Bank', header: 'Bank' },
    //         { field: 'Branch', header: 'Branch' },
    //         { field: 'CollectedBy', header: 'Collected By' },
    //         { field: 'ReceivedDate', header: 'Received Date' },
    //         { field: 'TenderId', header: 'Tender ID' }
    //     ];
    // }

    // // Load and format data
    // loadBidBondData() {
    //     // Replace this with your actual data fetching logic
    //     this.BidBondData = this.fetchBidBondData().map(bidBond => ({
    //         ...bidBond,
    //         ValidityPeriod: bidBond.ValidityPeriod, // Keep it as an object
    //         RequestedDate: formatDate(bidBond.RequestedDate, 'shortDate', 'en-US'),
    //         RequiredDate: formatDate(bidBond.RequiredDate, 'shortDate', 'en-US'),
    //         ReceivedDate: formatDate(bidBond.ReceivedDate, 'shortDate', 'en-US'),
    //         Remark: this.truncateRemark(bidBond.Remark, 30) // Truncate Remark to 30 characters
    //     }));
    //     this.isDataLoading = false; // Update loading state
    // }
    
    // formatValidityPeriod(period: { start: string; end: string }) {
    //     return `From ${formatDate(period.start, 'shortDate', 'en-US')} to ${formatDate(period.end, 'shortDate', 'en-US')}`;
    // }

    // // Truncate the Remark text if it exceeds a certain length
    // truncateRemark(remark: string, length: number) {
    //     return remark.length > length ? `${remark.substring(0, length)}...` : remark;
    // }

    // // Simulated data fetch
    // fetchBidBondData(): IBidBond[] {
    //     return []; // Replace this with actual data fetching
    // }
    

    // get selectedColumns(): Column[] {
    //     return this._selectedColumns;
    // }

    // set selectedColumns(val: Column[]) {
    //     // Restore original order
    //     this._selectedColumns = this.cols.filter(col => val.includes(col));
    // }

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
        this.bidBondService.downloadFile().subscribe(
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
            return "BidBonds_" + date + ".csv";
        }
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(header);
        if (!matches || !matches[1]) {
            return "BidBonds_" + date + ".csv";
        }
        return matches[1].replace(/['"]/g, "");
    }

    uploadFile(event: any) {
        const file: File = event.target.files[0];
        const formData: FormData = new FormData();
        formData.append("file", file);

        this.bidBondService.uploadFile(formData).subscribe(
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

    //Find BidBond data from db by Tender
    findIfBidBondByTenderId(params: any) {
        if (this.Tender) {
            this.subscription.add(
                this.bidBondService
                    .findIfBidBondByTenderId({ TenderId: this.Tender })
                    .pipe(
                        filter((res: HttpResponse<IBidBond>) => res.ok),
                        map((res: HttpResponse<IBidBond>) => res.body)
                    )
                    .subscribe(
                        (res: IBidBond | null) => {
                            if (res != null) {
                                let data = res;
                                let dataList = [data];
                                this.BidBondData = dataList;
                            } else {
                                this.BidBondData = [];
                            }
                            this.isDataLoading = false;
                        },

                        (res: HttpErrorResponse) =>
                            console.log("error in extracting all BidBond", res)
                    )
            );
        } else {
            // this.subscription.add(
            //     this.bidBondService
            //         .findAllBidBond(params)
            //         .pipe(
            //             filter((res: HttpResponse<IBidBond[]>) => res.ok),
            //             map((res: HttpResponse<IBidBond[]>) => res.body)
            //         )
            //         .subscribe(
            //             (res: IBidBond[] | null) => {
            //                 if (res != null) {
            //                     this.BidBondData = res;
            //                 } else {
            //                     this.BidBondData = [];
            //                 }
            //                 this.isDataLoading = false;
            //             },

            //             (res: HttpErrorResponse) =>
            //                 console.log("error in extracting all BidBond", res)
            //         )
            // );
        }
    }

    //--find all--
    findAllBidBond(params: any) {
        this.subscription.add(
            this.bidBondService
                .findAllBidBond(params)
                .pipe(
                    filter((res: HttpResponse<IBidBond[]>) => res.ok),
                    map((res: HttpResponse<IBidBond[]>) => res.body)
                )
                .subscribe(
                    (res: IBidBond[] | null) => {
                        if (res != null) {
                            this.BidBondData = res;
                        } else {
                            this.BidBondData = [];
                        }
                        this.isDataLoading = false;
                    },

                    (res: HttpErrorResponse) =>
                        console.log("error in extracting all BidBond", res)
                )
        );
    }

    //dynamic dialog
    showCreateBidBondDialog() {
        switch (this.dtoName) {
            case "Tender":
                if (this.BidBondData) {
                    this.showCreateBidBondByTenderDialog();
                }
                break;

            default:
                break;
        }
    }

    //dynamic dialog
    showCreateBidBondByTenderDialog() {
        const ref = this.dialogService.open(CreateUpdateBidBond, {
            data: { TenderId: this.Tender },
            header: "Create " + this.camelCaseToTitle.transform("BidBond"),
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
            this.findIfBidBondByTenderId({});
        });
    }

    //dynamic dialog
    showCreateBidBondDialogDefault() {
        const ref = this.dialogService.open(CreateUpdateBidBond, {
            header: "Create " + this.camelCaseToTitle.transform("BidBond"),
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

    showEditBidBondDialog(BidBond: BidBondDto) {
        console.log("edit eka")
        const ref = this.dialogService.open(CreateUpdateBidBond, {
            data: BidBond,
           
            header: "Update " + this.camelCaseToTitle.transform("BidBond"),
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
            this.findIfBidBondByTenderId({});
        });
    }

    //delete BidBond
    deleteBidBond(BidBond: BidBondDto) {
        this.confirmationService.confirm({
            message: `Are you sure that you want to delete ?`,
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                this.ConfirmDeleteBidBond(BidBond);
                this.messageService.add({
                    severity: "error",
                    summary: "Deleted",
                    detail: "You have deleted ",
                });
            },
        });
    }
    ConfirmDeleteBidBond(BidBond: BidBondDto) {
        this.BidBondData = this.BidBondData.filter(
            (val) => val.BidBondId !== BidBond.BidBondId
        );
        this.subscription.add(
            this.bidBondService
                .deleteBidBond({ bidBondId: BidBond.BidBondId })
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
