import {
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { departments } from '../../../../../data/header-departments';
import { DepartmentsLink } from '../../../../interfaces/departments-link';
import { fromOutsideClick } from '../../../../functions/rxjs/from-outside-click';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  isOpen = false;

  items: DepartmentsLink[] = departments;

  currentItem;

  @HostBinding('class.departments') classDepartments = true;

  @HostBinding('class.departments--open') get classDepartmentsOpen() {
    return this.isOpen;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private elementRef: ElementRef<HTMLElement>,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      fromOutsideClick(this.elementRef.nativeElement)
        .pipe(
          filter(() => this.isOpen),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.zone.run(() => (this.isOpen = false));
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClick() {
    this.isOpen = !this.isOpen;
  }

  onMouseenter(item) {
    this.currentItem = item;
  }

  onMouseleave() {
    this.currentItem = null;
  }

  onItemClick(): void {
    this.isOpen = false;
    this.currentItem = null;
  }
}
