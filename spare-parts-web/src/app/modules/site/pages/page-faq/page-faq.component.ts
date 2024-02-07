import { Component } from '@angular/core';
import { UrlService } from '../../../../services/url.service';

@Component({
    selector: 'app-page-faq',
    templateUrl: './page-faq.component.html',
    styleUrls: ['./page-faq.component.scss'],
})
export class PageFaqComponent {
    constructor(
        public url: UrlService,
    ) { }
}
