import {Component} from '@angular/core';
import {RouterOutlet, RouterModule, RouterLink, RouterLinkActive} from "@angular/router";
import {CommonModule} from "@angular/common";
import {VideoPartComponent} from "./video-part/video-part.component";
import {NavPartComponent} from "./nav-part/nav-part.component";
import {SearchPartComponent} from "./search-part/search-part.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    VideoPartComponent, NavPartComponent,
    RouterLink, RouterOutlet, RouterModule, RouterLinkActive, SearchPartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {

}