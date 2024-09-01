import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {videos} from "./video-part/video-part.component";

@Injectable({
  providedIn: 'root'
})
export class VideosFetchService {

  apiUrl = 'https://kringeproduction.ru/videos';
  account = 'https://kringeproduction.ru/users';
  category = 'https://kringeproduction.ru/categories';

  http = inject(HttpClient)

  constructor() { }

  getVideos(): any {
    return this.http.get<any>(this.apiUrl)
  }

  getVideo(id: number) {
    return this.http.get(this.apiUrl + '/' + id)
  }

  getCategories(): any {
    return this.http.get(this.category)
  }

  uploadVideo(file: File, name: string, description: string, preview: File, owner: string, category: any): Observable<any> {
    const formData = new FormData();
    formData.append('Video_ID', String(Number(new Date())));
    formData.append('video', file);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('preview', preview);
    formData.append('owner', owner);
    formData.append('category', category);

    return this.http.post(this.apiUrl, formData);
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

  updateVideo(video: any) {
    return this.http.put(this.apiUrl + '/' + video.id, video);
  }
  //
  // updateLikes(likes: number, video: any) {
  //   console.log(video)
  //   return this.http.put(this.apiUrl + '?Video_ID=' + video.Video_ID, video)
  // }

  deleteVideo(id: number) {
    return this.http.delete(this.apiUrl + '/' + id)
  }


}
