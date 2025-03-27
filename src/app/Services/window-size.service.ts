import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowSizeService {

  private mobileStaticScreenSize = 650

  constructor() {
  }

  checkScreenSize(window: any) {
    return window.innerWidth <= this.mobileStaticScreenSize
  }
}
