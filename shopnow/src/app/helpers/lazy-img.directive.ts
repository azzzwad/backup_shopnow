import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: 'img' })
export class LazyImgDirective {

  constructor({ nativeElement }: ElementRef<HTMLImageElement>) {
    nativeElement.classList.add('lazyload');

    const supports = 'loading' in HTMLImageElement.prototype;
    if (supports) {
      console.log('working-lazy loading');
      nativeElement.setAttribute('loading', 'lazy');
    } else {
      // fallback to IntersectionObserver
    }
  }

}
