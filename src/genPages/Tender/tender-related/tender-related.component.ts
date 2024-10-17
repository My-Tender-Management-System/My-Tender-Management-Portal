import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { Router } from '@angular/router';
import { TenderDto } from 'src/dto/Tender.dto';

@Component({
  selector: 'app-tender-related',
  templateUrl: './tender-related.component.html',
  styleUrls: ['./tender-related.component.scss']
})
export class TenderRelatedComponent implements OnInit, OnChanges {
  @Input() tenderId: string;
  items: MenuItem[];
  position: string = 'top'; 
  
  displayDialog: boolean = false;
  selectedComponent: string = '';
  selectedItemLabel: string = '';
  isDockVisible: boolean = true;

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tenderId']) {
      console.log('Updated tender id for ngOnChange:', this.tenderId);
      this.initializeItems(); 
    }
  }

  initializeItems() {
    this.items = [
      {
        label: 'Payments',
        icon: '../../assets/images/payments.svg',
        command: () => {
          this.openComponent('PaymentsComponent', 'Payments');
        }
      },
      {
        label: 'EquipmentDetails',
        icon: '../../assets/images/EquipmentDetails.svg',
        command: () => {
          this.openComponent('EquipmentDetailsComponent', 'Equipment Details');
        }
      },
      {
        label: 'OtherRequirements',
        icon: '../../assets/images/OtherRequirements.svg',
        command: () => {
          this.openComponent('OtherRequirementsComponent', 'Other Requirements');
        }
      },
      {
        label: 'TenderTeam',
        icon: '../../assets/images/team.svg',
        command: () => {
          this.openComponent('TenderTeamComponent', 'Tender Team');
        }
      },
      {
        label: 'EvaluationCommittee',
        icon: '../../assets/images/EvaluationCommittee.svg',
        command: () => {
          this.openComponent('EvaluationCommitteeComponent', 'Evaluation Committee');
        }
      },
      {
        label: 'Updates',
        icon: '../../assets/images/Updates.svg',
        command: () => {
          this.openComponent('UpdatesComponent', 'Updates');
        }
      },
    ];

    console.log('Initialized items for components.');
  }

  openComponent(component: string, label: string) {
    this.selectedComponent = component;
    this.selectedItemLabel = label;
  }

  ngOnInit() {
    if (this.tenderId) {
      console.log('Initial Tender ID this is tender-related:', this.tenderId);
    }

    this.openComponent('PaymentsComponent', 'Payments'); 
  }
}
