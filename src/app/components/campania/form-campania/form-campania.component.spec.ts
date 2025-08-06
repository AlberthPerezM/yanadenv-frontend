import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCampaniaComponent } from './form-campania.component';

describe('FormCampaniaComponent', () => {
  let component: FormCampaniaComponent;
  let fixture: ComponentFixture<FormCampaniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCampaniaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCampaniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
