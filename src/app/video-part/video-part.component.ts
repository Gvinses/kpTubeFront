import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {VideosFetchService} from "../videos-fetch.service";
import {NgForOf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {RatingComponent} from "../rating/rating.component";

export let videos = [];


export let items = [
  {
    "id": 0,
    "Video_ID": "1",
    "name": "У нас ошибка!",
    "description": "error",
    "likes": 1,
    "views": 1,
    "video": 'kringeproduction.ru',
    "preview": 'notFound.jpg',
    "category": 'error',
    "owner": 'KP229'
  }
];


@Component({
  selector: 'app-video-part',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    RouterLinkActive,
    RatingComponent
  ],
  templateUrl: './video-part.component.html',
  styleUrl: './video-part.component.sass'
})
export class VideoPartComponent implements AfterViewInit {

  ngAfterViewInit() {
    this.getVideos()
  }

  postService = inject(VideosFetchService)

  videos: any = []

  items = items

  constructor() {
  }

  getVideos() {
    this.postService.getVideos().subscribe((data: any) => {
      data.forEach((video: any) => {
        if (video.isGlobal) {
          this.linksChanger(video)
          this.videos.push(video)
        }
      })
      this.videos.reverse()
      console.log(this.videos)
    })
  }

  linksChanger(video: any) {
    if (video.video && video.video.startsWith('http://127.0.0.1:8000/')) {
      video.video = video.video.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
    }
    if (video.preview && video.preview.startsWith('http://127.0.0.1:8000/')) {
      video.preview = video.preview.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
    }
  }
}
