import { Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {AccountComponent} from "./account/account.component";
import {VideoCreatingComponent} from "./video-creating/video-creating.component";
import {HomeComponent} from "./home/home.component";
import {VideoComponent} from "./video/video.component";
import {OtherAccountComponent} from "./other-account/other-account.component";
import {KpMusicComponent} from "./kp-music/kp-music.component";
import {MusicCreatingComponent} from "./music-creating/music-creating.component";
import {SearchResultsComponent} from "./searchResults/searchResults.component";
import {HistoryComponent} from "./history/history.component";
import {LikedVideosComponent} from "./liked-videos/liked-videos.component";

export const routes: Routes = [
  {
    path: '', component: HomeComponent
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
    component: KpMusicComponent
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
