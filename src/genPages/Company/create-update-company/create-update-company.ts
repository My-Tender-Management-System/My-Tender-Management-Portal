import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import { filter, finalize, map, Subscription } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

  
    
    
    
    
    
    
    
    
    
    

  
    
    
    
    
    
    
    
    
    
import {
    SearchCountryField,
    CountryISO,
    PhoneNumberFormat,
} from "ngx-intl-tel-input";

    
        




import {ICompany,CompanyDto} from "../../../dto/Company.dto";
import {CompanyService} from "../../../services/Company.service";

  
    
    
    
    
    
    
    
    
    
    

// @ts-ignore
@Component({
    selector: 'app-create-task',
    templateUrl: './create-update-company.html',

})
export class CreateUpdateCompany implements OnInit, OnDestroy {
    company: CompanyDto = {};

    submitted: boolean = false;
    companyForm!: FormGroup;
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

    constructor(private companyService: CompanyService, private messageService: MessageService, public config: DynamicDialogConfig, public ref: DynamicDialogRef, private fb: FormBuilder



    
    
    ) {
    }

    ngOnInit(): void {

        //set default data
        
            
        
            
        
            
        
            
        
            
        

        //Form Control with Validation
        this.companyForm = this.fb.group({
                CompanyId: [''],
                Name: ['', Validators.required],
                Location: ['', Validators.required],
                ContactPerson: [''],
                ContactNumber: [''],
    });


        
            
        
            
        
            
        
            
        
            
        

        





        //edit company if requested by the row click
        if (this.config.data != null) {
            this.editCompany(this.config.data)
        }

    }

    
    
    
    
    
    
    
    
    
    
    
    










    save() {
        this.submitted = true;   
        
        
        
        
        
        
        
        
        
        
        
                     

        if (this.companyForm.invalid) {
            return;
        }

    
        
    
        
    
        
    
        
    
        
        const ContactNumber = this.companyForm.get('ContactNumber')?.value;
        const e164Number = ContactNumber?.e164Number;
        
        this.companyForm.patchValue({
          ContactNumber: e164Number,
        });    

        
    
        this.isLoading = true;

        const company = this.companyForm.value;

        if (company.CompanyId) {
            this.subscription.add(
                this.companyService.updateCompany(company).pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                ).subscribe((res) => {
                    if (res.body) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: `Company Updated Successfully.`,
                            life: 3000
                        });
                    }
                    this.CloseInstances();
                }, (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Failed',
                        detail: `Failed To Update Company.`,
                        life: 3000
                    });
                })
            );
        } else {
            this.subscription.add(
                this.companyService.createCompany(company).pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                ).subscribe((res) => {
                    if (res.body) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: `Company Created Successfully.`,
                            life: 3000
                        });
                    }
                    this.CloseInstances();
                }, (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Failed',
                        detail: `Failed To Create Company.`,
                        life: 3000
                    });
                })
            );
        }
    }
    



    //close dialog instances
    CloseInstances(event?: Event) {
        event?.preventDefault();
        this.ref.close(this.companyForm.value);
        this.companyForm.reset();
        this.submitted = false
        this.company = {}

    }

    //unsubscribe all the services
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

//edit company
editCompany(company: CompanyDto) {
    this.company = {...company};
    this.companyForm.patchValue({...company});
    
    
    
    
    
    
    
    
    
    
    
    
        
    
        
    
        
    
        
    
        
        

}

  
    
    
    
    
    
    
    
    
    
    

   

    //format date
    formatDate(date: string | number | Date) {
        let newdate = new Date(date)
        let month = ("0" + (newdate.getMonth() + 1)).slice(-2)
        let day = ("0" + (newdate.getDate())).slice(-2)

        if (date) {
            return newdate.getFullYear() + "-" + (month) + "-" + (day)
        } else {
            return "-"
        }
    }
}