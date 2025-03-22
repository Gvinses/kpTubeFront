import {Component, ElementRef, inject, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core'
import {NgForOf, NgIf} from "@angular/common"
import {RouterLink, RouterLinkActive} from "@angular/router"
import {MusicFetchService} from "../../music-fetch.service"

let tracks = [
  {title: 'Трэк', artist: 'Gvins', image: 'gg.png', src: 'kp229SoundTrackv2.mp3', description: 'Track 1 transcript'},
  {
    title: 'Крутой трек',
    artist: 'KP229',
    image: 'Logo.jpg',
    src: 'musicForKP229.mp3',
    description: 'Track 2 transcript'
  },
]

@Component({
  selector: 'app-music-part',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './music-part.component.html',
  styleUrls: ['./music-part.component.sass']
})
export class MusicPartComponent implements OnInit {
  musicService = inject(MusicFetchService)
  @ViewChildren('audio') audioElements!: QueryList<ElementRef<HTMLAudioElement>>
  currentTrackIndex = 0
  isPlaying = false
  tracks: any[] = []   // Инициализируем массив треков

  constructor() {}

  ngOnInit() {
    this.getMusic()
  }

  getMusic() {
    this.musicService.getAllMusic().subscribe((data: any) => {
      data.forEach((music: any) => {
        if (music.src && music.src.startsWith('http://127.0.0.1:8000/')) {
          music.src = music.src.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
        }
        if (music.image && music.image.startsWith('http://127.0.0.1:8000/')) {
          music.image = music.image.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
        }
      })
      this.tracks = data
    })
  }

  stopAll() {
    this.audioElements.forEach(audio => audio.nativeElement.pause())
    this.isPlaying = false
  }

  prevTrack() {
    this.stopAll()
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length
  }

  nextTrack() {
    this.stopAll()
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length
  }
}
