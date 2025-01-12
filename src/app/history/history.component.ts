import {Component, inject, OnInit} from '@angular/core';
import {VideosFetchService} from "../videos-fetch.service";
import {NgForOf} from "@angular/common";
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.sass'
})
export class HistoryComponent implements OnInit  {
  postService = inject(VideosFetchService)

  videos: any = []

  userID: any

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userHistory()
    });
  }

  userHistory() {
    if (localStorage) {
      this.userID = String(Number(localStorage.getItem('UserID'))/2)
    }
    this.postService.getUserByID(this.userID).subscribe((data: any) => {
      let historyArr = data[0].history.split(',')
      console.log(historyArr)
      historyArr.forEach((element: any) => {
        if (element !== '') {
          this.postService.getVideo(String(element)).subscribe((oneVideoData: any) => {
            if (oneVideoData[0].video && oneVideoData[0].video.startsWith('http://127.0.0.1:8000/')) {
              oneVideoData[0].video = oneVideoData[0].video.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
            }
            if (oneVideoData[0].preview && oneVideoData[0].preview.startsWith('http://127.0.0.1:8000/')) {
              oneVideoData[0].preview = oneVideoData[0].preview.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
            }

            this.videos.push(oneVideoData[0])
          })
        }
      })
    });
  }
}
