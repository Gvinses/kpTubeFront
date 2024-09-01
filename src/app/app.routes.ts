import { Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {AccountComponent} from "./account/account.component";
import {VideoCreatingComponent} from "./video-creating/video-creating.component";
import {HomeComponent} from "./home/home.component";
import {VideoComponent} from "./video/video.component";
import {OtherAccountComponent} from "./other-account/other-account.component";

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
];
