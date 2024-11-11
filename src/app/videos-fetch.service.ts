import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {videos} from "./video-part/video-part.component";

@Injectable({
  providedIn: 'root'
})
export class VideosFetchService {

  apiUrl = 'https://kptube.kringeproduction.ru/videos/';
  account = 'https://kptube.kringeproduction.ru/users/';
  category = 'https://kptube.kringeproduction.ru/categories/';
  comment = 'https://kptube.kringeproduction.ru/comments/';

  http = inject(HttpClient)

  constructor() { }

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

    const req = new HttpRequest('POST', this.apiUrl, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }

  createUser(userID: number, name: string, email: string, password: string, avatar: File, header: File) {
    const formData = new FormData();
    formData.append('User_ID', String(userID));
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('avatar', avatar);
    formData.append('header', header);

    return this.http.post(this.account, formData);
  }

  enterUser(name: string) {
    return this.http.get<any>(this.account+'?name='+name);
  }

  getUserByID(UserID: string) {
    return this.http.get<any>(this.account+'?User_ID='+UserID);
  }

  getUserNames(): Observable<any> {
    return this.http.get<any>(this.account)
  }

  updateVideo(video: any) {
    return this.http.put(this.apiUrl + '/' + video.id, video);
  }

  starsToVideo(DBID: number, videoName: string, stars: number) {
    let returnedOBJ = {
      "name": videoName,
      "likes": stars
    }
    return this.http.put(this.apiUrl + DBID + '/', returnedOBJ)
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

    return this.http.post(this.comment, formData)
  }

  deleteVideo(id: number) {
    return this.http.delete(this.apiUrl + '/' + id)
  }


}
