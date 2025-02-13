import {Component, inject, OnInit} from '@angular/core'
import {FormsModule} from "@angular/forms"
import {VideosFetchService} from "../videos-fetch.service"
import {NgClass, NgIf} from "@angular/common"
import {Router} from '@angular/router'
import {Subscription} from "rxjs"
import {File} from "node:buffer"

@Component({
  selector: 'app-video-creating',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './video-creating.component.html',
  styleUrl: './video-creating.component.sass'
})
export class VideoCreatingComponent implements OnInit {
  VideosFetchService = inject(VideosFetchService)

  selectedFile: File | null = null
  selectedPreview: File | null = null
  name: string = ''
  description: string = ''

  loading: boolean = false
  isButtonDisabled: boolean = false
  uploadSub: Subscription | null = null
  errorMessage: string | null = null
  nameLS: any | null = null
  choosedCategory: string | null = null
  isGlobal: boolean = true

  mainLink = 'Loading-File-Img.png'

  videoSrc: string | ArrayBuffer | null = null
  imageSrc: string | ArrayBuffer | null = null
  categories: any[] = []
  categoryIsOpen: boolean = false


  constructor(private videoUploadService: VideosFetchService, private router: Router) {
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0]
      const file = event.target.files[0]
      if (file && (file.type === 'video/mp4') || (file.type === 'video/mov')) {
        const reader = new FileReader()
        reader.onload = () => {
          this.videoSrc = reader.result
        }
        reader.readAsDataURL(file)
      } else {
        this.errorMessage = 'Выберите видео mp4'
      }
    }
  }


  ngOnInit(): void {
    this.gettingCategories()
  }

  gettingCategories(): void {
    this.videoUploadService.getCategories().subscribe((data: any) => {
      this.categories = data
      this.choosedCategory = String(data[0].name)
    })
  }

  previewChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedPreview = event.target.files[0]
      const file = event.target.files[0]
      if (file && file.type === 'picture/jpg' || file.type === 'image/jpeg') {
        const reader = new FileReader()
        reader.onload = () => {
          this.imageSrc = reader.result
        }
        reader.readAsDataURL(file)
      } else {
        this.errorMessage = 'Выберите картинку'
      }
    }
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement
    this.choosedCategory = selectElement.value
  }

  onGlobalStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement
    this.isGlobal = selectElement.value === 'Видно всем'
  }

  onSubmit(): void {
    if (this.selectedFile && this.selectedPreview) {
      if (typeof localStorage !== 'undefined') {
        this.nameLS = localStorage.getItem('username')
      }
      if (this.nameLS !== null) {
        this.enterAccount()
      } else {
        this.errorMessage = 'Необходимо создать аккаунт!'
      }
    } else {
      this.errorMessage = 'Нужные файлы не выбраны'
    }
  }

  enterAccount() {
    this.videoUploadService.enterUser(String(this.nameLS)).subscribe(
      userResponse => {
        if (userResponse[0].isEmailVerified === true) {
          this.loading = true
          this.isButtonDisabled = true

          if (this.selectedFile && this.selectedPreview) {
            this.uploadVideo(this.selectedFile, this.selectedPreview)
          } else {
            this.errorMessage = 'Нужные файлы не выбраны'
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
      this.loading = false
      this.closePage()
      this.isButtonDisabled = false
    }, error => {
      console.error('Upload error:', error)
      this.loading = false
      this.isButtonDisabled = false
    })
  }

  cancelUpload() {
    if (this.uploadSub) {
      this.uploadSub.unsubscribe()
      this.loading = false
      this.isButtonDisabled = false
    }
  }

  closePage() {
    this.errorMessage = null
    this.router.navigate(['/'])
  }

  OpenCloseCategory() {
    this.categoryIsOpen = !this.categoryIsOpen
  }
}
