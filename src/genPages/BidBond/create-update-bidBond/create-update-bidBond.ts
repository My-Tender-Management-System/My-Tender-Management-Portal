import { Component, OnDestroy, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { filter, finalize, map, Subscription } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BANKS_LIST } from "../banks-list";
import {
    SearchCountryField,
    CountryISO,
    PhoneNumberFormat,
} from "ngx-intl-tel-input";

import { IBidBond, BidBondDto } from "../../../dto/BidBond.dto";
import { BidBondService } from "../../../services/BidBond.service";
import { CompanyDto, ICompany } from "src/dto/Company.dto";
import { CompanyService } from "src/services/Company.service";

// @ts-ignore
@Component({
    selector: "app-create-task",
    templateUrl: "./create-update-bidBond.html",
})
export class CreateUpdateBidBond implements OnInit, OnDestroy {
    bidBond: BidBondDto = {};
    CompanyData: CompanyDto[] = [];
    dropdownCompanyOptions: { label: string; value: string }[] = [];
    banksDropdownOptions: { label: string; value: string }[] = [];
    rangeDates: Date[];

    startDate: Date | null = null;
    endDate: Date | null = null;

    submitted: boolean = false;
    bidBondForm!: FormGroup;
    isLoadingClient: boolean = false;
    isLoading: boolean = false;
    isDataLoading: boolean = false;

    isDarkMode = true;
    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [
        CountryISO.UnitedStates,
        CountryISO.SriLanka,
    ];

    companyOptions: { label: string; value: string}[]=[];

    private subscription: Subscription = new Subscription();

