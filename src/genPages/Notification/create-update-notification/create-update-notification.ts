import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import { filter, finalize, map, Subscription } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

  
    
    
    
    
    
    
    
    

  
    
    
    
    
    
    
    
        




import {INotification,NotificationDto} from "../../../dto/Notification.dto";
import {NotificationService} from "../../../services/Notification.service";

  
    
    
    
    
    
    
    
    

// @ts-ignore
@Component({
    selector: 'app-create-task',
    templateUrl: './create-update-notification.html',

})
export class CreateUpdateNotification implements OnInit, OnDestroy {
    notification: NotificationDto = {};

    submitted: boolean = false;
    notificationForm!: FormGroup;
    isLoadingClient: boolean = false;
    isLoading: boolean = false;
    

  
    
    
    
    
    
    
    
    

  
    
    
    
    
    
    
    
        

  
    
    
    
    
    
    
    
        



    private subscription: Subscription = new Subscription();

    constructor(private notificationService: NotificationService, private messageService: MessageService, public config: DynamicDialogConfig, public ref: DynamicDialogRef, private fb: FormBuilder



    
    
    ) {
    }

    ngOnInit(): void {

        //set default data
        
            
        
            
        
            
        
            
        

        //Form Control with Validation
        this.notificationForm = this.fb.group({
                NotificationId: [''],
                Title: [''],
                Message: [''],
                IsRead: [null],
    });


        
            
        
            
        
            
        
            
        

        





        //edit notification if requested by the row click
        if (this.config.data != null) {
            this.editNotification(this.config.data)
        }

    }

    
    
    
    
    
    
    
    
    
    










    save() {
        this.submitted = true;   
        
        
        
        
        
        
        
        
        
                     

        if (this.notificationForm.invalid) {
            return;
        }

    
        
    
        
    
        
    
        
    
        this.isLoading = true;

        const notification = this.notificationForm.value;

        if (notification.NotificationId) {
            this.subscription.add(
                this.notificationService.updateNotification(notification).pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                ).subscribe((res) => {
                    if (res.body) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: `Notification Updated Successfully.`,
                            life: 3000
                        });
                    }
                    this.CloseInstances();
                }, (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Failed',
                        detail: `Failed To Update Notification.`,
                        life: 3000
                    });
                })
            );
        } else {
            this.subscription.add(
                this.notificationService.createNotification(notification).pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                ).subscribe((res) => {
                    if (res.body) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: `Notification Created Successfully.`,
                            life: 3000
                        });
                    }
                    this.CloseInstances();
                }, (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Failed',
                        detail: `Failed To Create Notification.`,
                        life: 3000
                    });
                })
            );
        }
    }
    



    //close dialog instances
    CloseInstances(event?: Event) {
        event?.preventDefault();
        this.ref.close(this.notificationForm.value);
        this.notificationForm.reset();
        this.submitted = false
        this.notification = {}

    }

    //unsubscribe all the services
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

//edit notification
editNotification(notification: NotificationDto) {
    this.notification = {...notification};
    this.notificationForm.patchValue({...notification});
    
    
    
    
    
    
    
    
    
    
        
    
        
    
        
    
        
        

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