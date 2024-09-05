import {Component, inject, OnInit } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import { Router } from '@angular/router';
import {Subscription} from "rxjs";
import {HttpEvent, HttpEventType} from "@angular/common/http";
import {response} from "express";
import {MusicFetchService} from "../music-fetch.service";
import {VideosFetchService} from "../videos-fetch.service";

@Component({
  selector: 'app-music-creating',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './music-creating.component.html',
  styleUrl: './music-creating.component.sass'
})
export class MusicCreatingComponent {
  MusicFetchService = inject(MusicFetchService)
  VideoFetchService = inject(VideosFetchService)

  selectedFile: File | null = null;
  selectedPreview: File | null = null;
  name: string = '';
  description: string = '';

  constructor(private MusicUploadService: MusicFetchService, VideosUploadService: VideosFetchService, private router: Router) { }

  mainLink = 'https://i.ibb.co/wBn5TrS/Loading-File-Img.png'

  audioSrc: string | ArrayBuffer | null = null;

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const file = event.target.files[0];
      if (file && (file.type === 'audio/mp3') || (file.type === 'audio/mpeg')) { //mpeg
        const reader = new FileReader();
        reader.onload = () => {
          this.audioSrc = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a audio. Your type === ' + file.type);
      }
    }
  }

  imageSrc: string | ArrayBuffer | null = null;
  category: any[] = [];

  previewChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedPreview = event.target.files[0];
      const file = event.target.files[0];
      if (file && file.type === 'picture/jpg' || file.type === 'image/jpeg') {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageSrc = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a jpg or jpeg image.');
      }
    }
  }

  loading: boolean = false;
  isButtonDisabled: boolean = false;
  uploadProgress = 0;
  uploadSub: Subscription | null = null;
  errorMessage: string | null = null;
  nameLS: any | null = null
  ownerLS: any | null = null

  onSubmit(): void {
    const videoID = Number(new Date());
    console.log(videoID);

    if (this.selectedFile && this.selectedPreview) {
      if (typeof localStorage !== 'undefined') {
        this.nameLS = localStorage.getItem('UserName');
      }
      if (this.nameLS !== null) {
        this.VideoFetchService.enterUser(String(this.nameLS)).subscribe(
          userResponse => {
            console.log(userResponse[0])
            if (userResponse[0].isEmailVerified === true) {
              this.loading = true;
              if (typeof localStorage !== 'undefined') {
                this.ownerLS = String(localStorage.getItem('UserName'));
              }
              this.isButtonDisabled = true;

              console.log('Upload Started');

              if (this.selectedFile && this.selectedPreview) {
                this.uploadSub = this.MusicFetchService.addNewMusic(
                  this.name,
                  this.ownerLS,
                  this.description,
                  this.selectedFile,
                  this.selectedPreview,
                ).subscribe((event: HttpEvent<any>) => {
                  if (event.type === HttpEventType.UploadProgress) {
                    this.uploadProgress = Math.round(100 * (event.loaded / (event.total || 1)));
                  } else if (event.type === HttpEventType.Response) {
                    console.log('Upload successful!', event.body);
                    this.loading = false;
                    this.router.navigate(['/']);
                    this.isButtonDisabled = false;
                  }
                }, (error: HttpEvent<any>) => {
                  console.error('Upload error:', error);
                  this.loading = false;
                  this.isButtonDisabled = false;
                })
              } else {
                console.error('No file selected');
              }
            } else {
              this.errorMessage = 'Необходимо верифицировать аккаунт';
            }
          }
        )
      } else {
        this.errorMessage = 'Необходимо создать аккаунт!';
      }
    } else {
      console.error('No file selected');
    }
  }

  cancelUpload() {
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
      this.loading = false;
      this.isButtonDisabled = false;
      console.log('Upload cancelled');
    }
  }

  /////////////


  close() {
    this.errorMessage = null
  }
}
