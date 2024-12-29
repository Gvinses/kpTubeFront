import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {VideosFetchService} from "../videos-fetch.service";
import {NgIf} from "@angular/common";
import {response} from "express";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.sass'
})
export class AccountComponent implements OnInit {
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

  errorMessage: string | null = 'Войдите или Зарегистрируйтесь';

  ngOnInit(): void {
    this.starter()
  }

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

  AlluserNames: any[] = []
  onRegister() {
    if (this.avatar && this.header) {
      let userID = Number(new Date);

      console.log(userID);
      this.VideosFetchService.getUserNames().subscribe((response => {
          for (let i = 0; i < response.length; i++) {
            this.AlluserNames.push(response[i].name);
          }
          response = null
            console.log(this.AlluserNames)
            if (this.AlluserNames.includes(this.name)) {
              this.errorMessage = 'Не может быть двух одинаковых имён!'
              setTimeout( () => {
                this.errorMessage = null;
              }, 3500)
            } else {
              if (this.avatar && this.header) {
                this.VideosFetchService.createUser(userID, this.name, this.email, this.password, this.avatar, this.header).subscribe(
                  response => {
                    console.log('Upload successful!', response);
                    if (typeof localStorage !== undefined) {
                      localStorage.clear()
                      localStorage.setItem('UserID', String(userID));
                      localStorage.setItem('UserName', String(this.name));
                      location.reload()
                    }
                  },
                  error => {
                    console.error('Upload error:', error);
                  }
                );
              }
            }
        })
      )
    }
  }

  usID: any | null = null;
  UsNa: any | null = null;

  getUserID() {
    if (typeof localStorage !== 'undefined') {
      this.usID = localStorage.getItem('UserID')
      this.UsNa = localStorage.getItem('UserName')
    }

    return this.usID !== null && this.UsNa !== null;
  }

  onEnter() {
    this.VideosFetchService.enterUser(this.enterName).subscribe(
      response => {
        console.table(response)
        if (response[0].password === this.enterPass) {
          let userID = response[0].User_ID
          if (typeof localStorage !== 'undefined') {
            localStorage.clear()
            localStorage.setItem('UserID', String(userID*2));
            localStorage.setItem('UserName', String(this.enterName));
            location.reload()
          }
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
  usNa: any | null = null;

  starter() {
    if (typeof localStorage !== 'undefined') {
      this.usNa = localStorage.getItem('UserName')
    }
      this.VideosFetchService.enterUser(String(this.usNa)).subscribe(
        response => {
          this.userData = response[0];
          if (response[0].header.startsWith('http://127.0.0.1:8000/')) {
            response[0].header = response[0].header.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
            this.userHeader = response[0].header;
          }


          if (response[0].avatar.startsWith('http://127.0.0.1:8000/')) {
            response[0].avatar = response[0].avatar.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
            this.userAvatar = response[0].avatar;
          }

          this.userName = response[0].name

          this.VideosFetchService.getVideosByUser(String(this.userName)).subscribe((data: any) => {
            data.forEach((video: any) => {
              if (video.video && video.video.startsWith('http://127.0.0.1:8000/')) {
                video.video = video.video.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
              }
              if (video.preview && video.preview.startsWith('http://127.0.0.1:8000/')) {
                video.preview = video.preview.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
              }
            })
            this.userVideos = data
            console.log(data)
          });
        }
      )
  }


  exitAccount() {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  }
}
