import {AfterViewInit, Component, ElementRef, HostBinding, OnInit, Renderer2} from '@angular/core';
import {RouterOutlet, RouterModule, RouterLink, RouterLinkActive} from "@angular/router";
import {CommonModule} from "@angular/common";
import {VideoPartComponent} from "./video-part/video-part.component";
import {NavPartComponent} from "./nav-part/nav-part.component";
import {SearchPartComponent} from "./search-part/search-part.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    VideoPartComponent, NavPartComponent,
    RouterLink, RouterOutlet, RouterModule, RouterLinkActive, SearchPartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  copied: boolean= false;

  copyEmail() {
    this.copied = true;

    const email = 'kringeproduction229@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      // Копирование в буфер обмена успешно
      console.log('Электронная почта успешно скопирована');
      this.handleClick()
      setTimeout( () => {
        this.copied = false
      }, 3000)
    }).catch((error) => {
      // Ошибка во время копирования
      console.error('Ошибка при копировании электронной почты:', error);
    });
  }
  isAnimating = false;

  handleClick(): void {
    if (!this.isAnimating) {
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
      }, 3000); // После 3 секунд анимация будет завершена
    }
  }
}
