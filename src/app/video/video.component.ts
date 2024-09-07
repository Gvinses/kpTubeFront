import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {RouterLink, RouterLinkActive} from "@angular/router";
import { videos } from "../video-part/video-part.component"
import {HttpClient} from "@angular/common/http";
import {NgClass, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {filter} from "rxjs";
import {VideosFetchService} from "../videos-fetch.service";
import {response} from "express";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

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
    ReactiveFormsModule,
    FormsModule,
    NgIf,
  ],
  styleUrls: ['./video.component.sass']
})
export class VideoComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)

  videoId: number | null = null;
  videoData: any = {};
  comments: any = [];
  howMuchComments: number = 0
  isLiked: string | string[] | Set<string> | { [p: string]: any } | null | undefined;
  INDBID: number = 0
  videoLikes: number = 0
  userLikes: string | any = ''
  userEmail: string | null = null
  userPassword: string | null = null
  INUSID: number = 0

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.videoId = +params.get('Video_ID')!;
      this.loadVideoDetails();
      this.loadUserDetails()
    });
  }
  userName: string | null = null

  loadUserDetails(): void {
    if (localStorage) {
      this.userName = localStorage.getItem('UserName')
    }
    this.VideosFetchService.enterUser(String(this.userName)).subscribe(
      (data: any) => {
        this.userLikes = data[0].liked;
        this.userEmail = data[0].email;
        this.userPassword = data[0].password;
        this.INUSID = data[0].id;
        console.log(this.userLikes)
        if (this.userLikes.includes(this.videoId)) {
          console.log('includes')
          this.imageFilter = 'invert(1)'
        } else {
          console.log('not includes')
        }
      }
    )
  }

  VideoData: any | null = null
  VideoOwnerId: any | null = null
  loadVideoDetails(): void {
    if (this.videoId !== null) {
      this.http.get<any>(`https://kringeproduction.ru/videos/?Video_ID=${this.videoId}`).subscribe(data => {
        data[0].video = data[0].video.replace('http://127.0.0.1:8000/', 'https://kringeproduction.ru/files/')
        data[0].preview = data[0].preview.replace('http://127.0.0.1:8000/', 'https://kringeproduction.ru/files/')
        this.videoData = data[0];

        this.getComments()

        this.VideoData = data[0]
        this.INDBID = data[0].id
        this.videoLikes = data[0].likes
        this.VideosFetchService.enterUser(this.videoData.owner).subscribe(
          (data: any) => {
            this.VideoOwnerId = data[0];
          }
        )
      });
    }
  }

  getComments() {
    this.http.get<any>(`https://kringeproduction.ru/comments/?Video_ID=${this.videoId}`).subscribe(commentsData => {
      console.log(commentsData);
      this.comments = commentsData;
      commentsData.forEach((comment: any) => {
        this.howMuchComments++
      })
    })
  }

  imageFilter = 'invert(0)'

  toggleInvert(): void {
    this.imageFilter = this.imageFilter === 'invert(0)' ? 'invert(1)' : 'invert(0)';


    if (this.imageFilter === 'invert(1)') {
      this.videoLikes++

      this.VideosFetchService.likeToVideo(this.INDBID, this.videoData.name, this.videoLikes).subscribe(
        response => {
          console.log('Upload successful!', response);
        },
        error => {
          console.error('Upload error:', error);
        }
      )
      let likesArr = this.userLikes.split(',')
      likesArr.push(String(this.videoId))
      likesArr.join(',')

      this.VideosFetchService.likeInfoToUser(this.INUSID, String(this.userName), String(this.userEmail), String(this.userPassword), String(likesArr)).subscribe(
        response => {
          console.log('Upload successful!', response);
        }
      )

    } else {
      this.videoLikes--

      this.VideosFetchService.likeToVideo(this.INDBID, this.videoData.name, this.videoLikes).subscribe(
        response => {
          console.log('Upload successful!', response);
        },
        error => {
          console.error('Upload error:', error);
        }
      )
      let likesArr = this.userLikes.split(',')
      console.log(likesArr)
      likesArr.slice(likesArr.indexOf(this.videoId), 1)
      likesArr.join(',')

      this.VideosFetchService.likeInfoToUser(this.INUSID, String(this.userName), String(this.userEmail), String(this.userPassword), String(likesArr)).subscribe(
        response => {
          console.log('Upload successful!', response);
        }
      )
    }
  }
  protected readonly filter = filter;
  userComment: string | null = null

  commentOnVideo() {
    this.VideosFetchService.createComment(String(this.userComment), String(this.videoId), String(this.userName)).subscribe(
      response => {
        console.log('Successful comment', response)
        this.getComments()
      }
    )
  }

  cleaner() {
    this.userComment = null
  }
}
