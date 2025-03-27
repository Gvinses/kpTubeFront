import {AfterViewInit, Component, ElementRef, inject, ViewChild} from '@angular/core';
import {VideosFetchService} from "../../Services/videos-fetch.service";
import {NgForOf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {VideoInterface} from "../../Interfaces/video-interface";
import {filter, from, map} from "rxjs";

export let videos = [];

@Component({
  selector: 'app-videos-part',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './videos-part.component.html',
  styleUrl: './videos-part.component.sass',
})
export class VideosPartComponent implements AfterViewInit {
  @ViewChild('myDiv') render_line!: ElementRef

  ngAfterViewInit() {
    this.getVideos()
    this.intersectionCallback()
  }

  intersectionCallback() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('Div отобразился на экране!')
        }
      })
    })

    observer.observe(this.render_line.nativeElement)
  }

  postService = inject(VideosFetchService)

  videos: any = []

  items: VideoInterface[] = []

  constructor() {
  }

  getVideos() {
    this.postService.getVideos().subscribe((data: any) => {
      let rxjsArr = from(data.reverse())
      rxjsArr.pipe(
        filter((video: any) => video.isGlobal),
        map((video: any) => {
          this.linksChanger(video)
          this.videos.push(video)
        })
      ).subscribe()
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
