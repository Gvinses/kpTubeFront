import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {VideosFetchService} from "../videos-fetch.service";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";

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

  name: string = ''
  email: string = ''
  password: string = ''
  avatar: File | any
  header: File | any
  avatarUrl: string | ArrayBuffer | null = null
  headerUrl: string | ArrayBuffer | null = null

  enterName: string = ''
  enterPass: string = ''

  errorMessage: string | null = 'Войдите или Зарегистрируйтесь';

  http = inject(HttpClient)
  register: boolean = false

  userData: any[] = []
  userHeader: string | ArrayBuffer | null = null
  userAvatar: string | ArrayBuffer | null = null
  userName: string | null = null
  userVideos: any[] = []
  usNa: any | null = null

  ngOnInit(): void {
    this.url_setter()
  }

  avatarCreate(event: any): void {
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
        this.errorMessage = 'Выберите изображение.'
      }
    }
  }

  headerCreate(event: any): void {
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
        this.errorMessage = 'Выберите изображение.'
      }
    }
  }

  AlluserNames: any[] = []

  onRegister() {
    localStorage.setItem('username', this.enterName)
    localStorage.setItem('password', this.enterPass)

    if (this.avatar && this.header) {
      let userID = Number(new Date);
      try {
        this.get_all_users(userID)
      } catch (e) {
        this.errorMessage = String(e)
        setTimeout(() => {
          this.errorMessage = null;
        }, 3500)
      }
    }
  }

  get_all_users(userID: number) {
    this.VideosFetchService.getUsers().subscribe((response) => {
      for (let i = 0; i < response.length; i++) {
        if (response[i].name == this.name) {
          throw new Error('Не может быть двух одинаковых имён!')
        }
      }

      if (this.avatar && this.header) {
        this.create_user(userID, this.avatar, this.header)
      }
    })
  }

  create_user(userID: number, avatar: File, header: File) {
    this.VideosFetchService.createUser(userID, this.name, this.email, this.password, this.avatar, this.header).subscribe(
      response => {
        if (localStorage) {
          localStorage.setItem('UserID', String(userID))
          localStorage.setItem('UserName', String(this.name))
          location.reload()
        }
      },
      (e) => {
        this.errorMessage = String(e.message)
        setTimeout(() => {
          this.errorMessage = null
        }, 3500)
        console.error('Upload error:', e)
      }
    )
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
    localStorage.setItem('username', this.enterName)
    localStorage.setItem('password', this.enterPass)

    this.VideosFetchService.enterUser(this.enterName).subscribe(
      response => {
        let userID = response[0].User_ID
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('UserID', String(userID * 2));
          localStorage.setItem('UserName', String(this.enterName));
          location.reload()
        }
      },
      error => {
        this.errorMessage = 'Неверный логин или пароль'
        console.error(error)
        setTimeout(() => {
          this.errorMessage = null;
        }, 3500)
      }
    );
  }


  url_setter() {
    if (typeof localStorage !== 'undefined') {
      this.usNa = localStorage.getItem('UserName')
    }
    this.VideosFetchService.enterUser(String(this.usNa)).subscribe(
      response => {
        if (response[0].header.startsWith('http://127.0.0.1:8000/')) {
          response[0].header = response[0].header.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
          this.userHeader = response[0].header;
        }


        if (response[0].avatar.startsWith('http://127.0.0.1:8000/')) {
          response[0].avatar = response[0].avatar.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
          this.userAvatar = response[0].avatar;
        }

        this.userName = response[0].name
        this.userData = response[0]

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
        })
      }
    )
  }


  exitAccount() {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  }

  change_method() {
    this.register = !this.register
  }
}
