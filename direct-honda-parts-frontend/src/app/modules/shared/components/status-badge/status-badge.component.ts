import { Component, HostBinding, Input } from '@angular/core';

export type StatusBadgeType = 'success' | 'failure' | 'warning' | 'unknown';

export type StatusBadgeIcon = 'success' | 'failure';

@Component({
    selector: 'app-status-badge',
    templateUrl: './status-badge.component.html',
    styleUrls: ['./status-badge.component.scss'],
})
export class StatusBadgeComponent {
    @Input() type: StatusBadgeType;

    @Input() icon: StatusBadgeIcon;

    @Input() text: string;

    @Input() tooltipContent: string;

    @HostBinding('class.status-badge') classStatusBadge = true;

    @HostBinding('class.status-badge--style--success') get classStatusBadgeTypeSuccess(): boolean {
        return this.type === 'success';
    }

    @HostBinding('class.status-badge--style--failure') get classStatusBadgeTypeFailure(): boolean {
        return this.type === 'failure';
    }

    @HostBinding('class.status-badge--style--warning') get classStatusBadgeTypeWarning(): boolean {
        return this.type === 'warning';
    }

    @HostBinding('class.status-badge--style--unknown') get classStatusBadgeTypeUnknown(): boolean {
        return this.type === 'unknown';
    }

    @HostBinding('class.status-badge--has-text') get classStatusBadgeHasText(): boolean {
        return !!this.text;
    }

    @HostBinding('class.status-badge--has-icon') get classStatusBadgeHasIcon(): boolean {
        return !!this.icon;
    }

    constructor() { }
}
