import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeListElementComponent } from './tree-list-element.component';

describe('TreeListElementComponent', () => {
  let component: TreeListElementComponent;
  let fixture: ComponentFixture<TreeListElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeListElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
