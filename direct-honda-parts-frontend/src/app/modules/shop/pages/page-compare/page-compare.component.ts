import { Component, OnDestroy } from '@angular/core';
import { CompareService } from '../../../../services/compare.service';
import { Observable, Subject } from 'rxjs';
import { Product, ProductAttributeValue } from '../../../../interfaces/product';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { UrlService } from '../../../../services/url.service';
import { FormControl } from '@angular/forms';

interface Attribute {
    slug: string;
    name: string;
    sameValues: boolean;
    values: {[productId: number]: ProductAttributeValue[]};
}

@Component({
    selector: 'app-page-compare',
    templateUrl: './page-compare.component.html',
    styleUrls: ['./page-compare.component.scss'],
})
export class PageCompareComponent implements OnDestroy {
    destroy$: Subject<void> = new Subject<void>();

    products$: Observable<Product[]>;
    attributes$: Observable<Attribute[]>;
    differentAttributes$: Observable<Attribute[]>;

    show: FormControl = new FormControl('all');

    clearInProgress = false;

    constructor(
        public compare: CompareService,
        public url: UrlService,
    ) {
        this.products$ = this.compare.items$.pipe(shareReplay(1));
        this.attributes$ = this.products$.pipe(
            map(products => {
                const attributes: Attribute[] = [];

                products.forEach(product => product.attributes.forEach(pa => {
                    let attribute = attributes.find(x => x.slug === pa.slug);

                    if (!attribute) {
                        attribute = {
                            slug: pa.slug,
                            name: pa.name,
                            sameValues: false,
                            values: {},
                        };

                        attributes.push(attribute);
                    }

                    attribute.values[product.id] = pa.values;
                }));

                attributes.forEach(attribute => {
                    const values = products.map(product => {
                        return (attribute.values[product.id] || []).map(x => x.slug).sort();
                    });

                    attribute.sameValues = values.reduce((sameValues, curr) => {
                        return sameValues && (values[0].length === curr.length && values[0].join() === curr.join());
                    }, true);
                });

                return attributes;
            }),
            shareReplay(1),
        );
        this.differentAttributes$ = this.attributes$.pipe(
            map(attributes => attributes.filter(x => !x.sameValues)),
            shareReplay(1),
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    clear(): void {
        if (this.clearInProgress) {
            return;
        }

        this.clearInProgress = true;
        this.compare.clear().pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {
                this.clearInProgress = false;
            },
        });
    }
}
