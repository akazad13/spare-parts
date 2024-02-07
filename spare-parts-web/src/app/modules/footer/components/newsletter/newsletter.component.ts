import { Component, HostBinding } from '@angular/core';
import { theme } from '../../../../../data/theme';

@Component({
    selector: 'app-newsletter',
    templateUrl: './newsletter.component.html',
    styleUrls: ['./newsletter.component.scss'],
})
export class NewsletterComponent {
    @HostBinding('class.footer-newsletter') classFooterNewsletter = true;

    theme = theme;

    socialLinks = [
        {type: 'facebook',  url: theme.author.profile_url, icon: 'fab fa-facebook-f'},
        {type: 'twitter',   url: theme.author.profile_url, icon: 'fab fa-twitter'},
        {type: 'youtube',   url: theme.author.profile_url, icon: 'fab fa-youtube'},
        {type: 'instagram', url: theme.author.profile_url, icon: 'fab fa-instagram'},
        {type: 'rss',       url: theme.author.profile_url, icon: 'fas fa-rss'},
    ];

    constructor() { }
}
