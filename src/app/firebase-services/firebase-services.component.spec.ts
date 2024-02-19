import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirebaseServicesComponent } from './firebase-services.component';

describe('FirebaseServicesComponent', () => {
  let component: FirebaseServicesComponent;
  let fixture: ComponentFixture<FirebaseServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirebaseServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FirebaseServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
