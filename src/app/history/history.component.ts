import {Component, inject, OnInit} from '@angular/core';
import {VideosFetchService} from "../videos-fetch.service";
import {NgForOf} from "@angular/common";
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";
import {VideoInterface} from "../video-interface";


interface history_video {
  'Video_ID': number,
  'date': number,
  'lengh': number,
  'time': number,
  'time_zone': number
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.sass'
})
export class HistoryComponent implements OnInit {
  postService = inject(VideosFetchService)

  videos: any = []

  userID: any

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userHistory()
    });
  }

  userHistory() {
    if (localStorage) {
      this.userID = String(localStorage.getItem('UserID'))

      this.postService.getUserByID(this.userID).subscribe((data: any) => {
        this.history_urls_setter(data[0].history)

      })
    }
  }

  history_urls_setter(historyData: string[]) {
    historyData.forEach((element: any) => {
      this.setLinks(element)
    })
  }

  setLinks(element: history_video) {
    this.postService.getVideo(String(element.Video_ID)).subscribe((VideoData: any) => {
      if (VideoData[0].video && VideoData[0].video.startsWith('http://127.0.0.1:8000/')) {
        VideoData[0].video = VideoData[0].video.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
      }
      if (VideoData[0].preview && VideoData[0].preview.startsWith('http://127.0.0.1:8000/')) {
        VideoData[0].preview = VideoData[0].preview.replace('http://127.0.0.1:8000/', 'https://kptube.kringeproduction.ru/files/')
      }

      VideoData[0]['whatchedAt'] = new Date(element.time)
      this.videos.push(VideoData[0])
    })
  }


  sortVideosInDates() {
    const today = new Date();
    const daysToKeep = 5; // Количество дней для отслеживания
    const result = {};

    // Преобразуем даты и удаляем дубликаты
    const uniqueVideos = new Map<string, any>();

    this.videos.forEach((video: any) => {
      const watchedDate = new Date(video.whatchedAt);
      const videoID = video.Video_ID;

      // Сохраняем только самое новое видео
      if (!uniqueVideos.has(videoID) || watchedDate > new Date(uniqueVideos.get(videoID).whatchedAt)) {
        uniqueVideos.set(videoID, { ...video, watchedDate });
      }
    });

    // Сортируем уникальные видео по дате
    const sortedVideos = Array.from(uniqueVideos.values()).sort((a, b) => {
      return new Date(b.watchedDate).getTime() - new Date(a.watchedDate).getTime();
    });

    // Разделяем видео по дням
    sortedVideos.forEach(video => {
      const watchedDate = new Date(video.watchedDate);
      const daysDifference = Math.floor((today.getTime() - watchedDate.getTime()) / (1000 * 3600 * 24));

      // Проверяем, попадает ли видео в диапазон последних 5 дней
      if (daysDifference <= daysToKeep) {
        const dayKey = watchedDate.toLocaleDateString('ru-RU'); // Форматируем дату

        // Добавляем поле daysFromWatch
        if (daysDifference === 0) {
          video.daysFromWatch = "Сегодня";
        } else if (daysDifference === 1) {
          video.daysFromWatch = "Вчера";
        } else {
          video.daysFromWatch = `${watchedDate.getDate().toString().padStart(2, '0')}.${(watchedDate.getMonth() + 1).toString().padStart(2, '0')}.${watchedDate.getFullYear().toString().slice(-2)}`;
        }

        // // Создаем объект для хранения видео по дням
        // if (!result[dayKey]) {
        //   result[dayKey] = [];
        // }
        //
        // result[dayKey].push(video);
      }
    });

    return result;
  }

  delete_video_from_history(video_object: VideoInterface) {
    console.log(video_object)
    this.videos.splice(this.videos.index(video_object.id), 1)
  }
}
