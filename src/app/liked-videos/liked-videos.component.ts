import {Component, inject, OnInit} from '@angular/core';
import {VideosFetchService} from "../videos-fetch.service";
import {NgForOf} from "@angular/common";
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {it} from "node:test";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './liked-videos.component.html',
  styleUrl: './liked-videos.component.sass'
})
export class LikedVideosComponent implements OnInit {
  postService = inject(VideosFetchService)

  videos: any = []

  userID: any
  private likedVideosArr: any

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userLikes()
    });
  }

  userLikes() {
    if (localStorage) {
      this.userID = String(localStorage.getItem('UserID'))
    }
    this.postService.getUserByID(this.userID).subscribe((data: any) => {
      this.likedVideosArr = data[0].liked
      this.user_likes_url_setter()
    })
  }


  user_likes_url_setter() {
    for (let item in this.likedVideosArr) {
      if (this.likedVideosArr[item] > 3) {
        this.postService.getVideo(String(item)).subscribe((oneVideoData: any) => {
          if (oneVideoData[0].video && oneVideoData[0].video.startsWith('http://127.0.0.1:8000/')) {
            oneVideoData[0].video = oneVideoData[0].video.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
          }
          if (oneVideoData[0].preview && oneVideoData[0].preview.startsWith('http://127.0.0.1:8000/')) {
            oneVideoData[0].preview = oneVideoData[0].preview.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
          }

          this.videos.push(oneVideoData[0])
        })
      }
    }
  }
}
