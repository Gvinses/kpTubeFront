import { Component } from '@angular/core';
import {NavPartComponent} from "../nav-part/nav-part.component";
import {VideosPartComponent} from "../video-part/videos-part.component";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        NavPartComponent,
        VideosPartComponent
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
