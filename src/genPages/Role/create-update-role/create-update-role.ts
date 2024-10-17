import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import { filter, finalize, map, Subscription } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

  
    
    
    
    
    
    
    
    

  
    
    
    
    
    
    
    
        


import {PermissionDto} from '../../../dto/Role.dto';
import { PermissionCategories } from '../../../app/layout/roleConfig/roleConfig';



import {IRole,RoleDto} from "../../../dto/Role.dto";
import {RoleService} from "../../../services/Role.service";

  
    
    
    
    
    
    
    
    

// @ts-ignore
@Component({
    selector: 'app-create-task',
    templateUrl: './create-update-role.html',

})
export class CreateUpdateRole implements OnInit, OnDestroy {
    role: RoleDto = {};

    submitted: boolean = false;
    roleForm!: FormGroup;
    isLoadingClient: boolean = false;
    isLoading: boolean = false;
    

  
    
    
    
    
    
    
    
    

  
    
    
    
    
    
    
    
        

  
    
    
    
    
    
    
    
        



    PermissionCategories = PermissionCategories;
    cruds: PermissionDto[] = [
        { Name: 'Add', Key: 'A' },
        { Name: 'Update', Key: 'U' },
        { Name: 'Read', Key: 'R' },
        { Name: 'Delete', Key: 'D' },
    ];


    private subscription: Subscription = new Subscription();

    constructor(private roleService: RoleService, private messageService: MessageService, public config: DynamicDialogConfig, public ref: DynamicDialogRef, private fb: FormBuilder



    
    
    ) {
    }

    ngOnInit(): void {

        //set default data
        
            
        
            
        
            
        
            
        

        //Form Control with Validation
        this.roleForm = this.fb.group({
                RoleId: [''],
                Name: [''],
                Description: [''],
                PermissionCategories: [''],
    });


        
            
        
            
        
            
        
            
        

        





        //edit role if requested by the row click
        if (this.config.data != null) {
            this.editRole(this.config.data)
        }

    }

    
    
    
    
    
    
    
    
    
    







    save() {
        this.submitted = true;
        this.role.PermissionCategories = this.PermissionCategories;

        if (this.checkValidation()) {
            //update if their is an objectId
            if (this.role.RoleId) {
                this.subscription.add(
                    this.roleService.updateRole(this.role).subscribe(
                        () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Update Successfully',
                                life: 3000,
                            });
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Failed',
                                detail: `Failed to update`,
                                life: 3000,
                            });
                        }
                    )
                );
            }
            //else create role
            else {
                this.subscription.add(
                    this.roleService.createRole(this.role).subscribe(
                        () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Create Successfully ',
                                life: 3000,
                            });
                            this.CloseInstances();
                        },
                        (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Failed',
                                detail: `Failed to create`,
                                life: 3000,
                            });
                        }
                    )
                );
            }
        }
    }

    checkValidation() {
        if (this.role && this.role.Name && this.role.Description) {
            return true;
        } else {
            return false;
        }
    }




    //close dialog instances
    CloseInstances(event?: Event) {
        event?.preventDefault();
        this.ref.close(this.roleForm.value);
        this.roleForm.reset();
        this.submitted = false
        this.role = {}

    }

    //unsubscribe all the services
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

//edit role
editRole(role: RoleDto) {
    this.role = {...role};
    this.roleForm.patchValue({...role});
    
    
    
    
    
    
    
    
    
    
        
    
        
    
        
    
        
        

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