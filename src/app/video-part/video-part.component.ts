import {Component, inject} from '@angular/core';
import {VideosFetchService} from "../videos-fetch.service";
import {NgForOf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";

export let videos = [
  {
    "id": 0,
    "Video_ID": 0,
    "name": "Test",
    "description": "Test",
    "likes": 0,
    "views": 0,
    "video": "http://127.0.0.1:8000/videos/1.png",
    "preview": null,
    "category": "0",
    "owner": null
  },

];


export let items = [
  {
    "id": 0,
    "Video_ID": "-1",
    "name": "Ой! У нас ошибка!",
    "description": "Простите, возможно мы перезапускаем сервер, или выпускаем обновление",
    "likes": 0,
    "views": 0,
    "video": null,
    "preview": 'https://cs9.pikabu.ru/post_img/big/2017/05/16/5/1494914961183622594.png',
    "category": null,
    "owner": 'KP229'
  }
  // добавьте остальные элементы
];


@Component({
  selector: 'app-video-part',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './video-part.component.html',
  styleUrl: './video-part.component.sass'
})
export class VideoPartComponent {
  postService = inject(VideosFetchService)

  videos: any = []

  items = items

  constructor()
  {
    this.postService.getVideos().subscribe((data: any) => {
      data.forEach((video: any) => {
        if (video.video && video.video.startsWith('http://127.0.0.1:8000/')) {
          video.video = video.video.replace('http://127.0.0.1:8000/', 'https://kringeproduction.ru/files/');
        }
        if (video.preview && video.preview.startsWith('http://127.0.0.1:8000/')) {
          video.preview = video.preview.replace('http://127.0.0.1:8000/', 'https://kringeproduction.ru/files/');
        }
      })
      this.videos = data.reverse()
    });
  }
}
