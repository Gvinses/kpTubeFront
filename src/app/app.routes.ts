import {Routes} from '@angular/router';
import {AccountComponent} from "./account/account.component";
import {VideoCreatingComponent} from "./video-creating/video-creating.component";
import {VideoComponent} from "./video/video.component";
import {OtherAccountComponent} from "./other-account/other-account.component";
import {MusicPartComponent} from "./music-part/music-part.component";
import {MusicCreatingComponent} from "./music-creating/music-creating.component";
import {SearchResultsComponent} from "./search-results/search-results.component";
import {HistoryComponent} from "./history/history.component";
import {LikedVideosComponent} from "./liked-videos/liked-videos.component";
import {VideosPartComponent} from "./videos-part/videos-part.component";

export const routes: Routes = [
  {
    path: '', component: VideosPartComponent
  },
  {
    path: 'account',
    component: AccountComponent
  }, {
    path: 'creating',
    component: VideoCreatingComponent
  },
  {
    path: 'video/:Video_ID',
    component: VideoComponent
  },
  {
    path: 'account/:User_ID',
    component: OtherAccountComponent
  },
  {
    path: 'KPmusic',
    component: MusicPartComponent
  },
  {
    path: 'KPmusic/Creating',
    component: MusicCreatingComponent
  },
  {
    path: 'search/:userSearch',
    component: SearchResultsComponent
  },
  {
    path: 'history',
    component: HistoryComponent
  },
  {
    path: 'liked',
    component: LikedVideosComponent
  },
];
