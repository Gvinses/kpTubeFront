import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {VideosFetchService} from "../Services/videos-fetch.service";
import {FormsModule} from "@angular/forms";
import {NgIf, NgStyle} from "@angular/common";
import {SystemIconsStylesDirective} from '../Directives/system-icons-styles.directive'

@Component({
  selector: 'app-search-part',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    NgStyle,
    NgIf,
    SystemIconsStylesDirective
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
  isServerOnline: boolean = true
  isUserHaveAccount: boolean = false

  constructor(private router: Router) {
  }

  VideosFetchService = inject(VideosFetchService)


  ngOnInit() {
    if (typeof localStorage !== undefined) {
      this.gettedID = String(localStorage.getItem('UserID'))
    }
    this.getUserAvatar()
  }

  getUserAvatar() {
    this.VideosFetchService.getUserByID(this.gettedID).subscribe(
      (response): any => {
        if (response == null) {
          this.isServerOnline = false
          return
        }

        if (response[0].avatar.startsWith('http://127.0.0.1:8000/')) {
          response[0].avatar = response[0].avatar.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
          this.userAvatar = response[0].avatar
        }
      },
      (error): any => {
        this.isServerOnline = false
      }
    )
    this.isLogin()
  }

  isLogin() {
    let isInLS = (localStorage.getItem('username') !== null) && (localStorage.getItem('UserID') !== null)
    this.isUserHaveAccount = isInLS
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
    this.isInputDisabled = width < 650
  }

  searchIconClick() {
    this.isInputDisabled = !this.isInputDisabled
  }
}
