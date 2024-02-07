import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { AccountApi } from '../../api/base';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { TranslateService } from '@ngx-translate/core';
import { UrlService } from '../../services/url.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  email$: Observable<string | null> = this.account.user$.pipe(
    map((x) => (x ? x.email : null))
  );

  departmentsLabel$: Observable<string>;

  constructor(
    private account: AccountApi,
    private translate: TranslateService,
    public wishlist: WishlistService,
    public cart: CartService,
    public url: UrlService
  ) {}

  ngOnInit(): void {}
}
