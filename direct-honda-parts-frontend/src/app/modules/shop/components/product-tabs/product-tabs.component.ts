import { AfterContentInit, Component, ContentChildren, HostBinding, Input, QueryList } from '@angular/core';
import { PageProductLayout } from '../../pages/page-product/page-product.component';
import { ProductTabComponent } from '../product-tab/product-tab.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-product-tabs',
    templateUrl: './product-tabs.component.html',
    styleUrls: ['./product-tabs.component.scss'],
})
export class ProductTabsComponent implements AfterContentInit {
    activeTab: ProductTabComponent;

    @Input() layout: PageProductLayout;

    @ContentChildren(ProductTabComponent) tabs: QueryList<ProductTabComponent>;

    @HostBinding('class.product-tabs') classProductTabs = true;

    @HostBinding('class.product-tabs--layout--full') get classProductTabsLayoutFull(): boolean {
        return this.layout === 'full';
    }

    @HostBinding('class.product-tabs--layout--sidebar') get classProductTabsLayoutSidebar(): boolean {
        return this.layout === 'sidebar';
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngAfterContentInit(): void {
        this.route.fragment.subscribe(fragment => {
            const activeTab = this.tabs.find(x => x.id === fragment) || this.tabs.first;

            this.setActiveTab(activeTab);
        });
    }

    setActiveTab(tab: ProductTabComponent): void {
        this.activeTab = tab;
        this.tabs.forEach(x => x.isActive = x === tab);
    }

    onTabClick(event: MouseEvent, tab: ProductTabComponent): void {
        event.preventDefault();

        this.setActiveTab(tab);
    }

    getTabUrl(tab: ProductTabComponent): string {
        return this.router.createUrlTree([], {relativeTo: this.route, fragment: tab.id}).toString();
    }
}
