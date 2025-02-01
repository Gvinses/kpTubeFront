import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {VideosFetchService} from "../videos-fetch.service";
import {NgForOf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";

export let videos = [];


export interface video_type    // make as file
  {
    "id": Number,
    "Video_ID": String,
    "name": String,
    "description": String,
    "likes": Number,
    "views": Number,
    "video": String,
    "preview": String,
    "category": String,
    "owner": String
  }


@Component({
  selector: 'app-videos-part',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './videos-part.component.html',
  styleUrl: './videos-part.component.sass'
})
export class VideosPartComponent implements AfterViewInit {

  ngAfterViewInit() {
    this.getVideos()
  }

  postService = inject(VideosFetchService)

  videos: any = []

  items: video_type[] = []

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
