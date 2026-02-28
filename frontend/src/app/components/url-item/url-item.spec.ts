import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlItem } from './url-item';

describe('UrlItem', () => {
  let component: UrlItem;
  let fixture: ComponentFixture<UrlItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrlItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
