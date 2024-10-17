import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import { filter, finalize, map, Subscription } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

  
    
    
    
    
    
    
    
    
    
    
    
    

  
    
    
    
    
    
    
    
    
    
    
    
        




import {ITenderTeam,TenderTeamDto} from "../../../dto/TenderTeam.dto";
import {TenderTeamService} from "../../../services/TenderTeam.service";

  
    
    
    
    
    
    
    
    
    
    
    
    

// @ts-ignore
@Component({
    selector: 'app-create-task',
    templateUrl: './create-update-tenderTeam.html',

})
export class CreateUpdateTenderTeam implements OnInit, OnDestroy {
    tenderTeam: TenderTeamDto = {};

    submitted: boolean = false;
    tenderTeamForm!: FormGroup;
    isLoadingClient: boolean = false;
    isLoading: boolean = false;
    

  
    
    
    
    
    
    
    
    
    
    
    
    

  
    
    
    
    
    
    
    
    
    
    
    
        

  
    
    
    
    
    
    
    
    
    
    
    
        



    private subscription: Subscription = new Subscription();

    constructor(private tenderTeamService: TenderTeamService, private messageService: MessageService, public config: DynamicDialogConfig, public ref: DynamicDialogRef, private fb: FormBuilder



    
    
    ) {
    }

    ngOnInit(): void {

        //set default data
        
            
        
            
        
            
        
            
        
            
        
            
        

        //Form Control with Validation
        this.tenderTeamForm = this.fb.group({
                TenderTeamId: [''],
                TeamName: ['', Validators.required],
                TeamLead: [''],
                NumberOfMembers: [null],
                IsActive: [null],
                Members: this.fb.array([]),
    });


        
            
        
            
        
            
        
            
        
            
        
            
        

        





        //edit tenderTeam if requested by the row click
        if (this.config.data != null) {
            this.editTenderTeam(this.config.data)
        }

    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    










    save() {
        this.submitted = true;   
        
        
        
        
        
        
        
        
        
        
        
        
        
                     

        if (this.tenderTeamForm.invalid) {
            return;
        }

    
        
    
        
    
        
    
        
    
        
    
        
    
        this.isLoading = true;

        const tenderTeam = this.tenderTeamForm.value;

        if (tenderTeam.TenderTeamId) {
            this.subscription.add(
                this.tenderTeamService.updateTenderTeam(tenderTeam).pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                ).subscribe((res) => {
                    if (res.body) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: `TenderTeam Updated Successfully.`,
                            life: 3000
                        });
                    }
                    this.CloseInstances();
                }, (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Failed',
                        detail: `Failed To Update TenderTeam.`,
                        life: 3000
                    });
                })
            );
        } else {
            this.subscription.add(
                this.tenderTeamService.createTenderTeam(tenderTeam).pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                ).subscribe((res) => {
                    if (res.body) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: `TenderTeam Created Successfully.`,
                            life: 3000
                        });
                    }
                    this.CloseInstances();
                }, (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Failed',
                        detail: `Failed To Create TenderTeam.`,
                        life: 3000
                    });
                })
            );
        }
    }
    



    //close dialog instances
    CloseInstances(event?: Event) {
        event?.preventDefault();
        this.ref.close(this.tenderTeamForm.value);
        this.tenderTeamForm.reset();
        this.submitted = false
        this.tenderTeam = {}

    }

    //unsubscribe all the services
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

//edit tenderTeam
editTenderTeam(tenderTeam: TenderTeamDto) {
    this.tenderTeam = {...tenderTeam};
    this.tenderTeamForm.patchValue({...tenderTeam});
    
    
    
    
    
    
    
    
    
    
    
    
    
    
        
    
        
    
        
    
        
    
        
    
        
        

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