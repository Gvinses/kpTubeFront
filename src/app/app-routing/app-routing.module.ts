import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { VideoCreatingComponent } from '../video-creating/video-creating.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'createVideo', component: VideoCreatingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
