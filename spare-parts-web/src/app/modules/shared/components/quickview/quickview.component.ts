import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { Product } from '../../../../interfaces/product';
import { QuickviewService } from '../../../../services/quickview.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { filter, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { UrlService } from '../../../../services/url.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from '../../../../services/cart.service';
import { NavigationStart, Router } from '@angular/router';

@Component({
    selector: 'app-quickview',
    templateUrl: './quickview.component.html',
    styleUrls: ['./quickview.component.scss'],
})
export class QuickviewComponent implements OnDestroy, AfterViewInit {
    private destroy$: Subject<void> = new Subject();

    showGallery = false;

    product: Product = null;

    form: FormGroup;

    addToCartInProgress = false;

    @ViewChild('modal') modal: ModalDirective;

    constructor(
        private fb: FormBuilder,
        private quickview: QuickviewService,
        private translate: TranslateService,
        private cart: CartService,
        private router: Router,
        public url: UrlService,
    ) { }

    ngAfterViewInit(): void {
        this.quickview.show$.pipe(
            switchMap(product => {
                this.modal.show();
                this.product = product;

                this.form = this.fb.group({
                    options: [{}],
                    quantity: [1, [Validators.required]],
                });

                // We are waiting for when the content will be rendered.
                // 150 = BACKDROP_TRANSITION_DURATION
                return timer(150);
            }),
            takeUntil(this.destroy$),
        ).subscribe(() => {
            // Show gallery only after content is rendered.
            this.showGallery = this.product !== null;
        });

        this.router.events.pipe(
            filter(event => event instanceof NavigationStart),
            takeUntil(this.destroy$),
        ).subscribe(() => {
            if (this.modal && this.modal.isShown) {
                this.modal.hide();
            }
        });

        this.modal.onHidden.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.product = null;
            this.showGallery = false;
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    addToCart(): void {
        if (this.addToCartInProgress) {
            return;
        }
        if (this.form.get('quantity').invalid) {
            alert(this.translate.instant('ERROR_ADD_TO_CART_QUANTITY'));
            return;
        }
        if (this.form.get('options').invalid) {
            alert(this.translate.instant('ERROR_ADD_TO_CART_OPTIONS'));
            return;
        }

        const options: {name: string; value: string}[] = [];
        const formOptions = this.form.get('options').value;

        Object.keys(formOptions).forEach(optionSlug => {
            const option = this.product.options.find(x => x.slug === optionSlug);

            if (!option) {
                return;
            }

            const value = option.values.find(x => x.slug === formOptions[optionSlug]);

            if (!value) {
                return;
            }

            options.push({name: option.name, value: value.name});
        });

        this.addToCartInProgress = true;

        this.cart.add(this.product, this.form.get('quantity').value, options).pipe(
            finalize(() => this.addToCartInProgress = false),
        ).subscribe();
    }
}
