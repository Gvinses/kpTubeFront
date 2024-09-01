import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {VideosFetchService} from "../videos-fetch.service";
import {NgIf} from "@angular/common";
import {response} from "express";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.sass'
})
export class AccountComponent {
  VideosFetchService = inject(VideosFetchService)

  name: string = '';
  email: string = '';
  password: string = '';
  avatar: File | null = null;
  header: File | null = null;
  avatarUrl: string | ArrayBuffer | null = null;
  headerUrl: string | ArrayBuffer | null = null;

  enterName: string = '';
  enterPass: string = '';

  errorMessage: string | null = null;

  avatarCreate(event: any): void  {
    if (event.target.files.length > 0) {
      this.avatar = event.target.files[0];
      const file = event.target.files[0];
      if (file && file.type === 'picture/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader();
        reader.onload = () => {
          this.avatarUrl = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a image.');
      }
    }
  }

  headerCreate(event: any): void  {
    if (event.target.files.length > 0) {
      this.header = event.target.files[0];
      const file = event.target.files[0];
      if (file && file.type === 'picture/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader();
        reader.onload = () => {
          this.headerUrl = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a image.');
      }
    }
  }

  onRegister() {
    if (this.avatar && this.header) {
      let userID = Number(new Date);
      console.log(userID);
      this.VideosFetchService.createUser(userID, this.name, this.email, this.password, this.avatar, this.header).subscribe(
        response => {
          console.log('Upload successful!', response);
          if (localStorage) {
            localStorage.setItem('UserID', String(userID*2));
            localStorage.setItem('UserName', String(this.name));
          }
        },
        error => {
          console.error('Upload error:', error);
        }
      );
    }
  }

  getUserID() {
    let usID = localStorage.getItem('UserID')
    let UsNa = localStorage.getItem('UserName')

    return usID !== null && UsNa !== null;
  }

  onEnter() {
    this.VideosFetchService.enterUser(this.enterName).subscribe(
      response => {
        if (response[0].password === this.enterPass) {
          let userID = response[0].User_ID
          localStorage.setItem('UserID', String(userID*2));
          localStorage.setItem('UserName', String(this.enterName));

        } else {
          this.errorMessage = 'Неверный пароль';
          setTimeout( () => {
            this.errorMessage = null;
          }, 3500)
        }
      },
      error => {
        this.errorMessage = error.message
      }
    );
  }

  userData: any[] = []
  userHeader: string | ArrayBuffer | null = null;
  userAvatar: string | ArrayBuffer | null = null;
  userName: string | null = null;
  userVideos: any[] = []

  constructor() {
    let usNa = localStorage.getItem('UserName')
      this.VideosFetchService.enterUser(String(usNa)).subscribe(
        response => {
          this.userData = response[0];
          if (response[0].header && response[0].header.startsWith('http://127.0.0.1:8000/')) {
            response[0].header = response[0].header.replace('http://127.0.0.1:8000/', 'https://kringeproduction.ru/files/');
          }
          this.userHeader = response[0].header;

          if (response[0].avatar && response[0].avatar.startsWith('http://127.0.0.1:8000/')) {
            response[0].avatar = response[0].avatar.replace('http://127.0.0.1:8000/', 'https://kringeproduction.ru/files/');
          }
          this.userAvatar = response[0].avatar;

          this.userName = response[0].name

          this.userVideos = response[0].videos
        }
      )
  }
}
