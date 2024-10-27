import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantPermissionDialogComponent } from './grant-permission-dialog.component';

describe('GrantPermissionDialogComponent', () => {
  let component: GrantPermissionDialogComponent;
  let fixture: ComponentFixture<GrantPermissionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrantPermissionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrantPermissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
