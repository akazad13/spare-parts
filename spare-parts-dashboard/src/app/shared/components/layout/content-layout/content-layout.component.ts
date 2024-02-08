import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce, zoomOut, zoomIn, fadeIn, bounceIn } from 'ng-animate';
import { NavService } from '../../../services/nav.service';
import { CustomizerService } from '../../../services/customizer.service';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
  animations: [
    trigger('animateRoute', [
      transition(
        '* => *',
        useAnimation(fadeIn, {
          // Set the duration to 5seconds and delay to 2 seconds
          // params: { timing: 3}
        })
      )
    ])
  ]
})
export class ContentLayoutComponent implements OnInit, AfterViewInit {
  public rightSideBar: boolean;

  constructor(
    public navServices: NavService,
    public customizer: CustomizerService
  ) {}

  ngOnInit(): void {
    this.customizer.setTheme();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      feather.replace();
    });
  }

  @HostListener('document:click', ['$event'])
  clickedOutside(event: any): void {
    // click outside Area perform following action
    document.getElementById('outer-container').onclick = (e) => {
      e.stopPropagation();
      if (e.target != document.getElementById('search-outer')) {
        document.getElementsByTagName('body')[0].classList.remove('offcanvas');
      }
      if (e.target != document.getElementById('outer-container')) {
        document
          .getElementById('canvas-bookmark')
          .classList.remove('offcanvas-bookmark');
      }
    };
  }

  public getRouterOutletState(outlet: any): void {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  public rightSidebar($event: any): void {
    this.rightSideBar = $event;
  }
}
