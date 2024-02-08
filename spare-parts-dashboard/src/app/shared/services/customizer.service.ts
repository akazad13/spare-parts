import { Injectable } from '@angular/core';
import { ConfigDB } from '../../shared/data/config/config';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomizerService {
  // Configration Layout
  public data: any;

  setTheme(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    let theme = 'light';
    if (!!user && user.theme) {
      theme = user.theme;
    }
    this.data = ConfigDB.data[theme];
    document.body.className = this.data.color.mix_layout;
    document.body.setAttribute(
      'main-theme-layout',
      this.data.settings.layout_type
    );
    document
      .getElementsByTagName('html')[0]
      .setAttribute('dir', this.data.settings.layout_type);
    const color = this.data.color.color;
    if (color) {
      this.createStyle(color);
    }
  }

  // Create style sheet append in head
  createStyle(color: string): void {
    const head = document.head;
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = window.location.origin + '/assets/css/' + color + '.css';
    head.appendChild(link);
  }
}
