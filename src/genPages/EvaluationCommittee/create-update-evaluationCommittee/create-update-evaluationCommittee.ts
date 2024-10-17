import { Component, OnDestroy, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { filter, finalize, map, Subscription } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

import {
    SearchCountryField,
    CountryISO,
    PhoneNumberFormat,
} from "ngx-intl-tel-input";

import {
    IEvaluationCommittee,
    EvaluationCommitteeDto,
} from "../../../dto/EvaluationCommittee.dto";
import { EvaluationCommitteeService } from "../../../services/EvaluationCommittee.service";

// @ts-ignore
@Component({
    selector: "app-create-task",
    templateUrl: "./create-update-evaluationCommittee.html",
})
export class CreateUpdateEvaluationCommittee implements OnInit, OnDestroy {
    evaluationCommittee: EvaluationCommitteeDto = {};

    submitted: boolean = false;
    evaluationCommitteeForm!: FormGroup;
    isLoadingClient: boolean = false;
    isLoading: boolean = false;

    isDarkMode = true;
    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [
        CountryISO.UnitedStates,
        CountryISO.SriLanka,
    ];

    private subscription: Subscription = new Subscription();

    constructor(
        private evaluationCommitteeService: EvaluationCommitteeService,
        private messageService: MessageService,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        //set default data

        //Form Control with Validation
        this.evaluationCommitteeForm = this.fb.group({
            EvaluationCommitteeId: [""],
            Name: ["", Validators.required],
            Designation: ["", Validators.required],
            Email: [""],
            Phone: [""],
            TenderId: [""],
        });

        //edit evaluationCommittee if requested by the row click
        if (this.config.data != null) {
            this.editEvaluationCommittee(this.config.data);
        }
    }

    save() {
        this.submitted = true;

        if (this.evaluationCommitteeForm.invalid) {
            return;
        }

        const Phone = this.evaluationCommitteeForm.get("Phone")?.value;
        const e164Number = Phone?.e164Number;

        this.evaluationCommitteeForm.patchValue({
            Phone: e164Number,
        });

        this.isLoading = true;

        const evaluationCommittee = this.evaluationCommitteeForm.value;

        if (evaluationCommittee.EvaluationCommitteeId) {
            this.subscription.add(
                this.evaluationCommitteeService
                    .updateEvaluationCommittee(evaluationCommittee)
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
                                    detail: `EvaluationCommittee Updated Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Update EvaluationCommittee.`,
                                life: 3000,
                            });
                        }
                    )
            );
        } else {
            this.subscription.add(
                this.evaluationCommitteeService
                    .createEvaluationCommittee(evaluationCommittee)
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
                                    detail: `EvaluationCommittee Created Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Create EvaluationCommittee.`,
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
        this.ref.close(this.evaluationCommitteeForm.value);
        this.evaluationCommitteeForm.reset();
        this.submitted = false;
        this.evaluationCommittee = {};
    }

    //unsubscribe all the services
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    //edit evaluationCommittee
    editEvaluationCommittee(evaluationCommittee: EvaluationCommitteeDto) {
        this.evaluationCommittee = { ...evaluationCommittee };
        this.evaluationCommitteeForm.patchValue({ ...evaluationCommittee });
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
