import { Component } from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import { trigger, transition, style, animate } from '@angular/animations';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-nav-part',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterLink
  ],
  templateUrl: './nav-part.component.html',
  styleUrl: './nav-part.component.sass',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.2s', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.7s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class NavPartComponent {
  isOpen = false;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
