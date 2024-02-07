import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AddressFormComponent } from '../../../shared/components/address-form/address-form.component';
import { AccountApi, EditAddressData } from '../../../../api/base';
import { Address } from '../../../../interfaces/address';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/modules/shared/components/confirm-modal/confirm-modal.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-page-edit-address',
  templateUrl: './page-edit-address.component.html',
  styleUrls: ['./page-edit-address.component.scss']
})
export class PageEditAddressComponent implements OnInit, OnDestroy {
  bsModalRef: BsModalRef;
  private destroy$: Subject<void> = new Subject<void>();

  form: UntypedFormGroup;

  @ViewChild(AddressFormComponent) addressForm: AddressFormComponent;
  addressId = null;
  saveInProgress = false;
  isAddOperation = true;
  addressType = 0;
  currentAddress: any;
  address: any;
  newAddressId = 0;
  hasDefaultAddress = false;
  hasShippingAddress = false;
  hasOtherAddress = false;
  allAddress: any = [];

  constructor(
    private accountApi: AccountApi,
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      address: []
    });
    this.accountApi
      .getAllAddresses()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (x) => {
          this.allAddress = x;
          const i = this.allAddress.length;
          for (let j = 0; j < i; j++) {
            if (this.allAddress[j].addressType === 1) {
              this.hasDefaultAddress = true;
            }
            if (this.allAddress[j].addressType === 2) {
              this.hasShippingAddress = true;
            }
            if (this.allAddress[j].addressType === 3) {
              this.hasOtherAddress = true;
            }
          }
          this.setDefault();
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.toastr.error('You are not authorized. Please login again.');
              this.accountApi.setUser(null);
              this.router.navigateByUrl('/account/login').then();
            } else if (error.status === 403) {
              this.toastr.error('You are not authorized to perform this task.');
            } else {
              this.form.setErrors({
                server: error.error.message
              });
            }
          } else {
            this.toastr.error(error);
          }
        }
      );

    this.route.params.subscribe((params: any) => {
      this.addressId = parseInt(params.id, 10);
      if (this.addressId) {
        this.accountApi
          .getAddresswithId(this.addressId)

          .subscribe((response) => {
            this.process(response[0]);
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  process(data: any): null {
    this.currentAddress = data;
    this.newAddressId = this.currentAddress.id;
    this.isAddOperation = false;
    this.addressType = this.currentAddress.addressType;
    if (data) {
      this.form.get('address').patchValue({
        firstName: this.currentAddress.firstName,
        lastName: this.currentAddress.lastName,
        companyName: this.currentAddress.companyName,
        country: this.currentAddress.country,
        address: this.currentAddress.address,
        city: this.currentAddress.city,
        state: this.currentAddress.state,
        postcode: this.currentAddress.postCode,
        email: this.currentAddress.email,
        phone: this.currentAddress.phone
      });
    }
    return;
  }
  save(): void {
    this.form.markAllAsTouched();
    this.addressForm.markAsTouched();
    if (this.saveInProgress || this.form.invalid) {
      return;
    }

    if (this.form.value.address.addressType === true) {
      this.form.value.address.addressType = '1';
    } else if (this.form.value.address.addressType === false) {
      this.form.value.address.addressType = '3';
    }

    if (this.addressType !== 0 && this.form.value.address.addressType !== '1') {
      this.addressType = this.addressType;
    } else if (
      this.addressType === 3 &&
      this.form.value.address.addressType === '1'
    ) {
      this.confirmUpdate();
      return;
    } else {
      this.addressType = +this.form.value.address.addressType;
    }
    this.savingData();
  }
  cancel(): void {
    this.router.navigateByUrl('/account/addresses').then();
  }
  savingData(): void {
    const addressData: EditAddressData = {
      ...this.form.value.address,
      id: this.newAddressId,
      addressType: this.addressType,
      isAddOperation: this.isAddOperation
    };

    this.saveInProgress = true;

    this.accountApi
      .addorUpdateAddress(addressData)
      .pipe(
        finalize(() => (this.saveInProgress = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        () => {
          this.router.navigateByUrl('/account/addresses');
          this.toastr.success('Address added Successfully');
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.toastr.error('You are not authorized. Please login again.');
              this.accountApi.setUser(null);
              this.router.navigateByUrl('/account/login').then();
            } else if (error.status === 403) {
              this.toastr.error('You are not authorized to perform this task.');
            } else {
              this.form.setErrors({
                server: error.error.message
              });
            }
          } else {
            alert(error);
          }
        }
      );
  }

  setDefault(): void {
    if (this.hasDefaultAddress === false) {
      this.form.get('address').patchValue({
        addressType: '1'
      });
    } else if (this.hasShippingAddress === false) {
      this.form.get('address').patchValue({
        addressType: '2'
      });
    } else if (this.hasOtherAddress === false) {
      this.form.get('address').patchValue({
        addressType: '3'
      });
    }
  }

  confirmUpdate(): void {
    const initialState = {
      message:
        'Are you sure to change the address to default? This will set your previous default address to additional address.'
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState
    });
    this.bsModalRef.content.proceedAction.subscribe((value: boolean) => {
      if (value) {
        this.addressType = 1;
        this.savingData();
      }
    });
  }
}
