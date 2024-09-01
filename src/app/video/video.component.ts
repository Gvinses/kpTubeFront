import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {RouterLink, RouterLinkActive} from "@angular/router";
import { videos } from "../video-part/video-part.component"
import {HttpClient} from "@angular/common/http";
import {NgClass, NgOptimizedImage, NgStyle} from "@angular/common";
import {filter} from "rxjs";
import {VideosFetchService} from "../videos-fetch.service";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    NgStyle,
    NgClass,
  ],
  styleUrls: ['./video.component.sass']
})
export class VideoComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)

  videoId: number | null = null;
  videoData: any = {};
  comments: any = [];
  isLiked: string | string[] | Set<string> | { [p: string]: any } | null | undefined;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.videoId = +params.get('Video_ID')!;
      this.loadVideoDetails();
    });
  }

  VideoData: any | null = null
  VideoOwnerId: any | null = null
  loadVideoDetails(): void {
    if (this.videoId !== null) {
      this.http.get<any>(`https://kringeproduction.ru/videos?Video_ID=${this.videoId}`).subscribe(data => {
        data[0].video = data[0].video.replace('http://127.0.0.1:8000/', 'https://kringeproduction.ru/files/')
        data[0].preview = data[0].preview.replace('http://127.0.0.1:8000/', 'https://kringeproduction.ru/files/')
        this.videoData = data[0];

        // this.http.get<any>(`https://kringeproduction.ru/comments?Video_ID=${this.videoId}`).subscribe(commentsData => {
        //   console.log(commentsData);
        //   this.comments = commentsData;
        // })

        this.VideoData = data[0]
        this.VideosFetchService.enterUser(this.videoData.owner).subscribe(
          (data: any) => {
            this.VideoOwnerId = data[0];
          }
        )
      });
    }
  }

  imageFilter = 'invert(0)'

  // toggleInvert(): void {
  //   this.imageFilter = this.imageFilter === 'invert(0)' ? 'invert(1)' : 'invert(0)';
  //   this.VideosFetchService.updateLikes(this.VideoData.likes+1, this.VideoData).subscribe(
  //     response => {
  //       console.log('Upload successful!', response);
  //       this.loadVideoDetails()
  //     },
  //     error => {
  //       console.error('Upload error:', error);
  //     }
  //   )
  // }
  protected readonly filter = filter;
}
