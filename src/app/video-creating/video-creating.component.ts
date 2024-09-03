import {Component, inject, OnInit } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {VideosFetchService} from "../videos-fetch.service";
import {NgIf} from "@angular/common";
import { Router } from '@angular/router';
import {Subscription} from "rxjs";
import {HttpEventType} from "@angular/common/http";
import {response} from "express";

@Component({
  selector: 'app-video-creating',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './video-creating.component.html',
  styleUrl: './video-creating.component.sass'
})
export class VideoCreatingComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)

  selectedFile: File | null = null;
  selectedPreview: File | null = null;
  name: string = '';
  description: string = '';

  constructor(private videoUploadService: VideosFetchService, private router: Router) { }

  mainLink = 'https://i.ibb.co/wBn5TrS/Loading-File-Img.png'

  videoSrc: string | ArrayBuffer | null = null;

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const file = event.target.files[0];
      if (file && (file.type === 'video/mp4') || (file.type === 'video/mov')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.videoSrc = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a mp4 image.');
      }
    }
  }

  imageSrc: string | ArrayBuffer | null = null;
  category: any[] = [];

  ngOnInit(): void {
    this.gettingCategories();
  }

  gettingCategories(): void {
    this.videoUploadService.getCategories().subscribe((data: any) => {
      this.category = data;
    });
  }

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
  choosedCategory: string | null = null
  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.choosedCategory = selectElement.value;
    console.log('Selected Category ID:', this.choosedCategory);
  }

  progress: number = 0;
  loading: boolean = false;
  isButtonDisabled: boolean = false;
  uploadProgress = 0;
  uploadSub: Subscription | null = null;
  errorMessage: string | null = '1';
  nameLS: any | null = null
  ownerLS: any | null = null
  onSubmit(): void {
    const videoID = Number(new Date());
    console.log(videoID);

    if (this.selectedFile && this.selectedPreview) {
      this.loading = true;
      if (localStorage) {
        this.ownerLS = String(localStorage.getItem('UserName'));
      }
      this.isButtonDisabled = true;

      console.log('Upload Started');
    
      if (localStorage) {
        this.nameLS = localStorage.getItem('UserName');
      }
      if (name !== null) {
        this.videoUploadService.enterUser(String(name)).subscribe(
          userResponse => {
            if (userResponse[0].isEmailVerified === true) {
              if (this.selectedFile && this.selectedPreview) {
                this.uploadSub = this.videoUploadService.uploadVideo(
                  this.selectedFile,
                  this.name,
                  this.description,
                  this.selectedPreview,
                  this.ownerLS,
                  this.choosedCategory
                ).subscribe(event => {
                  if (event.type === HttpEventType.UploadProgress) {
                    this.uploadProgress = Math.round(100 * (event.loaded / (event.total || 1)));
                  } else if (event.type === HttpEventType.Response) {
                    console.log('Upload successful!', event.body);
                    this.loading = false;
                    this.router.navigate(['/']);
                    this.isButtonDisabled = false;
                  }
                }, error => {
                  console.error('Upload error:', error);
                  this.loading = false;
                  this.isButtonDisabled = false;
                });
              } else {
                console.error('No file selected');
              }
            } else {
              this.errorMessage = 'Необходимо верефицировать аккаунт'
            }
          }
        )
      } else {
        this.errorMessage = 'Необходимо создать аккаунт!'
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
