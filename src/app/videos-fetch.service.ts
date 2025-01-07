import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VideosFetchService {

  apiUrl = 'https://kptube.kringeproduction.ru/videos/';
  account = 'https://kptube.kringeproduction.ru/users/';
  category = 'https://kptube.kringeproduction.ru/categories/';
  comment = 'https://kptube.kringeproduction.ru/comments/';
  create_user = 'https://kptube.kringeproduction.ru/create_user/'

  http = inject(HttpClient)

  constructor() {
  }

  getHeaders() {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    let headers = new HttpHeaders()

    headers.set('X-USERNAME', String(username))
    headers.set('X-PASSWORD', String(password))

    return headers
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
    const formData = new FormData();
    formData.append('Video_ID', String(Number(new Date())));
    formData.append('video', file);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('preview', preview);
    formData.append('owner', owner);
    formData.append('category', category);
    formData.append('isGlobal', String(isGlobal));

    // https://kptube.kringeproduction.ru/users/?name=Gvins

    console.log(this.http.post(this.apiUrl, formData, {headers: this.getHeaders(), reportProgress: true}))
    return this.http.post(this.apiUrl, formData, {headers: this.getHeaders(), reportProgress: true})
  }

  createUser(userID: number, name: string, email: string, password: string, avatar: File, header: File) {
    const formData = new FormData();
    formData.append('User_ID', String(userID));
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('avatar', avatar);
    formData.append('header', header);

    return this.http.post(this.create_user, formData);
  }

  enterUser(name: string) {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    let headers = new HttpHeaders()

    headers = headers.set('X-USERNAME', String(username))
    headers = headers.set('X-PASSWORD', String(password))

    return this.http.get<any>(`${this.account}?name=${name}`, {headers: headers})
  }

  getUserByID(UserID: string) {
    return this.http.get<any>(this.account + '?User_ID=' + UserID, {headers: this.getHeaders()})
  }

  getUsers(): Observable<any> {
    return this.http.get(this.account, {headers: this.getHeaders()})
  }

  updateVideo(video: any) {
    return this.http.put(this.apiUrl + '/' + video.id, video);
  }

  starsToVideo(Video_ID: null | number, stars: number) {
    let returnedOBJ = {
      "likes": stars
    }

    return this.http.put(this.apiUrl + '?Video_ID=' + Video_ID, returnedOBJ, {headers: this.getHeaders()})
  }

  likeInfoToUser(USID: number, name: string, email: string, password: string, liked: string) {
    let returnedOBJ = {
      "name": name,
      "email": email,
      "password": password,
      "liked": liked
    }

    return this.http.put(this.account + USID + '/', returnedOBJ)
  }

  videoInfoToUser(USID: number, name: string, email: string, password: string, videos: string) {
    let returnedOBJ = {
      "name": name,
      "email": email,
      "password": password,
      "history": videos
    }

    return this.http.put(this.account + USID + '/', returnedOBJ)
  }

  createComment(text: string, Video_ID: string, owner: string) {
    const formData = new FormData();
    formData.append('text', String(text));
    formData.append('Video_ID', Video_ID);
    formData.append('owner', owner);

    console.log(this.getHeaders())

    return this.http.post(this.comment, formData, {headers: this.getHeaders()})
  }

  deleteVideo(id: number) {
    return this.http.delete(this.apiUrl + '/' + id)
  }
}