    constructor(
        private bidBondService: BidBondService,
        private companyService: CompanyService,
        private messageService: MessageService,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.findAllCompany({});
        this.banksDropdownOptions = BANKS_LIST;

        this.bidBondForm = this.fb.group({
            BidBondId: [""],
            Amount: [null, Validators.required],
            Status: [""],
            Company: [""],
            RefNo: [""],
            rangeDates: [null], // Date range selection
            ValidityPeriod: this.fb.group({
                start: [null],
                end: [null],
            }, { validators: this.dateRangeValidator }),
            GuaranteeType: [""],
            BeneficiaryName: [""],
            Remark: [""],
            BeneficiaryMobile: [""],
            RequestedDate: [""],
            RequiredDate: [""],
            Bank: [""],
            Branch: [""],
            CollectedBy: [""],
            ReceivedDate: [""],
            TenderId: [""],
        });

        console.log(this.bidBondForm);

        //edit bidBond if requested by the row click
        if (this.config.data != null) {
            this.editBidBond(this.config.data);
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

    oncompanyChange(companyid: string) {
        // console.log("hi", companyid)
   
            const selectedCompany = this.CompanyData.find(
                (company) => company.CompanyId === companyid
            );
            if (selectedCompany) {
                this.bidBondForm.patchValue({
                    Company: selectedCompany.Name,
                  
                });
                // console.log("546677667i", selectedCompany.Name,)      
        }
    }

    onDateSelect(event: Date) {
        if (!this.startDate) {
            this.startDate = event;
        } else if (!this.endDate) {
            this.endDate = event;
            this.bidBondForm.patchValue({
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

        if (this.bidBondForm.invalid) {
            return;
        }

        const BeneficiaryMobile =
            this.bidBondForm.get("BeneficiaryMobile")?.value;
        const e164Number = BeneficiaryMobile?.e164Number;

        this.bidBondForm.patchValue({
            BeneficiaryMobile: e164Number,
        });

        this.isLoading = true;

        const bidBond = this.bidBondForm.value;

        if (bidBond.Bank) {
            bidBond.Bank = bidBond.Bank.value; // Use the ID value
        }

        bidBond.ValidityPeriod = {
            start: bidBond.ValidityPeriod.start
                ? new Date(bidBond.ValidityPeriod.start).toISOString()
                : null,
            end: bidBond.ValidityPeriod.end
                ? new Date(bidBond.ValidityPeriod.end).toISOString()
                : null,
        };

        console.log("Final BidBond Data:", bidBond);

        if (bidBond.BidBondId) {
            this.subscription.add(
                this.bidBondService
                    .updateBidBond(bidBond)
                    .pipe(
                        finalize(() => {
                            this.isLoading = false;
                        })
                    )
                    .subscribe(
                        (res) => {
                            if (res.body) {
                                const successMessage = `BidBond Updated Successfully.`;
                                this.messageService.add({
                                    severity: "success",
                                    summary: "Successful",
                                    detail: `BidBond Updated Successfully.`,
                                    life: 3000,
                                });
                                console.log(`Success Notification Triggered at if: ${new Date().toLocaleString()} - Message: ${successMessage}`);
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            const errorMessage = `Failed To Update BidBond.`;
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Update BidBond.`,
                                life: 3000,
                            });
                            console.log(`Error Notification Triggered at if: ${new Date().toLocaleString()} - Message: ${errorMessage}`);
                        
                        }
                    )
            );
        } 
        else {
            this.subscription.add(
                this.bidBondService
                    .createBidBond(bidBond)
                    .pipe(
                        finalize(() => {
                            this.isLoading = false;
                        })
                    )
                    .subscribe(
                        (res) => {
                            if (res.body) {
                                const successMessage = `BidBond Created Successfully.`;
                                this.messageService.add({
                                    severity: "success",
                                    summary: "Successful",
                                    detail: `BidBond Created Successfully.`,
                                    life: 3000,
                                });
                                console.log(`Success Notification Triggered at else: ${new Date().toLocaleString()} - Message: ${successMessage}`);
                            }
                            this.CloseInstances();
                        },
                        (error) => {
                            const errorMessage = `Failed To Create BidBond.`;
                            this.messageService.add({
                                severity: "error",
                                summary: "Failed",
                                detail: `Failed To Create BidBond.`,
                                life: 3000,
                            });
                            console.log(`Error Notification Triggered at else: ${new Date().toLocaleString()} - Message: ${errorMessage}`);
                        }
                    )
            );
        }
    }

    //close dialog instances
    CloseInstances(event?: Event) {
        event?.preventDefault();
        this.ref.close(this.bidBondForm.value);
        this.bidBondForm.reset();
        this.submitted = false;
        this.bidBond = {};
    }

    //unsubscribe all the services
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    //edit bidBond
    editBidBond(bidBond: BidBondDto) {
        this.bidBond = { ...bidBond };
        this.bidBondForm.patchValue({ ...bidBond });
        console.log(bidBond)

    //     const companyOption = this.dropdownCompanyOptions.find(option => option.value === bidBond.Company);
    //     this.bidBondForm.patchValue({
    //     Company: companyOption ? companyOption : null,
    //     Bank: bidBond.Bank || null,
    // });

        const selectedBank = this.banksDropdownOptions.find(
            (option) => option.value === bidBond.Bank
        );
        if (selectedBank) {
            this.bidBondForm.patchValue({
                Bank: selectedBank,
            });
        }

        // bidBond.ValidityPeriod = {
        //     start: bidBond.ValidityPeriod.start
        //         ? new Date(bidBond.ValidityPeriod.start).toISOString()
        //         : null,
        //     end: bidBond.ValidityPeriod.end
        //         ? new Date(bidBond.ValidityPeriod.end).toISOString()
        //         : null,
        // };

        // console.log("Final Form Data for Submission:", bidBond);

        this.bidBondForm.patchValue({
            RequestedDate: bidBond.RequestedDate
                ? new Date(bidBond.RequestedDate).toLocaleDateString("en-US")
                : "",
        });

        this.bidBondForm.patchValue({
            RequiredDate: bidBond.RequiredDate
                ? new Date(bidBond.RequiredDate).toLocaleDateString("en-US")
                : "",
        });

        this.bidBondForm.patchValue({
            ReceivedDate: bidBond.ReceivedDate
                ? new Date(bidBond.ReceivedDate).toLocaleDateString("en-US")
                : "",
        });

        if (bidBond.ValidityPeriod) {
            this.bidBondForm.patchValue({
                rangeDates: [
                    bidBond.ValidityPeriod.start
                        ? new Date(bidBond.ValidityPeriod.start)
                        : null,
                    bidBond.ValidityPeriod.end
                        ? new Date(bidBond.ValidityPeriod.end)
                        : null,
                ],
            });
        }
    }

       
    

    findAllCompany(params: any) {
        this.subscription.add(
            this.companyService
                .findAllCompany(params)
                .pipe(
                    filter((res: HttpResponse<ICompany[]>) => res.ok),
                    map((res: HttpResponse<ICompany[]>) => res.body)
                )
                .subscribe(
                    (res: ICompany[] | null) => {
                        if (res != null) {
                            this.CompanyData = res;
                            this.companyOptions = this.CompanyData.map(
                                (company) => ({
                                    label: company.Name,
                                    value: company.Name,
                                })
                            );
                            console.log(this.dropdownCompanyOptions);
                        } else {
                            this.CompanyData = [];
                            this.companyOptions = [];
                        }
                        this.isDataLoading = false;
                    },
                    (res: HttpErrorResponse) =>
                        console.log("error in extracting all Company", res)
                )
        );
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
