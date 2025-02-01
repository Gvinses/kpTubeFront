import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {trigger, transition, style, animate} from '@angular/animations';
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-nav-part',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterLink,
    FormsModule
  ],
  templateUrl: './nav-part.component.html',
  styleUrl: './nav-part.component.sass',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('0.2s', style({opacity: 1}))
      ]),
      transition(':leave', [
        animate('0.7s', style({opacity: 0}))
      ])
    ])
  ]
})
export class NavPartComponent {
  isSlav = false

  isOpen = false


  constructor(private router: Router) {
  }

  toggleMenu() {
    this.isOpen = !this.isOpen
  }

  set_client_web_pos() {
    this.router.navigate(['/'])
  }
}
