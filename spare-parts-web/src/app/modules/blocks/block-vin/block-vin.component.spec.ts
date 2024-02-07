/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BlockVinComponent } from './block-vin.component';

describe('BlockVinComponent', () => {
  let component: BlockVinComponent;
  let fixture: ComponentFixture<BlockVinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockVinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockVinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
