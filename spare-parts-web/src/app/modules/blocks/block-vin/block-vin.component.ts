import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { VehicleApi } from 'src/app/api/base';

@Component({
  selector: 'app-block-vin',
  templateUrl: './block-vin.component.html',
  styleUrls: ['./block-vin.component.scss']
})
export class BlockVinComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private vehicleService: VehicleApi) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      vin: ['']
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  findParts(): void {}
}
