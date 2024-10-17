import { Component, OnDestroy, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { filter, finalize, map, Subscription } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

import {
    IOtherPayments,
    OtherPaymentsDto,
} from "../../../dto/OtherPayments.dto";
import { OtherPaymentsService } from "../../../services/OtherPayments.service";

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

// @ts-ignore
@Component({
    selector: "app-create-task",
    templateUrl: "./create-update-otherPayments.html",
})
export class CreateUpdateOtherPayments implements OnInit, OnDestroy {
    otherPayments: OtherPaymentsDto = {};

    submitted: boolean = false;
    otherPaymentsForm!: FormGroup;
    isLoadingClient: boolean = false;
    isLoading: boolean = false;

    filesUploaded: boolean = false;
    uploadedFiles: any[] = [];

    private subscription: Subscription = new Subscription();

    constructor(
        private otherPaymentsService: OtherPaymentsService,
        private messageService: MessageService,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        //set default data

        //Form Control with Validation
        this.otherPaymentsForm = this.fb.group({
            OtherPaymentsId: [""],
            Amount: [null, Validators.required],
            Date: ["", Validators.required],
            Description: ["", Validators.required],
            PaymentForUpload: this.fb.array([]),
            TenderId: [""],
        });

        //edit otherPayments if requested by the row click
        if (this.config.data != null) {
            this.editOtherPayments(this.config.data);
        }
    }

    onUpload(event: UploadEvent) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
            const httpResponse =
                event.originalEvent as unknown as HttpResponse<any>;
            const fileUrl = httpResponse.body;
            if (fileUrl) {
                this.filesUploaded = false;
                this.addDocumentUrl(fileUrl);
            }
        }
        this.messageService.add({
            severity: "info",
            summary: "File Uploaded",
            detail: "",
        });
    }

    addDocumentUrl(url: string) {
        const docsArray = this.otherPaymentsForm.get(
            "PaymentForUpload"
        ) as FormArray;
        docsArray.push(this.fb.control(url));
    }
    onFileSelect(event: any) {
        this.filesUploaded = true;
    }
    onFilesClear() {
        this.filesUploaded = false;
    }

    save() {
        this.submitted = true;

        if (this.filesUploaded) {
            this.messageService.add({
                severity: "error",
                summary: "Upload Required",
                detail: "Please upload the selected files before submitting.",
            });
            return;
        }

        if (this.otherPaymentsForm.invalid) {
            return;
        }

        this.isLoading = true;

        const otherPayments = this.otherPaymentsForm.value;

        if (otherPayments.OtherPaymentsId) {
            this.subscription.add(
                this.otherPaymentsService
                    .updateOtherPayments(otherPayments)
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
                                    detail: `OtherPayments Updated Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Update OtherPayments.`,
                                life: 3000,
                            });
                        }
                    )
            );
        } else {
            this.subscription.add(
                this.otherPaymentsService
                    .createOtherPayments(otherPayments)
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
                                    detail: `OtherPayments Created Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Create OtherPayments.`,
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
        this.ref.close(this.otherPaymentsForm.value);
        this.otherPaymentsForm.reset();
        this.submitted = false;
        this.otherPayments = {};
    }

    //unsubscribe all the services
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    //edit otherPayments
    editOtherPayments(otherPayments: OtherPaymentsDto) {
        this.otherPayments = { ...otherPayments };
        this.otherPaymentsForm.patchValue({ ...otherPayments });

        this.uploadedFiles = [];
        const docsArray = this.otherPaymentsForm.get(
            "PaymentForUpload"
        ) as FormArray;
        if (
            otherPayments.PaymentForUpload &&
            otherPayments.PaymentForUpload.length
        ) {
            otherPayments.PaymentForUpload.forEach((docUrl: string) => {
                docsArray.push(this.fb.control(docUrl));
                const fileName = this.extractFileName(docUrl);
                this.uploadedFiles.push({ name: fileName, url: docUrl });
            });
        }

        this.otherPaymentsForm.patchValue({
            Date: otherPayments.Date
                ? new Date(otherPayments.Date).toLocaleDateString("en-US")
                : "",
        });
    }

    extractFileName(url: string): string {
        const lastSlashIndex = url.lastIndexOf("_");
        return url.substring(lastSlashIndex + 1);
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
