import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { Product } from '../../../interfaces/product';
import { CompareService } from '../../../services/compare.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({
    selector: '[appAddToCompare]',
    exportAs: 'addToCompare',
})
export class AddToCompareDirective implements OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    inProgress = false;

    constructor(
        private compare: CompareService,
        private cd: ChangeDetectorRef,
    ) { }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    add(product: Product): void {
        if (this.inProgress) {
            return;
        }

        this.inProgress = true;
        this.compare.add(product).pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {
                this.inProgress = false;
                this.cd.markForCheck();
            },
        });
    }
}
