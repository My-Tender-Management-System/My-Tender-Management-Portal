import { Component, OnDestroy, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { filter, finalize, map, Subscription } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

import { IUpdates, UpdatesDto } from "../../../dto/Updates.dto";
import { UpdatesService } from "../../../services/Updates.service";

// @ts-ignore
@Component({
    selector: "app-create-task",
    templateUrl: "./create-update-updates.html",
})
export class CreateUpdateUpdates implements OnInit, OnDestroy {
    updates: UpdatesDto = {};

    submitted: boolean = false;
    updatesForm!: FormGroup;
    isLoadingClient: boolean = false;
    isLoading: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private updatesService: UpdatesService,
        private messageService: MessageService,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        //set default data

        //Form Control with Validation
        this.updatesForm = this.fb.group({
            UpdatesId: [""],
            Status: [""],
            Date: ["", Validators.required],
            Remark: [""],
            Category: [""],
            FollowedBy: [""],
            TenderId: [""],
        });

        //edit updates if requested by the row click
        if (this.config.data != null) {
            this.editUpdates(this.config.data);
        }
    }

    save() {
        this.submitted = true;

        if (this.updatesForm.invalid) {
            return;
        }

        this.isLoading = true;

        const updates = this.updatesForm.value;

        if (updates.UpdatesId) {
            this.subscription.add(
                this.updatesService
                    .updateUpdates(updates)
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
                                    detail: `Updates Updated Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Update Updates.`,
                                life: 3000,
                            });
                        }
                    )
            );
        } else {
            this.subscription.add(
                this.updatesService
                    .createUpdates(updates)
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
                                    detail: `Updates Created Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Create Updates.`,
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
        this.ref.close(this.updatesForm.value);
        this.updatesForm.reset();
        this.submitted = false;
        this.updates = {};
    }

    //unsubscribe all the services
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    //edit updates
    editUpdates(updates: UpdatesDto) {
        this.updates = { ...updates };
        this.updatesForm.patchValue({ ...updates });

        this.updatesForm.patchValue({
            Date: updates.Date
                ? new Date(updates.Date).toLocaleDateString("en-US")
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
