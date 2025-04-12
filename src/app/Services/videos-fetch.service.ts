import {inject, Injectable} from '@angular/core'
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {Observable} from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class VideosFetchService {

  apiUrl = 'https://kptube.kringeproduction.ru/videos/'
  account = 'https://kptube.kringeproduction.ru/users/'
  category = 'https://kptube.kringeproduction.ru/categories/'
  comment = 'https://kptube.kringeproduction.ru/comments/'
  create_user = 'https://kptube.kringeproduction.ru/create_users/'
  watch_video = 'https://kptube.kringeproduction.ru/watch_video/'
  like = 'https://kptube.kringeproduction.ru/like/'
  send_mail = 'https://kptube.kringeproduction.ru/send_mail/?email='
  subscribe = 'https://kptube.kringeproduction.ru/subscribe/'

  http = inject(HttpClient)

  constructor() {
  }

  getVideos(): any {
    return this.http.get<any>(this.apiUrl)
  }

  getVideosByUser(userName: string): any {
    return this.http.get<any>(this.apiUrl + '?owner=' + userName)
  }

  getVideo(Video_Id: string) {
    return this.http.get(this.apiUrl + '?Video_ID=' + Video_Id)
  }

  getCategories(): any {
    return this.http.get(this.category)
  }

  uploadVideo(file: File, name: string, description: string, preview: File, owner: string, category: any, isGlobal: boolean): Observable<any> {
    const formData = new FormData()
    formData.append('Video_ID', String(Number(new Date())))
    formData.append('video', file)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('preview', preview)
    formData.append('owner', owner)
    formData.append('category', category)
    formData.append('isGlobal', String(isGlobal))

    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')

    console.log(formData)
    console.log(file)

    let headers = new HttpHeaders()

    headers = headers.set('X-USERNAME', String(username))
    headers = headers.set('X-PASSWORD', String(password))


    return this.http.post(this.apiUrl, formData, {headers: headers})
  }

  createUser(userID: string, name: string, email: string, password: string, avatar: File, header: File) {
    const formData = new FormData()
    formData.append('User_ID', userID)
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('avatar', avatar)
    formData.append('header', header)

    return this.http.post(this.create_user, formData)
  }

  send_email(mail: string): Observable<any> {
    return this.http.get((this.send_mail + mail))
  }

  enterUser(name: string) {
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')

    let headers = new HttpHeaders()

    headers = headers.set('X-USERNAME', String(username))
    headers = headers.set('X-PASSWORD', String(password))

    return this.http.get<any>(`${this.account}?name=${name}`, {headers: headers})
  }


  getUserByID(UserID: string) {

    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')

    let headers = new HttpHeaders()

    headers = headers.set('X-USERNAME', String(username))
    headers = headers.set('X-PASSWORD', String(password))

    return this.http.get<any>(this.account + '?User_ID=' + UserID, {headers: headers})
  }

  addView(USID: string, VIDEOID: string): Observable<any> {
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')

    let current_date = new Date()


    let headers = new HttpHeaders()

    headers = headers.set('X-USERNAME', String(username))
    headers = headers.set('X-PASSWORD', String(password))

    let post_data = {
      'User_ID': USID,
      'Video_ID': VIDEOID,
      'length': 0,
      'date': current_date.getDate(),
      'time': current_date.getTime(),
      'time_zone': current_date.getTimezoneOffset()
    }

    return this.http.post(this.watch_video, post_data, {headers: headers})
  }

  PostStars(USID: any, VIDEOID: any, likes: any) {
    let returnedOBJ = {
      "User_ID": USID,
      "Video_ID": VIDEOID,
      "likes": likes,
    }

    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')

    let headers = new HttpHeaders()

    headers = headers.set('X-USERNAME', String(username))
    headers = headers.set('X-PASSWORD', String(password))

    return this.http.post(this.like, returnedOBJ, {headers: headers})
  }


  createComment(text: string, Video_ID: string, owner: string) {
    const formData = new FormData()
    formData.append('text', String(text))
    formData.append('Video_ID', Video_ID)
    formData.append('owner', owner)


    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')

    let headers = new HttpHeaders()

    headers = headers.set('X-USERNAME', String(username))
    headers = headers.set('X-PASSWORD', String(password))


    return this.http.post(this.comment, formData, {headers: headers})
  }

  subscribeToBlogger(User_ID: string, Blogger_ID: string) {
    const formData = new FormData()

    formData.append('User_ID', String(User_ID))
    formData.append('Blogger_ID', String(Blogger_ID))

    let headers = new HttpHeaders()

    const username = String(localStorage.getItem('username'))
    const password = String(localStorage.getItem('password'))

    headers = headers.set('X-USERNAME', username)
    headers = headers.set('X-PASSWORD', password)

    return this.http.post(this.subscribe, formData, {headers: headers})
  }

  unSubscribeFromBlogger(User_ID: string, Blogger_ID: string) {
    const formData = new FormData()
    formData.append('User_ID', String(User_ID))
    formData.append('Blogger_ID', String(Blogger_ID))

    const username = String(localStorage.getItem('username'))
    const password = String(localStorage.getItem('password'))

    let headers = new HttpHeaders()
    headers = headers.set('X-USERNAME', username)
    headers = headers.set('X-PASSWORD', password)

    return this.http.put(this.subscribe, formData, {headers: headers})
  }


  deleteVideoFromHistory(VideoID: string) {
    let headers = new HttpHeaders()

    const username = String(localStorage.getItem('username'))
    const password = String(localStorage.getItem('password'))

    headers = headers.set('X-USERNAME', username)
    headers = headers.set('X-PASSWORD', password)


  }


  deleteVideo(id: number) {
    return this.http.delete(this.apiUrl + '/' + id)
  }
}
