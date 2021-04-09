import { Component, OnInit } from '@angular/core';
import { ShopApi } from '../../../../api/base';
import { SectionHeaderGroup } from '../../../shared/components/section-header/section-header.component';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { Product } from '../../../../interfaces/product';
import { filter, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ShopCategory } from '../../../../interfaces/category';
import { Brand } from '../../../../interfaces/brand';

interface ProductsCarouselGroup extends SectionHeaderGroup {
  products$: Observable<Product[]>;
}

interface ProductsCarouselData {
  subject$: BehaviorSubject<ProductsCarouselGroup>;
  products$: Observable<Product[]>;
  loading: boolean;
  groups: ProductsCarouselGroup[];
}

interface BlockZoneData {
  image: string;
  mobileImage: string;
  category$: Observable<ShopCategory>;
}

interface DeferredData<T> {
  loading: boolean;
  data$: Observable<T>;
}

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  featuredProducts: ProductsCarouselData;

  blockSale: DeferredData<Product[]>;

  blockZones: BlockZoneData[] = [];

  newArrivals: DeferredData<Product[]>;

  brands$: Observable<Brand[]> = of([]);

  columnTopRated$: Observable<Product[]>;
  columnSpecialOffers$: Observable<Product[]>;
  columnBestsellers$: Observable<Product[]>;

  constructor(private shopApi: ShopApi) {}

  ngOnInit(): void {
    this.featuredProducts = this.makeCarouselData([
      {
        label: 'All',
        products$: this.shopApi.getFeaturedProducts(null, 8),
      },
      {
        label: 'Power Tools',
        products$: this.shopApi.getFeaturedProducts('power-tools', 8),
      },
      {
        label: 'Hand Tools',
        products$: this.shopApi.getFeaturedProducts('hand-tools', 8),
      },
      {
        label: 'Plumbing',
        products$: this.shopApi.getFeaturedProducts('plumbing', 8),
      },
    ]);

    this.blockSale = this.makeDeferredData(this.shopApi.getSpecialOffers(8));

    this.blockZones = [
      {
        image: 'assets/images/categories/category-overlay-1.jpg',
        mobileImage: 'assets/images/categories/category-overlay-1-mobile.jpg',
        category$: this.shopApi.getCategoryBySlug('tires-wheels', { depth: 1 }),
      },
      {
        image: 'assets/images/categories/category-overlay-2.jpg',
        mobileImage: 'assets/images/categories/category-overlay-2-mobile.jpg',
        category$: this.shopApi.getCategoryBySlug('interior-parts', {
          depth: 1,
        }),
      },
      {
        image: 'assets/images/categories/category-overlay-3.jpg',
        mobileImage: 'assets/images/categories/category-overlay-3-mobile.jpg',
        category$: this.shopApi.getCategoryBySlug('engine-drivetrain', {
          depth: 1,
        }),
      },
    ];

    this.newArrivals = this.makeDeferredData(this.shopApi.getLatestProducts(8));

    this.brands$ = this.shopApi.getBrands({ limit: 16 });

    this.columnTopRated$ = this.shopApi.getTopRatedProducts(null, 3);
    this.columnSpecialOffers$ = this.shopApi.getSpecialOffers(3);
    this.columnBestsellers$ = this.shopApi.getPopularProducts(null, 3);
  }

  groupChange(carousel: ProductsCarouselData, group: SectionHeaderGroup): void {
    carousel.subject$.next(group as ProductsCarouselGroup);
  }

  private makeCarouselData(
    groups: ProductsCarouselGroup[]
  ): ProductsCarouselData {
    const subject = new BehaviorSubject<ProductsCarouselGroup>(groups[0]);
    const carouselData: ProductsCarouselData = {
      subject$: subject,
      products$: subject.pipe(
        filter((x) => x !== null),
        tap(() => (carouselData.loading = true)),
        switchMap((group) => group.products$),
        tap(() => (carouselData.loading = false))
      ),
      loading: true,
      groups,
    };

    return carouselData;
  }

  private makeDeferredData<T>(dataSource: Observable<T>): DeferredData<T> {
    const data = {
      loading: true,
      data$: null,
    };

    data.data$ = timer(0).pipe(
      mergeMap(() => dataSource.pipe(tap(() => (data.loading = false))))
    );

    return data;
  }
}
