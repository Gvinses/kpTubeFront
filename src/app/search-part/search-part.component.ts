import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-search-part',
  standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive
    ],
  templateUrl: './search-part.component.html',
  styleUrl: './search-part.component.sass'
})
export class SearchPartComponent {

}
