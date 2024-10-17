import { Component, OnDestroy, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { filter, finalize, map, Subscription } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { paymentMethods } from "../payment-method";

import {
    IOtherRequirements,
    OtherRequirementsDto,
} from "../../../dto/OtherRequirements.dto";
import { OtherRequirementsService } from "../../../services/OtherRequirements.service";

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

// @ts-ignore
@Component({
    selector: "app-create-task",
    templateUrl: "./create-update-otherRequirements.html",
})
export class CreateUpdateOtherRequirements implements OnInit, OnDestroy {
    fileSelected: boolean = false;  
    fileUploaded: boolean = false;

    otherRequirements: OtherRequirementsDto = {};
    paymentMethodOptions: { label: string; value: string }[] = [];

    submitted: boolean = false;

    otherRequirementsForm!: FormGroup;
    isLoadingClient: boolean = false;
    isLoading: boolean = false;

    filesUploaded: boolean = false;
    uploadedFiles: any[] = [];

    startDate: Date | null = null;
    endDate: Date | null = null;

    private subscription: Subscription = new Subscription();

    constructor(
        private otherRequirementsService: OtherRequirementsService,
        private messageService: MessageService,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        // Set default payment method options
        this.paymentMethodOptions = paymentMethods;

        // Initialize the form with validation
        this.otherRequirementsForm = this.fb.group({
            OtherRequirementsId: [""],
            Warranty: [null],
            RequiredDocuments: this.fb.array([]),
            MaintenanceFee: [null],
            DeliveryPeriod: [""],
            DeliveryDate: [""],
            DeliveryPlace: [""],
            PaymentMethod: [""],
            TransportCharges: [null],
            rangeDates: [null], 
            ValidityPeriod: this.fb.group({
                start: [null],
                end: [null],
            }, { validators: this.dateRangeValidator }), 
            SpecificRequirement: [""],
            TenderId: [""],
        });

        // If data is passed to the dialog, load it into the form
        if (this.config.data != null) {
            this.editOtherRequirements(this.config.data);
        }
    }
    

    // Custom validator to check that the start date is before the end date
    dateRangeValidator(formGroup: FormGroup) {
        const start = formGroup.get('start')?.value;
        const end = formGroup.get('end')?.value;

        // Ensure both dates are provided before validating
        if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);

            // If start date is after the end date, set an error
            if (startDate > endDate) {
                return { dateRangeInvalid: true }; // Invalid range
            }
        }

        return null; // Valid range
    }

    // Method to edit and set values in the form
    editOtherRequirements(otherRequirements: OtherRequirementsDto) {
        this.otherRequirements = { ...otherRequirements };
        this.otherRequirementsForm.patchValue({ ...otherRequirements });

        // Set PaymentMethod if available
        const selectedPaymentMethod = this.paymentMethodOptions.find(
            (option) => option.value === otherRequirements.PaymentMethod
        );
        if (selectedPaymentMethod) {
            this.otherRequirementsForm.patchValue({
                PaymentMethod: selectedPaymentMethod,
            });
        }

        // Handle RequiredDocuments (file uploads)
        this.uploadedFiles = [];
        const docsArray = this.otherRequirementsForm.get(
            "RequiredDocuments"
        ) as FormArray;
        if (
            otherRequirements.RequiredDocuments &&
            otherRequirements.RequiredDocuments.length
        ) {
            otherRequirements.RequiredDocuments.forEach((docUrl: string) => {
                docsArray.push(this.fb.control(docUrl));
                const fileName = this.extractFileName(docUrl);
                this.uploadedFiles.push({ name: fileName, url: docUrl });
            });
        }

        // Patch DeliveryDate as a Date object
        this.otherRequirementsForm.patchValue({
            DeliveryDate: otherRequirements.DeliveryDate
                ? new Date(otherRequirements.DeliveryDate)  // Convert string to Date object
                : null,  // Set to null if DeliveryDate is not present
        });

        // Patch ValidityPeriod dates as Date objects for the rangeDates field
        if (otherRequirements.ValidityPeriod) {
            this.otherRequirementsForm.patchValue({
                rangeDates: [
                    otherRequirements.ValidityPeriod.start
                        ? new Date(otherRequirements.ValidityPeriod.start)
                        : null,
                    otherRequirements.ValidityPeriod.end
                        ? new Date(otherRequirements.ValidityPeriod.end)
                        : null,
                ],
            });
        }
    }

    onUpload(event: UploadEvent) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
            const httpResponse = event.originalEvent as unknown as HttpResponse<any>;
            const fileUrl = httpResponse.body;
            if (fileUrl) {
                this.fileUploaded = true; 
                this.addDocumentUrl(fileUrl);
            }
        }
        this.messageService.add({
            severity: "info",
            summary: "File Uploaded",
            detail: "Your file was successfully uploaded.",
        });
    }

    addDocumentUrl(url: string) {
        const docsArray = this.otherRequirementsForm.get(
            "RequiredDocuments"
        ) as FormArray;
        docsArray.push(this.fb.control(url));
    }

    onFileSelect(event: any) {
        this.fileSelected = true;  
        this.fileUploaded = false;
    }

    onFilesClear() {
        this.filesUploaded = false;
    }

    onDateSelect(event: Date) {
        if (!this.startDate) {
            this.startDate = event;
        } else if (!this.endDate) {
            this.endDate = event;
            this.otherRequirementsForm.patchValue({
                ValidityPeriod: {
                    start: this.startDate,
                    end: this.endDate,
                },
            });
            this.startDate = null;
            this.endDate = null;
        } else {
            this.startDate = null;
            this.endDate = null;
        }
    }

    save() {
        this.submitted = true;
    
        // Remove the file upload check for edits
        // This will allow saving without uploading files if the user is editing other fields
    
        if (this.otherRequirementsForm.invalid) {
            return;
        }
    
        this.isLoading = true;
    
        const otherRequirements = this.otherRequirementsForm.value;
    
        // Process ValidityPeriod dates
        otherRequirements.ValidityPeriod = {
            start: otherRequirements.ValidityPeriod.start
                ? new Date(otherRequirements.ValidityPeriod.start).toISOString()
                : null,
            end: otherRequirements.ValidityPeriod.end
                ? new Date(otherRequirements.ValidityPeriod.end).toISOString()
                : null,
        };
    
        // Handle Payment Method
        if (otherRequirements.PaymentMethod) {
            otherRequirements.PaymentMethod = otherRequirements.PaymentMethod.value;
        }
    
        // Determine if we are editing (update) or creating
        if (otherRequirements.OtherRequirementsId) {
            // Update existing OtherRequirements
            this.subscription.add(
                this.otherRequirementsService
                    .updateOtherRequirements(otherRequirements)
                    .pipe(finalize(() => {
                        this.isLoading = false;
                    }))
                    .subscribe(
                        (res) => {
                            if (res.body) {
                                this.messageService.add({
                                    severity: "success",
                                    summary: "Successful",
                                    detail: `OtherRequirements Updated Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Update OtherRequirements.`,
                                life: 3000,
                            });
                        }
                    )
            );
        } else {
            // Create new OtherRequirements
            this.subscription.add(
                this.otherRequirementsService
                    .createOtherRequirements(otherRequirements)
                    .pipe(finalize(() => {
                        this.isLoading = false;
                    }))
                    .subscribe(
                        (res) => {
                            if (res.body) {
                                this.messageService.add({
                                    severity: "success",
                                    summary: "Successful",
                                    detail: `OtherRequirements Created Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Create OtherRequirements.`,
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
        this.ref.close(this.otherRequirementsForm.value);
        this.otherRequirementsForm.reset();
        this.submitted = false;
    }
    
    // Extract the file name from the URL
    extractFileName(url: string): string {
        const lastSlashIndex = url.lastIndexOf("_");
        return url.substring(lastSlashIndex + 1);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
