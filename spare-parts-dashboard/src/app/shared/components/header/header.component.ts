import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Inject,
  OnDestroy
} from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { IAccountApi } from 'src/app/api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomizerService } from '../../services/customizer.service';

const body = document.getElementsByTagName('body')[0];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public menuItems: Menu[];
  public items: Menu[];
  public searchResult = false;
  public searchResultEmpty = false;
  public openNav = false;
  public rightSidebar = false;
  public text: string;
  public elem: any;
  public isOpenMobile = false;
  @Output() rightSidebarEvent = new EventEmitter<boolean>();
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    public navServices: NavService,
    @Inject(DOCUMENT) private document: any,
    private translate: TranslateService,
    private account: IAccountApi,
    private router: Router,
    private toastr: ToastrService,
    private customizerService: CustomizerService
  ) {
    translate.setDefaultLang('en');
  }

  ngOnDestroy(): void {
    this.removeFix();
    this.destroy$.next();
    this.destroy$.complete();
  }

  rightSideBar(): void {
    this.rightSidebar = !this.rightSidebar;
    this.rightSidebarEvent.emit(this.rightSidebar);
  }

  collapseSidebar(): void {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  openMobileNav(): void {
    this.openNav = !this.openNav;
  }

  searchTerm(term: any): any {
    term ? this.addFix() : this.removeFix();
    if (!term) {
      return (this.menuItems = []);
    }
    const items = [];
    term = term.toLowerCase();
    this.items.filter((menuItems) => {
      if (
        menuItems.title.toLowerCase().includes(term) &&
        menuItems.type === 'link'
      ) {
        items.push(menuItems);
      }
      if (!menuItems.children) {
        return false;
      }
      menuItems.children.filter((subItems) => {
        if (
          subItems.title.toLowerCase().includes(term) &&
          subItems.type === 'link'
        ) {
          subItems.icon = menuItems.icon;
          items.push(subItems);
        }
        if (!subItems.children) {
          return false;
        }
        subItems.children.filter((suSubItems) => {
          if (suSubItems.title.toLowerCase().includes(term)) {
            suSubItems.icon = menuItems.icon;
            items.push(suSubItems);
          }
        });
      });
      this.checkSearchResultEmpty(items);
      this.menuItems = items;
    });
  }

  checkSearchResultEmpty(items): void {
    if (!items.length) {
      this.searchResultEmpty = true;
    } else {
      this.searchResultEmpty = false;
    }
  }

  addFix(): void {
    this.searchResult = true;
    body.classList.add('offcanvas');
  }

  removeFix(): void {
    this.searchResult = false;
    body.classList.remove('offcanvas');
    this.text = '';
  }
  ngOnInit(): void {
    this.elem = document.documentElement;
    this.navServices.items.subscribe((menuItems) => {
      this.items = menuItems;
    });
  }

  toggleFullScreen(): void {
    this.navServices.fullScreen = !this.navServices.fullScreen;
    if (this.navServices.fullScreen) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
    } else {
      if (!this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  logout(): void {
    this.account
      .signOut()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.account.setUser(null);
          this.router.navigateByUrl('/auth/login');
          this.customizerService.setTheme();
          this.toastr.success(response.message);
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.toastr.error('You are not authorized. Please login again.');
              this.account.setUser(null);
              this.router.navigateByUrl('/auth/login');
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
