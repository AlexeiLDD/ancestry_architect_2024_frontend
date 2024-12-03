import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNodePairComponent } from './create-node-pair.component';

describe('CreateNodePairComponent', () => {
  let component: CreateNodePairComponent;
  let fixture: ComponentFixture<CreateNodePairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNodePairComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNodePairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
