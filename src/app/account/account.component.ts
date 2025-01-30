import {Component, inject, OnInit} from '@angular/core'
import {FormsModule} from "@angular/forms"
import {VideosFetchService} from "../videos-fetch.service"
import {NgIf} from "@angular/common"
import {RouterLink} from "@angular/router"
import {HttpClient, HttpHeaders} from "@angular/common/http"

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
  http = inject(HttpClient)

  name: string = ''
  email: string = ''
  password: string = ''
  avatar: File | any
  header: File | any
  avatarUrl: string | ArrayBuffer | null = null
  headerUrl: string | ArrayBuffer | null = null

  enterName: string = ''
  enterPass: string = ''

  errorMessage: string | null = null

  register: boolean = false

  userData: any[] = []
  userHeader: string | ArrayBuffer | null = null
  userAvatar: string | ArrayBuffer | null = null
  userName: string | null = null
  userVideos: any[] = []
  usName: any | null = null

  usID: any | null = null
  UsNa: any | null = null
  is_registration_request_now: boolean = false
  popup_open: boolean = false
  is_error: boolean = false
  timeout: any | null = null


  ngOnInit(): void {
    this.url_setter()
  }

  avatarCreate(event: any): void {
    if (event.target.files.length > 0) {
      this.avatar = event.target.files[0]
      const file = event.target.files[0]
      if (file && file.type === 'picture/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader()
        reader.onload = () => {
          this.avatarUrl = reader.result
        }
        reader.readAsDataURL(file)
      } else {
        this.errorMessage = 'Выберите изображение.'
        this.popup_open = true
        this.is_error = true
      }
    }
  }

  headerCreate(event: any): void {
    if (event.target.files.length > 0) {
      this.header = event.target.files[0]
      const file = event.target.files[0]
      if (file && file.type === 'picture/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader()
        reader.onload = () => {
          this.headerUrl = reader.result
        }
        reader.readAsDataURL(file)
      } else {
        this.errorMessage = 'Выберите изображение.'
        this.popup_open = true
        this.is_error = true
      }
    }
  }

  onRegister() {
    let userID = Number(new Date)
    this.is_registration_request_now = true

    this.VideosFetchService.createUser(userID, this.name, this.email, this.password, this.avatar, this.header).subscribe(
      response => {
        if (localStorage) {
          localStorage.setItem('UserID', String(userID))
          localStorage.setItem('UserName', String(this.name))
          this.popup_open = true
          this.VideosFetchService.send_email(this.email).subscribe()
          this.timeout = setTimeout(() => {
            location.reload()
          }, 60000)
        }
      },
      (e) => {
        this.errorMessage = String(e.message)
        this.popup_open = true
        this.is_error = true
      }
    )
  }


  getUserID() {
    if (typeof localStorage !== 'undefined') {
      this.usID = localStorage.getItem('UserID')
      this.UsNa = localStorage.getItem('username')
    }

    return this.usID !== null && this.UsNa !== null
  }

  onEnter() {
    localStorage.setItem('username', this.enterName)
    localStorage.setItem('password', this.enterPass)

    this.VideosFetchService.enterUser(this.enterName).subscribe(
      response => {
        let userID = response[0].User_ID
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('UserID', userID)

          location.reload()
        }
      },
      error => {
        this.errorMessage = 'Неверный логин или пароль'
        this.popup_open = true
        this.is_error = true
      }
    )
  }


  url_setter() {
    if (typeof localStorage !== 'undefined') {
      this.usName = localStorage.getItem('username')
    }
    this.VideosFetchService.enterUser(String(this.usName)).subscribe(
      response => {
        if (response[0].header.startsWith('http://127.0.0.1:8000/')) {
          response[0].header = response[0].header.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
          this.userHeader = response[0].header
        }


        if (response[0].avatar.startsWith('http://127.0.0.1:8000/')) {
          response[0].avatar = response[0].avatar.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
          this.userAvatar = response[0].avatar
        }

        this.userName = response[0].name
        this.userData = response[0]

        this.VideosFetchService.getVideosByUser(String(this.userName)).subscribe((data: any) => {
          data.forEach((video: any) => {
            if (video.video && video.video.startsWith('http://127.0.0.1:8000/')) {
              video.video = video.video.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
            }
            if (video.preview && video.preview.startsWith('http://127.0.0.1:8000/')) {
              video.preview = video.preview.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
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

  close_pop_up() {
    this.popup_open = false
    this.is_error = false
    if (this.timeout != null) {
      clearTimeout(this.timeout)
      location.reload()
    }
    this.timeout = null
  }
}
