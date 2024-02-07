import { Component, HostBinding, Input } from '@angular/core';
import { LanguageService } from '../../../language/services/language.service';
import { CompareService } from '../../../../services/compare.service';

export type TopbarLayout = 'spaceship-start' | 'spaceship-end';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Input() layout: TopbarLayout;

  @HostBinding('class.topbar') classTopbar = true;

  @HostBinding('class.topbar--spaceship-start')
  get classTopbarSpaceshipStart(): boolean {
    return this.layout === 'spaceship-start';
  }

  @HostBinding('class.topbar--spaceship-end')
  get classTopbarSpaceshipEnd(): boolean {
    return this.layout === 'spaceship-end';
  }

  constructor(
    public language: LanguageService,
    public compare: CompareService
  ) {}
}
