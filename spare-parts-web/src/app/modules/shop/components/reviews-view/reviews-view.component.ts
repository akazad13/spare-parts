import { Component, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageProductLayout } from '../../pages/page-product/page-product.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopApi } from '../../../../api/base';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ReviewsListComponent } from '../reviews-list/reviews-list.component';

@Component({
    selector: 'app-reviews-view',
    templateUrl: './reviews-view.component.html',
    styleUrls: ['./reviews-view.component.scss'],
})
export class ReviewsViewComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    submitInProgress = false;

    form: FormGroup;

    @Input() productId: number;

    @Input() productPageLayout: PageProductLayout = 'full';

    @HostBinding('class.reviews-view') classReviewsView = true;

    @ViewChild(ReviewsListComponent) list: ReviewsListComponent;

    constructor(
        private fb: FormBuilder,
        private shop: ShopApi,
        private toastr: ToastrService,
        private translate: TranslateService,
    ) { }

    ngOnInit(): void {
        this.form = this.fb.group({
            rating: ['', [Validators.required]],
            author: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            content: ['', [Validators.required]],
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    submit(): void {
        this.form.markAllAsTouched();

        if (this.submitInProgress || this.form.invalid) {
            return;
        }

        this.submitInProgress = true;

        const formValue = this.form.value;

        this.shop.addProductReview(this.productId, {
            rating: parseFloat(formValue.rating),
            author: formValue.author,
            email: formValue.email,
            content: formValue.content,
        }).pipe(
            finalize(() => this.submitInProgress = false),
            takeUntil(this.destroy$),
        ).subscribe(() => {
            this.form.reset({
                rating: '',
                author: '',
                email: '',
                content: '',
            });
            this.list.reload();
            this.toastr.success(this.translate.instant('TEXT_TOAST_REVIEW_ADDED'));
        });
    }
}
