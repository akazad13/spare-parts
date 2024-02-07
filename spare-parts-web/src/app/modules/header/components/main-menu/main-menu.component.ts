import { Component, HostBinding } from '@angular/core';
import { mainMenu } from '../../../../../data/header-main-menu';
import { MainMenuLink } from '../../../../interfaces/main-menu-link';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {
  items: MainMenuLink[] = mainMenu;

  hoveredItem: any;

  @HostBinding('class.main-menu') classMainMenu = true;

  constructor() {}

  onItemEnter(item: any): void {
    this.hoveredItem = item;
  }

  onItemLeave(item: any): void {
    if (this.hoveredItem === item) {
      this.hoveredItem = null;
    }
  }

  onItemClick(): void {
    this.hoveredItem = null;
  }
}
