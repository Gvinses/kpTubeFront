import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {videos} from "./video-part/video-part.component";

@Injectable({
  providedIn: 'root'
})
export class MusicFetchService {

  musicUrl = 'https://kptube.kringeproduction.ru/music/';

  http = inject(HttpClient)

  constructor() {
  }

  getAllMusic(): any {
    return this.http.get<any>(this.musicUrl)
  }

  addNewMusic(title: string, artist: string, description: string, src: File, image: File): any {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    let headers = new HttpHeaders()

    headers.set('X-USERNAME', String(username))
    headers.set('X-PASSWORD', String(password))

    const formData = new FormData();
    formData.append('Track_ID', String(Number(new Date()) + 'M'));
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('description', description);
    formData.append('src', src);
    formData.append('image', image);

    const musicReq = new HttpRequest('POST', this.musicUrl, formData, {
      headers: headers
    })

    return this.http.request(musicReq)
  }
}
