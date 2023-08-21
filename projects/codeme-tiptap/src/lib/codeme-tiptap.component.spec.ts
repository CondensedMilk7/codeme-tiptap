import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodemeTiptapComponent } from './codeme-tiptap.component';

describe('CodemeTiptapComponent', () => {
  let component: CodemeTiptapComponent;
  let fixture: ComponentFixture<CodemeTiptapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CodemeTiptapComponent]
    });
    fixture = TestBed.createComponent(CodemeTiptapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
