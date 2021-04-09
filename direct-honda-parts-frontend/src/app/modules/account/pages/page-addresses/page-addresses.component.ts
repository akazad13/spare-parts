import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountApi } from '../../../../api/base';
import { Subject } from 'rxjs';
import { Address } from '../../../../interfaces/address';
import { finalize, mergeMap, takeUntil } from 'rxjs/operators';
import { UrlService } from '../../../../services/url.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/modules/shared/components/confirm-modal/confirm-modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-addresses',
  templateUrl: './page-addresses.component.html',
  styleUrls: ['./page-addresses.component.scss']
})
export class PageAddressesComponent implements OnInit, OnDestroy {
  bsModalRef: BsModalRef;

  private destroy$: Subject<void> = new Subject<void>();

  addresses: Address[] = [];

  removeInProgress: number[] = [];
  isConfirm: boolean;

  constructor(
    private account: AccountApi,
    public url: UrlService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.account
      .getAllAddresses()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (x) => {
          this.addresses = x;
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.toastr.error('You are not authorized. Please login again.');
              this.account.setUser(null);
              this.router.navigateByUrl('/account/login').then();
            } else if (error.status === 403) {
              this.toastr.error('You are not authorized to perform this task.');
            } else {
              this.toastr.error(error.error.message);
            }
          } else {
            alert(error);
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  remove(address: Address): void {
    this.modal(address);
  }

  modal(address: Address): void {
    const initialState = {
      message: 'Are you sure to delete the address?'
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
      initialState
    });
    this.bsModalRef.content.proceedAction.subscribe((value) => {
      this.setModalvalue(value, address);
    });
  }

  setModalvalue(value, address: Address): void {
    this.isConfirm = value;
    if (this.removeInProgress.indexOf(address.id) !== -1) {
      return;
    }
    if (this.isConfirm === true) {
      this.removeInProgress.push(address.id);
      this.account
        .delAddress(address.id)
        .pipe(
          mergeMap(() => this.account.getAllAddresses()),
          finalize(() => {
            const index = this.removeInProgress.indexOf(address.id);

            if (index !== -1) {
              this.removeInProgress.splice(index, 1);
            }
          }),
          takeUntil(this.destroy$)
        )
        .subscribe(
          (addresses) => {
            this.addresses = addresses;
            this.toastr.success('Address removed successfully');
          },
          (error) => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 401) {
                this.toastr.error(
                  'You are not authorized. Please login again.'
                );
                this.account.setUser(null);
                this.router.navigateByUrl('/account/login').then();
              } else if (error.status === 403) {
                this.toastr.error(
                  'You are not authorized to perform this task.'
                );
              } else {
                this.toastr.error(error.error.message);
              }
            } else {
              alert(error);
            }
          }
        );
    }
  }
}
