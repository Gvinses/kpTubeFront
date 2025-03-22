import {Routes} from '@angular/router';
import {AccountComponent} from "./Account_pages/account/account.component";
import {VideoCreatingComponent} from "./Videos_pages/video-creating/video-creating.component";
import {VideoComponent} from "./Videos_pages/video/video.component";
import {OtherAccountComponent} from "./Account_pages/other-account/other-account.component";
import {MusicPartComponent} from "./Music_pages/music-part/music-part.component";
import {MusicCreatingComponent} from "./Music_pages/music-creating/music-creating.component";
import {SearchResultsComponent} from "./Videos_pages/search-results/search-results.component";
import {HistoryComponent} from "./Videos_pages/history/history.component";
import {LikedVideosComponent} from "./Videos_pages/liked-videos/liked-videos.component";
import {VideosPartComponent} from "./Videos_pages/videos-part/videos-part.component";

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
