import {
  Component,
  Input,
  ViewEncapsulation,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavService, Menu } from '../../services/nav.service';
import { Subject, Observable } from 'rxjs';
import { AccountApi } from 'src/app/api';
import { map, finalize, takeUntil } from 'rxjs/operators';
import { UserProfile } from '../../model/User/userProfile.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../model/User/user.model';
import { CustomizerService } from '../../services/customizer.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit, OnDestroy {
  public menuItems: Menu[];
  public url: any;
  public fileurl: any;

  private destroy$: Subject<void> = new Subject<void>();
  saveInProgress = false;

  firstName$: Observable<string>;
  lastName$: Observable<string>;
  email$: Observable<string>;

  constructor(
    private router: Router,
    public navServices: NavService,
    private accountApi: AccountApi,
    private toastr: ToastrService,
    private customizerService: CustomizerService
  ) {
    this.firstName$ = this.accountApi.user$.pipe(
      map((x) => (x ? x.firstName : null))
    );
    this.lastName$ = this.accountApi.user$.pipe(
      map((x) => (x ? x.lastName : null))
    );
    this.email$ = this.accountApi.user$.pipe(map((x) => (x ? x.email : null)));
    this.navServices.items.subscribe((menuItems) => {
      this.menuItems = menuItems;
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          menuItems.filter((items) => {
            if (items.path === event.url) {
              this.setNavActive(items);
            }
            if (!items.children) {
              return false;
            }
            items.children.filter((subItems) => {
              if (subItems.path === event.url) {
                this.setNavActive(subItems);
              }
              if (!subItems.children) {
                return false;
              }
              subItems.children.filter((subSubItems) => {
                if (subSubItems.path === event.url) {
                  this.setNavActive(subSubItems);
                }
              });
            });
          });
        }
      });
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Active Nave state
  setNavActive(item: any): void {
    this.menuItems.filter((menuItem) => {
      if (menuItem != item) {
        menuItem.active = false;
      }
      if (menuItem.children && menuItem.children.includes(item)) {
        menuItem.active = true;
      }
      if (menuItem.children) {
        menuItem.children.filter((submenuItems) => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
          }
        });
      }
    });
  }

  // Click Toggle menu
  toggletNavActive(item: any): void {
    if (!item.active) {
      this.menuItems.forEach((a) => {
        if (this.menuItems.includes(item)) {
          a.active = false;
        }
        if (!a.children) {
          return false;
        }
        a.children.forEach((b) => {
          if (a.children.includes(item)) {
            b.active = false;
          }
        });
      });
    }
    item.active = !item.active;
  }

  // Fileupload
  readUrl(event: any): void {
    if (event.target.files.length === 0) {
      return;
    }
    // Image upload validation
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event: any) => {
      this.url = reader.result;
    };
  }

  customize(item: string): void {
    this.updateTheme(item.toLowerCase());
  }

  updateTheme(theme: string): void {
    this.saveInProgress = true;

    this.accountApi
      .updateTheme(theme)
      .pipe(
        finalize(() => (this.saveInProgress = false)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        () => {
          const user: User = JSON.parse(localStorage.getItem('user'));
          if (!!user) {
            user.theme = theme;
            this.accountApi.setUser(user);
          }
          this.customizerService.setTheme();
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.toastr.error('You are not authorized. Please login again.');
              this.accountApi.setUser(null);
              this.router.navigateByUrl('/auth/login').then();
            } else if (error.status === 403) {
              this.toastr.error('You are not authorized to perform this task.');
            } else {
              this.toastr.error(error.error.message);
            }
          } else {
            this.toastr.error(error);
          }
        }
      );
  }
}
