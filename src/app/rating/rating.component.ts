import {Component, inject, Input} from '@angular/core';
import {NgForOf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {VideosFetchService} from "../videos-fetch.service"

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class RatingComponent {
  VideosFetchService = inject(VideosFetchService)

  stars = [1, 2, 3, 4, 5]
  @Input() public current_star: number = 0
  @Input() video_id: any

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
  }

  change_current_star(item: number) {
    this.current_star = item
    this.post_stars_data()
  }

  // TODO
  //  add switchmap

  post_stars_data() {
    let userId = String(Number(localStorage.getItem('UserID')) / 2)

    this.VideosFetchService.PostStars(userId, this.video_id, this.current_star).subscribe(data => {
      console.log(data)
    })
  }
}
