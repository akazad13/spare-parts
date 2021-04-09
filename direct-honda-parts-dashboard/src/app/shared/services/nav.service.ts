import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';

// Menu
export interface Menu {
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
  allowedRole: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NavService {
  public screenWidth: any;
  public collapseSidebar = false;
  public fullScreen = false;

  // Windows width
  @HostListener('window:resize', ['$event'])
  MENUITEMS: Menu[] = [
    {
      path: '/dashboard',
      title: 'Dashboard',
      icon: 'home',
      type: 'link',
      active: false,
      allowedRole: ['Admin', 'Dealer', 'Standard']
    },
    {
      title: 'Profile',
      icon: 'user',
      type: 'sub',
      active: false,
      children: [
        {
          path: '/profile/view',
          title: 'View Profile',
          icon: 'eye',
          type: 'link',
          allowedRole: ['Admin', 'Dealer', 'Standard']
        },
        {
          path: '/profile/edit',
          title: 'Edit Profile',
          icon: 'edit',
          type: 'link',
          allowedRole: ['Admin', 'Dealer', 'Standard']
        },
        {
          path: '/profile/change-password',
          title: 'Change Password',
          icon: 'refresh-ccw',
          type: 'link',
          allowedRole: ['Admin', 'Dealer', 'Standard']
        }
      ],
      allowedRole: ['Admin', 'Dealer', 'Standard']
    },
    {
      title: 'Users',
      icon: 'users',
      type: 'sub',
      active: false,
      children: [
        {
          path: '/users/view',
          title: 'All Users',
          icon: 'list',
          type: 'link',
          allowedRole: ['Admin']
        },
        {
          path: '/users/add',
          title: 'Add User',
          icon: 'user-plus',
          type: 'link',
          allowedRole: ['Admin']
        }
      ],
      allowedRole: ['Admin']
    },
    {
      title: 'Customize',
      icon: 'layout',
      type: 'sub',
      active: false,
      children: [
        {
          path: '/',
          title: 'Light',
          icon: 'circle',
          type: 'customize',
          allowedRole: ['Admin', 'Dealer', 'Standard']
        },
        {
          path: '/',
          title: 'Black',
          icon: 'circle',
          type: 'customize',
          allowedRole: ['Admin', 'Dealer', 'Standard']
        },
        {
          path: '/',
          title: 'Dark',
          icon: 'circle',
          type: 'customize',
          allowedRole: ['Admin', 'Dealer', 'Standard']
        }
      ],
      allowedRole: ['Admin', 'Dealer', 'Standard']
    },
    {
      path: '/faq',
      title: 'FAQ',
      icon: 'help-circle',
      type: 'link',
      allowedRole: ['Admin']
    },
    {
      path: '/knowledgebase',
      title: 'Knowledgebase',
      icon: 'database',
      type: 'link',
      allowedRole: ['Admin', 'Dealer', 'Standard']
    },
    {
      path: '/support-ticket',
      title: 'Support Ticket',
      icon: 'headphones',
      type: 'link',
      allowedRole: ['Admin', 'Dealer', 'Standard']
    }
  ];
  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

  constructor() {
    this.onResize();
    if (this.screenWidth < 991) {
      this.collapseSidebar = true;
    }
  }

  onResize(event?: any): void {
    this.screenWidth = window.innerWidth;
  }
}
