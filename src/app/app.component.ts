import {AfterViewInit, Component, ElementRef, HostBinding, inject, OnInit, Renderer2} from '@angular/core';
import {RouterOutlet, RouterModule, RouterLink, RouterLinkActive} from "@angular/router";
import {CommonModule} from "@angular/common";
import {VideosPartComponent} from "./Videos_pages/videos-part/videos-part.component";
import {NavDesktopPartComponent} from "./Navigation/nav-desktop-part/nav-desktop-part.component";
import {SearchPartComponent} from "./search-part/search-part.component";
import {WindowSizeService} from "./Services/window-size.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    VideosPartComponent, NavDesktopPartComponent,
    RouterLink, RouterOutlet, RouterModule, RouterLinkActive, SearchPartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit {
  isMobile: boolean = false
  windowSize = inject(WindowSizeService)

  ngOnInit() {
    if (window) {
      this.isMobile = this.windowSize.checkScreenSize(window)
    }
  }
}
