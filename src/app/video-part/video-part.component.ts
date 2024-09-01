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
    "Video_ID": "1724933638183",
    "name": "Никиту бьёт сенсей",
    "description": "Мне очень жаль никиту",
    "likes": 0,
    "views": 0,
    "video": "http://127.0.0.1:8000/videos_db/videos/%D0%9F%D1%80%D0%BE%D1%81%D0%BC%D0%BE%D1%82%D1%80_%D0%BC%D0%B5%D0%B4%D0%B8%D0%B0_2024-08-23_11-34-29.mp4",
    "preview": "http://127.0.0.1:8000/videos_db/previews/drevo.jpg",
    "category": "porn",
    "owner": "aboba"
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
      this.videos = data
      console.log(data)
    });
  }
}
