import { Component, OnDestroy, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { filter, finalize, map, Subscription } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

import {
    IPerfomanceBond,
    PerfomanceBondDto,
} from "../../../dto/PerfomanceBond.dto";
import { PerfomanceBondService } from "../../../services/PerfomanceBond.service";

// @ts-ignore
@Component({
    selector: "app-create-task",
    templateUrl: "./create-update-perfomanceBond.html",
})
export class CreateUpdatePerfomanceBond implements OnInit, OnDestroy {
    perfomanceBond: PerfomanceBondDto = {};

    submitted: boolean = false;
    perfomanceBondForm!: FormGroup;
    isLoadingClient: boolean = false;
    isLoading: boolean = false;

    startDate: Date | null = null;
    endDate: Date | null = null;

    private subscription: Subscription = new Subscription();

    constructor(
        private perfomanceBondService: PerfomanceBondService,
        private messageService: MessageService,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        //set default data

        //Form Control with Validation
        this.perfomanceBondForm = this.fb.group({
            PerfomanceBondId: [""],
            Name: [""],
            Amount: [null, Validators.required],
            rangeDates: [null],
            ValidityPeriod: this.fb.group({
                start: [null],
                end: [null],
            }, { validators: this.dateRangeValidator }), 
            RefNo: [""],
            RequestedDate: [""],
            RequiredDate: [""],
            ReceivedDate: [""],
            CollectedBy: [""],
            TenderId: [""],
        });

        //edit perfomanceBond if requested by the row click
        if (this.config.data != null) {
            this.editPerfomanceBond(this.config.data);
        }
    }

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

    onDateSelect(event: Date) {
        if (!this.startDate) {
            this.startDate = event;
        } else if (!this.endDate) {
            this.endDate = event;
            this.perfomanceBondForm.patchValue({
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

        if (this.perfomanceBondForm.invalid) {
            return;
        }

        this.isLoading = true;

        const perfomanceBond = this.perfomanceBondForm.value;

        perfomanceBond.ValidityPeriod = {
            start: perfomanceBond.ValidityPeriod.start
                ? new Date(perfomanceBond.ValidityPeriod.start).toISOString()
                : null,
            end: perfomanceBond.ValidityPeriod.end
                ? new Date(perfomanceBond.ValidityPeriod.end).toISOString()
                : null,
        };

        
        if (perfomanceBond.PerfomanceBondId) {
            this.subscription.add(
                this.perfomanceBondService
                    .updatePerfomanceBond(perfomanceBond)
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
                                    detail: `PerfomanceBond Updated Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Update PerfomanceBond.`,
                                life: 3000,
                            });
                        }
                    )
            );
        } else {
            this.subscription.add(
                this.perfomanceBondService
                    .createPerfomanceBond(perfomanceBond)
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
                                    detail: `PerfomanceBond Created Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Create PerfomanceBond.`,
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
        this.ref.close(this.perfomanceBondForm.value);
        this.perfomanceBondForm.reset();
        this.submitted = false;
        this.perfomanceBond = {};
    }

    //unsubscribe all the services
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    //edit perfomanceBond
    editPerfomanceBond(perfomanceBond: PerfomanceBondDto) {
        this.perfomanceBond = { ...perfomanceBond };
        this.perfomanceBondForm.patchValue({ ...perfomanceBond });

        

        this.perfomanceBondForm.patchValue({
            RequestedDate: perfomanceBond.RequestedDate
                ? new Date(perfomanceBond.RequestedDate).toLocaleDateString(
                      "en-US"
                  )
                : "",
        });

        this.perfomanceBondForm.patchValue({
            RequiredDate: perfomanceBond.RequiredDate
                ? new Date(perfomanceBond.RequiredDate).toLocaleDateString(
                      "en-US"
                  )
                : "",
        });

        this.perfomanceBondForm.patchValue({
            ReceivedDate: perfomanceBond.ReceivedDate
                ? new Date(perfomanceBond.ReceivedDate).toLocaleDateString(
                      "en-US"
                  )
                : "",
        });

        if (perfomanceBond.ValidityPeriod) {
            this.perfomanceBondForm.patchValue({
                rangeDates: [
                    perfomanceBond.ValidityPeriod.start
                        ? new Date(perfomanceBond.ValidityPeriod.start)
                        : null,
                perfomanceBond.ValidityPeriod.end
                        ? new Date(perfomanceBond.ValidityPeriod.end)
                        : null,
                ],
            });
        }
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

