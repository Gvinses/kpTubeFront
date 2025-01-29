import {AfterViewInit, Component, ElementRef, HostBinding, OnInit, Renderer2} from '@angular/core';
import {RouterOutlet, RouterModule, RouterLink, RouterLinkActive} from "@angular/router";
import {CommonModule} from "@angular/common";
import {VideosPartComponent} from "./video-part/videos-part.component";
import {NavPartComponent} from "./nav-part/nav-part.component";
import {SearchPartComponent} from "./search-part/search-part.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    VideosPartComponent, NavPartComponent,
    RouterLink, RouterOutlet, RouterModule, RouterLinkActive, SearchPartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {}
