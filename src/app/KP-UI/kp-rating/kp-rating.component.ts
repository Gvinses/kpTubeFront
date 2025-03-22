import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {NgForOf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {VideosFetchService} from "../../Services/videos-fetch.service"

@Component({
  selector: 'app-kp-rating',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './kp-rating.component.html',
  styleUrl: './kp-rating.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class KpRatingComponent {
  VideosFetchService = inject(VideosFetchService)

  stars = [1, 2, 3, 4, 5]
  @Input() current_star: number = 0
  @Input() video_id: string = ''

  change_current_star(item: number) {
    this.current_star = item
    this.post_stars_data()
  }

  // TODO
  //  add switchmap

  post_stars_data() {
    let userId = String(localStorage.getItem('UserID'))
    this.VideosFetchService.PostStars(userId, this.video_id, this.current_star).subscribe()
  }
}
