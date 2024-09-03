import {Component, inject, OnInit} from '@angular/core';
import {VideosFetchService} from "../videos-fetch.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {response} from "express";

@Component({
  selector: 'app-other-account',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './other-account.component.html',
  styleUrl: './other-account.component.sass'
})
export class OtherAccountComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)

  userData: any[] = []
  userHeader: string | ArrayBuffer | null = null;
  userAvatar: string | ArrayBuffer | null = null;
  userName: string | null = null;
  userVideos: any[] | null = null

  UserID: number | null = null;

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.UserID = +params.get('User_ID')!;
      this.loadVideoDetails();
    });
  }

  loadVideoDetails(): void {
    console.log(this.UserID)
    console.log(String(this.UserID))
    this.VideosFetchService.getUserByID(String(this.UserID)).subscribe(
      response => {
        this.userData = response[0];
        if (response[0].header && response[0].header.startsWith('http://127.0.0.1:8000/')) {
          response[0].header = response[0].header.replace('http://127.0.0.1:8000/', 'https://kringeproduction.ru/files/');
        }
        this.userHeader = response[0].header;

        if (response[0].avatar && response[0].avatar.startsWith('http://127.0.0.1:8000/')) {
          response[0].avatar = response[0].avatar.replace('http://127.0.0.1:8000/', 'https://kringeproduction.ru/files/');
        }
        this.userAvatar = response[0].avatar;

        this.userName = response[0].name

        console.log(response[0])
        this.loadNameVideos()
      }
    )
  }
  loadNameVideos(): void {
    this.VideosFetchService.getVideosByUser(String(this.userName)).subscribe((data: any) => {
      data.forEach((video: any) => {
        if (video.video && video.video.startsWith('http://127.0.0.1:8000/')) {
          video.video = video.video.replace('http://127.0.0.1:8000/', 'https://kringeproduction.ru/files/');
        }
        if (video.preview && video.preview.startsWith('http://127.0.0.1:8000/')) {
          video.preview = video.preview.replace('http://127.0.0.1:8000/', 'https://kringeproduction.ru/files/');
        }
      })
      this.userVideos = data
      console.log(data)
    });
  }
}