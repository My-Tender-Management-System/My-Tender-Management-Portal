import { Component, OnDestroy, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { filter, finalize, map, Subscription } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ITender, TenderDto } from "../../../dto/Tender.dto";
import { TenderService } from "../../../services/Tender.service";

import { TENDER_SOURCES_LIST } from "../Tender-Sources";
import { TENDER_STATUS_LIST } from "../tender-status";

// @ts-ignore
@Component({
    selector: "app-create-task",
    templateUrl: "./create-update-tender.html",
})
export class CreateUpdateTender implements OnInit, OnDestroy {
    tender: TenderDto = {};
    TenderSourcesDropdownOptions = [
        { label: "Government Portal", value: "gov_portal" },
        { label: "Private Portal", value: "private_portal" },
        { label: "Newspaper", value: "newspaper" },
        { label: "Company Website", value: "company_website" },
        { label: "Third-Party Agency", value: "third_party_agency" },
        { label: "Email Invitation", value: "email_invitation" },
        { label: "Social Media", value: "social_media" },
        { label: "Online Tendering Platform", value: "online_platform" },
        { label: "Word of Mouth", value: "word_of_mouth" },
        { label: "Consulting Firm", value: "consulting_firm" },
        { label: "Other", value: "other" },
    ];

    TenderStatusDropdownOptions = [
        { label: "Open", value: "open" },
        { label: "Closed", value: "closed" },
        { label: "Approved", value: "approved" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Under Evaluation", value: "under_evaluation" },
        { label: "Rejected", value: "rejected" },
    ];

    submitted: boolean = false;
    tenderForm!: FormGroup;
    isLoadingClient: boolean = false;
    isLoading: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private tenderService: TenderService,
        private messageService: MessageService,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        //set default data
        this.TenderSourcesDropdownOptions = TENDER_SOURCES_LIST;

        //Form Control with Validation
        this.tenderForm = this.fb.group({
            TenderId: [""],
            Title: ["", Validators.required],
            Description: [""],
            OpeningDate: ["", Validators.required],
            ClosingDate: ["", Validators.required],
            Status: ["", Validators.required],
            TenderNumber: ["", Validators.required],
            DocumentFee: [""],
            TenderSource: ["", Validators.required],
            AdvertisementDate: [""],
            LastCollectableDate: [""],
            CollectionPlace: [""],
            CollectedBy: [""],
            CollectedDate: [""],
        });

        //edit tender if requested by the row click
        if (this.config.data != null) {
            this.editTender(this.config.data);
        }
    }

    save() {
        this.submitted = true;

        if (this.tenderForm.invalid) {
            return;
        }

        this.isLoading = true;

        const tender = this.tenderForm.value;

        if (tender.TenderSource) {
            tender.TenderSource = tender.TenderSource.value;
        }

        if (tender.Status) {
            tender.Status = tender.Status.value; 
        }

        if (tender.TenderId) {
            this.subscription.add(
                this.tenderService
                    .updateTender(tender)
                    .pipe(
                        finalize(() => {
                            this.isLoading = false;
                        })
                    )
                    .subscribe(
                        (res) => {
                            if (res.body) {
                                this.messageService.add({
                                    severity: "success",
                                    summary: "Successful",
                                    detail: `Tender Updated Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Update Tender.`,
                                life: 3000,
                            });
                        }
                    )
            );
        } else {
            this.subscription.add(
                this.tenderService
                    .createTender(tender)
                    .pipe(
                        finalize(() => {
                            this.isLoading = false;
                        })
                    )
                    .subscribe(
                        (res) => {
                            if (res.body) {
                                this.messageService.add({
                                    severity: "success",
                                    summary: "Successful",
                                    detail: `Tender Created Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Create Tender.`,
                                life: 3000,
                            });
                        }
                    )
            );
        }
    }

    //close dialog instances
    CloseInstances(event?: Event) {
        event?.preventDefault();
        this.ref.close(this.tenderForm.value);
        this.tenderForm.reset();
        this.submitted = false;
        this.tender = {};
    }

    //unsubscribe all the services
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    //edit tender
    editTender(tender: TenderDto) {
        this.tender = { ...tender };
        this.tenderForm.patchValue({ ...tender });

        const selectedStatus = this.TenderStatusDropdownOptions.find(
            (option) => option.value === tender.Status
        );
        if (selectedStatus) {
            this.tenderForm.patchValue({
                Status: selectedStatus,
            });
        }

        const selectedSource = this.TenderSourcesDropdownOptions.find(
            (option) => option.value === tender.TenderSource
        );
        if (selectedSource) {
            this.tenderForm.patchValue({
                TenderSource: selectedSource,
            });
        }

        this.tenderForm.patchValue({
            OpeningDate: tender.OpeningDate
                ? new Date(tender.OpeningDate).toLocaleDateString("en-US")
                : "",
        });

        this.tenderForm.patchValue({
            ClosingDate: tender.ClosingDate
                ? new Date(tender.ClosingDate).toLocaleDateString("en-US")
                : "",
        });

        this.tenderForm.patchValue({
            AdvertisementDate: tender.AdvertisementDate
                ? new Date(tender.AdvertisementDate).toLocaleDateString("en-US")
                : "",
        });

        this.tenderForm.patchValue({
            LastCollectableDate: tender.LastCollectableDate
                ? new Date(tender.LastCollectableDate).toLocaleDateString(
                      "en-US"
                  )
                : "",
        });

        this.tenderForm.patchValue({
            CollectedDate: tender.CollectedDate
                ? new Date(tender.CollectedDate).toLocaleDateString("en-US")
                : "",
        });
    }

    //format date
    formatDate(date: string | number | Date) {
        let newdate = new Date(date);
        let month = ("0" + (newdate.getMonth() + 1)).slice(-2);
        let day = ("0" + newdate.getDate()).slice(-2);

        if (date) {
            return newdate.getFullYear() + "-" + month + "-" + day;
        } else {
            return "-";
        }
    }
}
