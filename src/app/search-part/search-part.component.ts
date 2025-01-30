import {Component, HostListener, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {VideosFetchService} from "../videos-fetch.service";
import {FormsModule} from "@angular/forms";
import {NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-search-part',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    NgStyle,
    NgIf
  ],
  templateUrl: './search-part.component.html',
  styleUrl: './search-part.component.sass'
})
export class SearchPartComponent implements OnInit {
  userAvatar: string | null = null
  userInput: string = ''
  gettedID: any
  isInputDisabled: boolean = false
  isMobile: boolean = false

  constructor(private router: Router) {
  }

  VideosFetchService = inject(VideosFetchService)


  ngOnInit() {
    if (window) {
      this.checkScreenSize(window.innerWidth)
    }
    if (this.isLogin()) {
      if (localStorage) {
        this.gettedID = String(Number(localStorage.getItem('UserID')) / 2)
      }
      this.VideosFetchService.getUserByID(this.gettedID).subscribe(
        (response): any => {
          if (response[0].avatar.startsWith('http://127.0.0.1:8000/')) {
            response[0].avatar = response[0].avatar.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
            this.userAvatar = response[0].avatar
          }
        },
      );
    }
  }

  isLogin(): boolean {
    return (localStorage.getItem('username') !== null) && (localStorage.getItem('UserID') !== null)
  }

  onSearch(): void {
    if (this.userInput.trim()) {
      this.router.navigate(['/search', this.userInput])
    }
  }

  onResize(event: any) {
    this.checkScreenSize(event.target.innerWidth)
  }

  checkScreenSize(width: number) {
    this.isMobile = width <= 650
    this.isInputDisabled = width > 650
  }

  searchIconClick() {
    this.isInputDisabled = !this.isInputDisabled
  }
}
