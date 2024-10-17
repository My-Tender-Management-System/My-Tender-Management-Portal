import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tender-progress',
  templateUrl: './tender-progress.component.html',
  styleUrls: ['./tender-progress.component.scss']
})
export class TenderProgressComponent implements OnInit{
  activeIndex: number = 0;
constructor(){}

ngOnInit(): void {
  
}
}
