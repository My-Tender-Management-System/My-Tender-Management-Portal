import { Component, OnDestroy, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { filter, finalize, map, Subscription } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

import { IEquipments, EquipmentsDto } from "../../../dto/Equipments.dto";
import { EquipmentsService } from "../../../services/Equipments.service";

// @ts-ignore
@Component({
    selector: "app-create-task",
    templateUrl: "./create-update-equipments.html",
})
export class CreateUpdateEquipments implements OnInit, OnDestroy {
    equipments: EquipmentsDto = {};

    submitted: boolean = false;
    equipmentsForm!: FormGroup;
    isLoadingClient: boolean = false;
    isLoading: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        private equipmentsService: EquipmentsService,
        private messageService: MessageService,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        //set default data

        //Form Control with Validation
        this.equipmentsForm = this.fb.group({
            EquipmentsId: [""],
            Name: ["", Validators.required],
            Make: ["", Validators.required],
            Model: ["", Validators.required],
            RefNo: [""],
            Country: [""],
            UnitPrice: [null],
        });

        //edit equipments if requested by the row click
        if (this.config.data != null) {
            this.editEquipments(this.config.data);
        }
    }

    save() {
        this.submitted = true;

        if (this.equipmentsForm.invalid) {
            return;
        }

        this.isLoading = true;

        const equipments = this.equipmentsForm.value;

        if (equipments.EquipmentsId) {
            this.subscription.add(
                this.equipmentsService
                    .updateEquipments(equipments)
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
                                    detail: `Equipments Updated Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Update Equipments.`,
                                life: 3000,
                            });
                        }
                    )
            );
        } else {
            this.subscription.add(
                this.equipmentsService
                    .createEquipments(equipments)
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
                                    detail: `Equipments Created Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Create Equipments.`,
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
        this.ref.close(this.equipmentsForm.value);
        this.equipmentsForm.reset();
        this.submitted = false;
        this.equipments = {};
    }

    //unsubscribe all the services
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    //edit equipments
    editEquipments(equipments: EquipmentsDto) {
        this.equipments = { ...equipments };
        this.equipmentsForm.patchValue({ ...equipments });
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
