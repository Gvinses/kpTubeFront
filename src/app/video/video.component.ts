import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {items, videos} from "../video-part/video-part.component"
import {HttpClient} from "@angular/common/http";
import {NgClass, NgForOf, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {VideosFetchService} from "../videos-fetch.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TuiRating} from '@taiga-ui/kit';
import {TuiRoot} from "@taiga-ui/core";

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
    NgForOf,
    TuiRating,
    TuiRoot
  ],
  styleUrls: ['./video.component.sass']
})
export class VideoComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)

  videoId: number | null = null;
  videoData: any = {};
  comments: any = [];
  howMuchComments: number = 0
  INDBID: number = 0
  userEmail: string | null = null
  userPassword: string | null = null
  INUSID: number = 0
  VideosHistory: string | any = ''
  VideoData: any | null = null
  VideoOwnerId: any | null = null
  userName: string | null = null
  userComment: string | null = null
  likesAndRating: string = ''

  protected videoStars = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.videoId = +params.get('Video_ID')!;
      this.loadVideoDetails();
      this.loadUserDetails()
    });
  }

  loadUserDetails(): void {
    if (localStorage) {
      this.userName = localStorage.getItem('UserName')

      this.VideosFetchService.enterUser(String(this.userName)).subscribe(
        (data: any) => {
          this.likesAndRating = data[0].liked;
          this.userEmail = data[0].email;
          this.userPassword = data[0].password;
          this.INUSID = data[0].id;
          this.VideosHistory = data[0].history;
          console.log(data[0])
          this.loadStars()
          this.addToUserHistory()
        }
      )
    }
  }

  loadVideoDetails(): void {
    if (this.videoId !== null) {
      this.http.get<any>(`https://kptube.kringeproduction.ru/videos/?Video_ID=${this.videoId}`).subscribe(data => {
        data[0].video = data[0].video.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
        data[0].preview = data[0].preview.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
        this.videoData = data[0];
        this.getComments()
        this.VideoData = data[0]
        this.INDBID = data[0].id
        this.videoStars = data[0].likes

        this.VideosFetchService.enterUser(this.videoData.owner).subscribe(
          (data: any) => {
            this.VideoOwnerId = data[0];
          }
        )
      });
    }
  }

  getComments() {
    this.http.get<any>(`https://kptube.kringeproduction.ru/comments/?Video_ID=${this.videoId}`).subscribe(commentsData => {
      console.log(commentsData);
      this.comments = commentsData;
      commentsData.forEach((comment: any) => {
        this.howMuchComments = Number(this.howMuchComments) + 1
      })
    })
  }

  addToUserHistory() {
    let videosArr = this.VideosHistory.split(',');
    const videoIdIndex = videosArr.indexOf(String(this.videoId));
    if (videoIdIndex !== -1) {
      videosArr.splice(videoIdIndex, 1);
    }
    videosArr.push(String(this.videoId));
    const newHistory = videosArr.join(',');

    this.VideosFetchService.videoInfoToUser(this.INUSID, String(this.userName), String(this.userEmail), String(this.userPassword), String(newHistory)).subscribe(
      response => {
        console.log('Upload successful!', response);
      }
    )
  }

  loadStars() {
    console.log(this.likesAndRating)
  }

  commentOnVideo() {
    this.VideosFetchService.createComment(String(this.userComment), String(this.videoId), String(this.userName)).subscribe(
      response => {
        console.log('Successful comment', response)
        this.userComment = null
        this.getComments()
      }
    )
  }

  cleaner() {
    this.userComment = null
  }

  shareData = {
    title: "KPtube Video",
    text: this.videoData.name,
    url: '',
  };

  async shareInfo() {
    try {
      this.shareData.url = `https://main--imaginative-kheer-6bc042.netlify.app/video/${this.videoId}`
      await navigator.share(this.shareData);
    } catch (err) {
      console.log(err)
    }
  }

  protected readonly items = items;
}
