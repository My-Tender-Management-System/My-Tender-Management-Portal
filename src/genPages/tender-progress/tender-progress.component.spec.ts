import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderProgressComponent } from './tender-progress.component';

describe('TenderProgressComponent', () => {
  let component: TenderProgressComponent;
  let fixture: ComponentFixture<TenderProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenderProgressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
