import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {RouterLink, RouterLinkActive} from "@angular/router";
import { videos } from "../videos-part/videos-part.component"
import {HttpClient} from "@angular/common/http";
import {NgClass, NgForOf, NgOptimizedImage, NgStyle} from "@angular/common";
import {filter, forkJoin} from "rxjs";
import {VideosFetchService} from "../videos-fetch.service";

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    NgStyle,
    NgClass,
    NgForOf,
  ],
  styleUrls: ['./search-results.component.sass']
})
export class SearchResultsComponent implements OnInit {
  search: string = '';
  results: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.search = params.get('userSearch') || '';
      this.http.get(`https://kptube.kringeproduction.ru/videos/?search=${this.search}`).subscribe((data: any) => {
        data.forEach((video: any) => {
          if (video.video && video.video.startsWith('http://127.0.0.1:8000/')) {
            video.video = video.video.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
          }
          if (video.preview && video.preview.startsWith('http://127.0.0.1:8000/')) {
            video.preview = video.preview.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/');
          }
        })
        this.results = data
      })
    });
  }

  protected readonly filter = filter;
}
