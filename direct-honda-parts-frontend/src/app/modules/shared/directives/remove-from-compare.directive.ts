import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../../../interfaces/product';
import { takeUntil } from 'rxjs/operators';
import { CompareService } from '../../../services/compare.service';

@Directive({
    selector: '[appRemoveFromCompare]',
    exportAs: 'removeFromCompare',
})
export class RemoveFromCompareDirective implements OnDestroy {
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

    remove(product: Product): void {
        if (this.inProgress) {
            return;
        }

        this.inProgress = true;
        this.compare.remove(product).pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {
                this.inProgress = false;
                this.cd.markForCheck();
            },
        });
    }
}
