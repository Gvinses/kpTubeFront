import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {RouterLink, RouterLinkActive} from "@angular/router";
import { videos } from "../video-part/video-part.component"
import {HttpClient} from "@angular/common/http";
import {NgClass, NgForOf, NgOptimizedImage, NgStyle} from "@angular/common";
import {filter, forkJoin} from "rxjs";
import {VideosFetchService} from "../videos-fetch.service";

@Component({
  selector: 'app-searchResults',
  templateUrl: './searchResults.component.html',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    NgStyle,
    NgClass,
    NgForOf,
  ],
  styleUrls: ['./searchResults.component.sass']
})
export class SearchResultsComponent implements OnInit {
  search: string = '';
  results: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.search = params.get('userSearch') || '';
      console.log(this.search)
      this.http.get(`https://kringeproduction.ru/videos/?search=${this.search}`).subscribe((data: any) => {
        data.forEach((video: any) => {
          if (video.video && video.video.startsWith('http://127.0.0.1:8000/')) {
            video.video = video.video.replace('http://127.0.0.1:8000/', 'https://kringeproduction.ru/files/');
          }
          if (video.preview && video.preview.startsWith('http://127.0.0.1:8000/')) {
            video.preview = video.preview.replace('http://127.0.0.1:8000/', 'https://kringeproduction.ru/files/');
          }
        })
        this.results = data
      })
    });
  }
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
