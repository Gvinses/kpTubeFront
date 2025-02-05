import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  getDateDifference(createdAt: Date, currentDate: Date): string {
    const yearsDiff = currentDate.getFullYear() - createdAt.getFullYear();
    const monthsDiff = currentDate.getMonth() - createdAt.getMonth();
    const daysDiff = currentDate.getDate() - createdAt.getDate();

    // Если разница в годах больше 0
    if (yearsDiff > 0) {
      return `${yearsDiff} год${yearsDiff > 1 ? 'а' : ''} назад`;
    }

    // Если разница в месяцах больше 0 или в днях больше 0
    if (monthsDiff > 0) {
      const totalMonths = monthsDiff + (yearsDiff * 12);
      return `${totalMonths} месяц${totalMonths > 1 ? 'а' : ''} назад`;
    }

    // Теперь проверяем разницу в днях
    if (daysDiff > 0) {
      return `${daysDiff} день назад`;
    }

    // Если разница в днях 0, проверяем часы и минуты
    const hoursDiff = currentDate.getHours() - createdAt.getHours();
    const minutesDiff = currentDate.getMinutes() - createdAt.getMinutes();

    if (hoursDiff > 0) {
      return `${hoursDiff} час${hoursDiff > 1 ? 'а' : ''} назад`;
    } else if (minutesDiff > 0) {
      return `${minutesDiff} минут${minutesDiff > 1 ? 'ы' : 'а'} назад`;
    } else {
      return 'Только что';
    }
  }
}
