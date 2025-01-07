import {Component, inject, OnInit } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {VideosFetchService} from "../videos-fetch.service";
import {NgIf} from "@angular/common";
import { Router } from '@angular/router';
import {Subscription} from "rxjs";
import {HttpEventType} from "@angular/common/http";
import {response} from "express";
import {File} from "node:buffer";

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

  loading: boolean = false;
  isButtonDisabled: boolean = false;
  uploadProgress = 0;
  uploadSub: Subscription | null = null;
  errorMessage: string | null = null;
  nameLS: any | null = null
  choosedCategory: string | null = null
  isGlobal: boolean = true

  mainLink = 'https://i.ibb.co/wBn5TrS/Loading-File-Img.png'

  videoSrc: string | ArrayBuffer | null = null;
  imageSrc: string | ArrayBuffer | null = null;
  category: any[] = [];


  constructor(private videoUploadService: VideosFetchService, private router: Router) { }

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

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.choosedCategory = selectElement.value;
  }

  onGlobalStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.isGlobal = selectElement.value === 'Видно всем';
  }

  onSubmit(): void {
    const videoID = Number(new Date());
    console.log(videoID);

    if (this.selectedFile && this.selectedPreview) {
      if (typeof localStorage !== 'undefined') {
        this.nameLS = localStorage.getItem('UserName');
      }
      if (this.nameLS !== null) {
        this.enterAccount()
      } else {
        this.errorMessage = 'Необходимо создать аккаунт!'
      }
    } else {
      console.error('No file selected');
    }
  }

  enterAccount() {
    this.videoUploadService.enterUser(String(this.nameLS)).subscribe(
      userResponse => {
        if (userResponse[0].isEmailVerified === true) {
          this.loading = true;
          this.isButtonDisabled = true;

          if (this.selectedFile && this.selectedPreview) {
            this.uploadVideo(this.selectedFile, this.selectedPreview)
          } else {
            console.error('No file selected');
          }
        } else {
          this.errorMessage = 'Необходимо верефицировать аккаунт'
        }
      }
    )
  }
  uploadVideo(videoFile: any, previewFile: any) {
    this.uploadSub = this.videoUploadService.uploadVideo(
      videoFile,
      this.name,
      this.description,
      previewFile,
      this.nameLS,
      this.choosedCategory,
      this.isGlobal,
    ).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round(100 * (event.loaded / (event.total || 1)));
      } else if (event.type === HttpEventType.Response) {
        this.loading = false;
        this.closePage()
        this.isButtonDisabled = false;
      }
    }, error => {
      console.error('Upload error:', error);
      this.loading = false;
      this.isButtonDisabled = false;
    });
  }

  cancelUpload() {
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
      this.loading = false;
      this.isButtonDisabled = false;
    }
  }

  closePage() {
    this.errorMessage = null
    this.router.navigate(['/']);
  }

}
