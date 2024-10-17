import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderRelatedComponent } from './tender-related.component';

describe('TenderRelatedComponent', () => {
  let component: TenderRelatedComponent;
  let fixture: ComponentFixture<TenderRelatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenderRelatedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
