import { Component, OnDestroy, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { filter, finalize, map, Subscription } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

import { CURRENCY_DATA, Currency } from "../../../assets/currency-list";

import {
    IEquipmentDetails,
    EquipmentDetailsDto,
} from "../../../dto/EquipmentDetails.dto";
import { EquipmentDetailsService } from "../../../services/EquipmentDetails.service";
import { CreateUpdateEquipments } from "src/genPages/Equipments/create-update-equipments/create-update-equipments";
import { EquipmentsService } from "src/services/Equipments.service";
import { CamelCaseToTitlePipe } from "src/app/camel-case-to-title.pipe";
import { EquipmentsDto, IEquipments } from "src/dto/Equipments.dto";
import { ActivatedRoute, Router } from "@angular/router";
import { EquipmentFormService } from "../EquipmentDetailsState";

// @ts-ignore
@Component({
    selector: "app-create-task",
    templateUrl: "./create-update-equipmentDetails.html",
})
export class CreateUpdateEquipmentDetails implements OnInit, OnDestroy {
    EquipmentsData: EquipmentsDto[] = [];
    isDataLoading: boolean = false;

    dropdownEquipmentOptions: { label: string, value: string }[] = [];
    

    equipmentDetails: EquipmentDetailsDto = {};
    // private dialogService: DialogService;

    submitted: boolean = false;
    equipmentDetailsForm!: FormGroup;
    isLoadingClient: boolean = false;
    isLoading: boolean = false;

    currencyList: Currency[] = CURRENCY_DATA;

    private subscription: Subscription = new Subscription();

    constructor(
        private equipmentDetailsService: EquipmentDetailsService,
        private messageService: MessageService,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private fb: FormBuilder,
        private equipmentsService: EquipmentsService,
        private dialogService: DialogService,
        private router: Router,
        private equipmentFormService: EquipmentFormService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {

        this.findAllEquipments({});

        //set default data
        //Form Control with Validation
        this.equipmentDetailsForm = this.fb.group({
            EquipmentDetailsId: [""],
            EquipmentID:[""],
            Qty: [null, Validators.required],
            BidAmount: [null],
            BidBankCharge: ["", Validators.required],
            Remark: [""],
            Cost: [null],
            TenderId: [""],
        });

        this.route.queryParams.subscribe((params:any) => {
            if ('isDetail'== params['equipments']) {
                this.retrieveFromService()
            }
         })

        // this.equipmentDetailsForm.patchValue({
        //     BidAmount: "USD",
        // });

        // this.equipmentDetailsForm
        //     .get("BidAmount")
        //     .valueChanges.subscribe((selectedCurrency) => {
        //         if (
        //             selectedCurrency &&
        //             this.equipmentDetailsForm.get("BidAmount").value !==
        //                 selectedCurrency
        //         ) {
        //             this.equipmentDetailsForm.patchValue(
        //                 {
        //                     BidAmount: selectedCurrency,
        //                 },
        //                 { emitEvent: false }
        //             );
        //         }
        //     });

        // this.equipmentDetailsForm.patchValue({
        //     BidBankCharge: "USD",
        // });

        // this.equipmentDetailsForm
        //     .get("BidBankCharge")
        //     .valueChanges.subscribe((selectedCurrency) => {
        //         if (
        //             selectedCurrency &&
        //             this.equipmentDetailsForm.get("BidBankCharge").value !==
        //                 selectedCurrency
        //         ) {
        //             this.equipmentDetailsForm.patchValue(
        //                 {
        //                     BidBankCharge: selectedCurrency,
        //                 },
        //                 { emitEvent: false }
        //             );
        //         }
        //     });

        // this.equipmentDetailsForm.patchValue({
        //     Cost: "USD",
        // });

        // this.equipmentDetailsForm
        //     .get("Cost")
        //     .valueChanges.subscribe((selectedCurrency) => {
        //         if (
        //             selectedCurrency &&
        //             this.equipmentDetailsForm.get("Cost").value !==
        //                 selectedCurrency
        //         ) {
        //             this.equipmentDetailsForm.patchValue(
        //                 {
        //                     Cost: selectedCurrency,
        //                 },
        //                 { emitEvent: false }
        //             );
        //         }
        //     });

        //edit equipmentDetails if requested by the row click
        if (this.config.data != null) {
            this.editEquipmentDetails(this.config.data);
        }
    }

    save() {
        this.submitted = true;

        if (this.equipmentDetailsForm.invalid) {
            return;
        }

        this.isLoading = true;

        const equipmentDetails = this.equipmentDetailsForm.value;


        if (equipmentDetails.EquipmentDetailsId) {
            this.subscription.add(
                this.equipmentDetailsService
                    .updateEquipmentDetails(equipmentDetails)
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
                                    detail: `EquipmentDetails Updated Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Update EquipmentDetails.`,
                                life: 3000,
                            });
                        }
                    )
            );
        } else {
            this.subscription.add(
                this.equipmentDetailsService
                    .createEquipmentDetails(equipmentDetails)
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
                                    detail: `EquipmentDetails Created Successfully.`,
                                    life: 3000,
                                });
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Create EquipmentDetails.`,
                                life: 3000,
                            });
                        }
                    )
            );
        }
    }

    //close dialog instances
    CloseInstances(event?: Event, isnavigate?:boolean) {
        event?.preventDefault();
        this.ref.close(this.equipmentDetailsForm.value);
        this.equipmentDetailsForm.reset();
        this.submitted = false;
        this.equipmentDetails = {};
        if (isnavigate) {
            this.router.navigate(['/pages/equipments'], { queryParams: { equipments: 'isDetail' } });
            return;
        }
        this.equipmentFormService.clearFormData(); 
        window.location.reload
    }

    //unsubscribe all the services
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    //edit equipmentDetails
    editEquipmentDetails(equipmentDetails: EquipmentDetailsDto) {
        this.equipmentDetails = { ...equipmentDetails };
        this.equipmentDetailsForm.patchValue({ ...equipmentDetails });

        // const selectedEquipmentNameMethod = this.dropdownEquipmentOptions.find(
        //     (option) => option.value === equipmentDetails.EquipmentID
        // );
        // if (selectedEquipmentNameMethod) {
        //     this.equipmentDetailsForm.patchValue({
        //         EquipmentID: selectedEquipmentNameMethod.value,  // Use value, not object
        //     });
        // }
    }

    showCreateEquipmentsDialog() {
        this.showCreateEquipmentsDialogDefault();
    }

    showCreateEquipmentsDialogDefault() {
        const ref = this.dialogService.open(CreateUpdateEquipments, {
            // header: "Create " + this.camelCaseToTitle.transform("Equipments"),
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
            this.findAllEquipments({});
        });
    }

    findAllEquipments(params: any) {
        this.subscription.add(
          this.equipmentsService
            .findAllEquipments(params)
            .pipe(
              filter((res: HttpResponse<IEquipments[]>) => res.ok),
              map((res: HttpResponse<IEquipments[]>) => res.body)
            )
            .subscribe(
              (res: IEquipments[] | null) => {
                if (res != null) {
                  this.EquipmentsData = res;
                  this.dropdownEquipmentOptions = this.EquipmentsData.map(
                    (equipment) => ({
                      label: equipment.Name,  
                      value: equipment.Name,  
                    })
                  );
                } else {
                  this.EquipmentsData = [];
                  this.dropdownEquipmentOptions = [];
                }
                this.isDataLoading = false;
              },
              (res: HttpErrorResponse) =>
                console.log("Error in extracting all Equipments", res)
            )
        );
      }

    navigateToEquipments() {
        const equipmentDetails = this.equipmentDetailsForm.value;
        this.equipmentFormService.setFormData(equipmentDetails);
        this.CloseInstances(null,true)
    }
    
    retrieveFromService() {
        const savedData = this.equipmentFormService.getFormData();
        if (savedData) {
          this.equipmentDetailsForm.patchValue(savedData);
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
    
    onEquipmentChange(equipmentId: string) {
        const selectedEquipment = this.EquipmentsData.find(
          (equipment) => equipment.EquipmentsId === equipmentId
        );
        if (selectedEquipment) {
          this.equipmentDetailsForm.patchValue({
            EquipmentID: selectedEquipment.Name,  // Update the form control with the selected equipment's name
          });
        }
      }
}
