import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Background3d } from './background3d';

describe('Background3d', () => {
  let component: Background3d;
  let fixture: ComponentFixture<Background3d>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Background3d]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Background3d);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
