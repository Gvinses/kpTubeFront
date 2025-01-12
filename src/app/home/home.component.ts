import { Component } from '@angular/core';
import {NavPartComponent} from "../nav-part/nav-part.component";
import {VideoPartComponent} from "../video-part/video-part.component";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        NavPartComponent,
        VideoPartComponent
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
