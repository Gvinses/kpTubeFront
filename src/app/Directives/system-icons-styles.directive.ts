import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appSystemIconsStyles]',
  standalone: true,
})
export class SystemIconsStylesDirective {
  constructor(private element: ElementRef) {
    this.element.nativeElement.style.transition = 'transform 0.2s cubic-bezier(.43, .64, .67, 1.2)'
  }

  @HostListener('click') onClick(): void {
    this.element.nativeElement.style.transform = 'scale(1.1)'

    setTimeout(() => {
      this.element.nativeElement.style.transform = 'scale(1)'
    }, 200)
  }
}
