import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopCategory } from '../../../../interfaces/category';
import { Breadcrumb } from '../../../shared/components/block-header/block-header.component';
import { UrlService } from '../../../../services/url.service';
import { Observable, of } from 'rxjs';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../language/services/language.service';
import { getCategoryPath } from '../../../../functions/utils';

interface AsyncData<T> {
  data$: Observable<T>;
  loading: boolean;
}

function asyncData<T>(source$: Observable<T>): AsyncData<T> {
  const container: AsyncData<T> = {
    data$: of(null).pipe(
      tap(() => (container.loading = true)),
      switchMap(() => source$),
      tap(() => (container.loading = false))
    ),
    loading: false
  };

  return container;
}

export interface PageCategoryData {
  category?: ShopCategory;
  children?: ShopCategory[];
}

@Component({
  selector: 'app-page-category',
  templateUrl: './page-category.component.html',
  styleUrls: ['./page-category.component.scss']
})
export class PageCategoryComponent implements OnInit {
  isContentOpen = true;

  category$: Observable<ShopCategory>;

  children$: Observable<ShopCategory[]>;

  pageTitle$: Observable<string>;

  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private language: LanguageService,
    public url: UrlService
  ) {}

  ngOnInit(): void {
    this.category$ = this.route.data.pipe(
      map((data: PageCategoryData) => data.category)
    );

    this.children$ = this.route.data.pipe(
      map((data: PageCategoryData) =>
        data.category ? data.category.children : data.children
      ),
      map((categories) => categories || [])
    );

    this.pageTitle$ = this.category$.pipe(
      mergeMap((category) =>
        category ? of(category.name) : this.translate.stream('HEADER_SHOP')
      )
    );

    this.breadcrumbs$ = this.language.current$.pipe(
      switchMap(() =>
        this.category$.pipe(
          map((category) => [
            {
              label: this.translate.instant('LINK_HOME'),
              url: this.url.home()
            },
            {
              label: this.translate.instant('LINK_SHOP'),
              url: this.url.shop()
            },
            ...getCategoryPath(category).map((x) => ({
              label: x.name,
              url: this.url.category(x)
            }))
          ])
        )
      )
    );
  }
}
