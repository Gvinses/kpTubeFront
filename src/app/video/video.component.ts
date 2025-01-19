import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {RouterLink, RouterLinkActive} from "@angular/router"
import {items} from "../video-part/video-part.component"
import {HttpClient} from "@angular/common/http"
import {NgClass, NgForOf, NgIf, NgOptimizedImage, NgStyle} from "@angular/common"
import {VideosFetchService} from "../videos-fetch.service"
import {FormsModule, ReactiveFormsModule} from "@angular/forms"
import {RatingComponent} from "../rating/rating.component";


@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    NgStyle,
    NgClass,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgForOf,
    RatingComponent
  ],
  styleUrls: ['./video.component.sass']
})
export class VideoComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)

  videoId: number | null = null
  videoData: any = {}
  comments: any = []
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

  video_name: string = ''
  video_owner: string = ''
  video_category: string = ''
  video_description: string = ''

  videoStars = 0


  protected video_link: any

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.videoId = +params.get('Video_ID')!
    })
    this.loadUserDetails()
    this.loadVideoDetails()
  }

  loadUserDetails(): void {
    if (localStorage) {
      this.userName = localStorage.getItem('UserName')
      let userId = Number(localStorage.getItem('UserID')) / 2

      this.VideosFetchService.getUserByID(String(userId)).subscribe(
        (data: any) => {
          this.likesAndRating = data[0].liked
          this.userEmail = data[0].email
          this.userPassword = data[0].password
          this.INUSID = data[0].id
          this.VideosHistory = data[0].history
          this.loadStars()
          this.addToUserHistory()
        }
      )
    }
  }

  loadVideoDetails(): void {
    if (this.videoId !== null) {
      console.log('STARTED!')
      this.http.get<any>(`https://kptube.kringeproduction.ru/videos/?Video_ID=${this.videoId}`).subscribe(data => {
        data[0].video = data[0].video.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
        this.getComments()
        this.VideoData = data[0]
        this.INDBID = data[0].id
        this.videoStars = data[0].likes
        this.video_link = data[0].video
        this.video_name = data[0].name
        this.video_owner = data[0].owner
        this.video_category = data[0].category
        this.video_description = data[0].description

        console.log(this.VideoData)

        this.VideosFetchService.enterUser(this.videoData.owner).subscribe(
          (data: any) => {
            this.VideoOwnerId = data[0]
          }
        )
      })
    }
  }

  getComments() {
    this.http.get<any>(`https://kptube.kringeproduction.ru/comments/?Video_ID=${this.videoId}`).subscribe(commentsData => {
      console.log(commentsData)
      this.comments = commentsData
      commentsData.forEach((comment: any) => {
        this.howMuchComments = Number(this.howMuchComments) + 1
      })
    })
  }

  addToUserHistory() {
    let videosArr = this.VideosHistory.split(',')
    const videoIdIndex = videosArr.indexOf(String(this.videoId))
    if (videoIdIndex !== -1) {
      videosArr.splice(videoIdIndex, 1)
    }
    videosArr.push(String(this.videoId))
    const newHistory = videosArr.join(',')

    this.VideosFetchService.videoInfoToUser(this.INUSID, String(this.userName), String(this.userEmail), String(this.userPassword), String(newHistory)).subscribe(
      response => {
        console.log('Upload successful!', response)
      }
    )
  }

  loadStars() {
    console.log(this.likesAndRating.split(':'))
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
  }

  async shareInfo() {
    try {
      this.shareData.url = `https://kptube.netlify.app/video/${this.videoId}`
      await navigator.share(this.shareData)
    } catch (err) {
      console.log(err)
    }
  }

  starsToVideo() {
    console.log(this.videoStars)
    this.VideosFetchService.starsToVideo(this.videoId, this.videoStars).subscribe(
      response => {
        console.log('Upload successful!', response)
      },
      error => {
        console.error('Upload error:', error)
      }
    )
  }

  starsToUser(userStarToVideo: number) {
    let likesArr = []

    this.likesAndRating.split(',')
    likesArr.push(this.likesAndRating)
    console.log(likesArr)
    likesArr.push(String(this.videoId) + ':' + userStarToVideo)
    likesArr.join(',')

    this.VideosFetchService.likeInfoToUser(this.INUSID, String(this.userName), String(this.userEmail), String(this.userPassword), String(likesArr)).subscribe(
      response => {
        console.log('Upload successful!', response)
      }
    )
  }

  protected readonly items = items
  protected readonly Number = Number;
}
