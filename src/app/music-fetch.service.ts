import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {videos} from "./video-part/video-part.component";

@Injectable({
  providedIn: 'root'
})
export class MusicFetchService {

  musicUrl = 'https://kptube.kringeproduction.ru/music/';

  http = inject(HttpClient)

  constructor() { }

  getAllMusic(): any {
    return this.http.get<any>(this.musicUrl)
  }
  addNewMusic(title: string, artist: string, description: string, src: File, image: File): any {
    const formData = new FormData();
    formData.append('Track_ID', String(Number(new Date())+'M'));
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('description', description);
    formData.append('src', src);
    formData.append('image', image);

    const musicReq = new HttpRequest('POST', this.musicUrl, formData, {
      reportProgress: true
    });

    return this.http.request(musicReq);
  }
}
