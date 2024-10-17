import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paymentsAll',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})

export class PaymentsComponent implements OnInit{
@Input() tenderId: string;

dialogVisible: boolean;
performanceDialogVisible: boolean = false;
otherPaymentsDialogVisible: boolean = false;

constructor (){}
activeIndex: number = 0;

ngOnInit(): void {

}


showDialog() {
  this.dialogVisible = true;
}

showDialogPerformanceBond() {
  this.performanceDialogVisible = true;
}

showDialogOtherPayments(){
  this.otherPaymentsDialogVisible = true;
}

}
