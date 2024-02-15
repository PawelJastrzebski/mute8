import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouterComponent } from './couter.component';

describe('CouterComponent', () => {
  let component: CouterComponent;
  let fixture: ComponentFixture<CouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
