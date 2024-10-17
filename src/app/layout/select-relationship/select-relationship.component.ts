import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { co } from '@fullcalendar/core/internal-common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
    dtoIdNameConfig,
    getRelationshipListByDtoId,
} from 'src/app/layout/relationshipConfig/reationshipConfig';

@Component({
    selector: 'app-select-relationship',
    templateUrl: './select-relationship.component.html',
})
export class SelectRelationshipComponent {
    itemsData: dtoIdNameConfig[] = [];
    dtoId: string = '';
    Id: string = '';
    ModelData: any;
    header: any;
    submitted: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private router: Router
    ) {}

    ngOnInit(): void {
        if (this.config.data) {
            this.dtoId = this.config.data.dtoId;
            this.Id = this.config.data.id;            
            this.editOrder(this.dtoId);
            const keys = Object.keys(this.config.data);
            this.header = keys[0];
            const firstKeyValue = this.config.data[this.header];
            this.ModelData = firstKeyValue;
        }
    }

    CloseInstances() {
        this.ref.close({});
        this.submitted = false;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    // Edit order
    editOrder(dtoId: string) {
        this.dtoId = dtoId;
        this.itemsData = getRelationshipListByDtoId(dtoId) || [];
    }

    //-- View relationship --
    visit(itemName: string) {
        this.router.navigate(['/pages/' + itemName.toLowerCase()], {
            queryParams: { id: this.dtoId, primarykey: this.Id },
        });
        this.CloseInstances();
    }

    // Helper method to get object keys
    objectKeys(obj: any): string[] {
        return Object.keys(obj);
    }
}
