import {Component, HostListener, inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {VideosFetchService} from "../videos-fetch.service";
import {response} from "express";
import {FormsModule} from "@angular/forms";
import {NgIf, NgStyle} from "@angular/common";
import {ViewportRuler} from '@angular/cdk/scrolling';

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
  isButtonEnabled: boolean = false
  isInputEnabled: boolean = true
  accountButtons: boolean = true

  constructor(private router: Router, private viewportRuler: ViewportRuler) {
  }

  VideosFetchService = inject(VideosFetchService)

  ngOnInit() {
    this.onViewportResize()
    if (this.isLogin()) {
      if (localStorage) {
        this.gettedID = String(Number(localStorage.getItem('UserID')) / 2)
        console.log(this.gettedID)
      }
      this.VideosFetchService.getUserByID(this.gettedID).subscribe(
        (response): any => {
          console.log(response)
          if (response[0].avatar.startsWith('http://127.0.0.1:8000/')) {
            response[0].avatar = response[0].avatar.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
            this.userAvatar = response[0].avatar
            console.log(response[0].avatar)
          }
        },
      )
    }
    this.viewportRuler.change(100).subscribe(() => this.onViewportResize())
  }

  isLogin(): boolean {
    return (localStorage.getItem('UserName') !== null) && (localStorage.getItem('UserID') !== null)
  }

  onEnter(): void {
    if (this.userInput.trim()) {
      this.router.navigate(['/search', this.userInput])
    }
  }

  onViewportResize() {
    let tempWidth = this.viewportRuler.getViewportSize().width
    this.isButtonEnabled = tempWidth < 500
    this.isInputEnabled = tempWidth > 500
    this.accountButtons = true
  }

  enableChange() {
    this.isInputEnabled = !this.isInputEnabled;
    this.accountButtons = !this.accountButtons
  }
}
