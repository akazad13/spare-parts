import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

export interface SectionHeaderGroup {
    label: string;
}

export interface SectionHeaderLink {
    label: string;
    url: string;
}

@Component({
    selector: 'app-section-header',
    templateUrl: './section-header.component.html',
    styleUrls: ['./section-header.component.scss'],
})
export class SectionHeaderComponent implements OnInit {
    @Input() sectionTitle: string;

    @Input() arrows = false;

    @Input() groups: SectionHeaderGroup[] = [];

    @Input() links: SectionHeaderLink[] = [];

    @Input() currentGroup: SectionHeaderGroup;

    @Output() prev: EventEmitter<void> = new EventEmitter<void>();

    @Output() next: EventEmitter<void> = new EventEmitter<void>();

    @Output() changeGroup: EventEmitter<SectionHeaderGroup> = new EventEmitter<SectionHeaderGroup>();

    @HostBinding('class.section-header') classSectionHeader = true;

    constructor() { }

    onGroupClick(group: SectionHeaderGroup): void {
        if (this.currentGroup !== group) {
            this.currentGroup = group;
            this.changeGroup.emit(group);
        }
    }

    ngOnInit(): void {
        if (this.currentGroup === undefined && this.groups.length > 0) {
            this.currentGroup = this.groups[0];
        }
    }
}
