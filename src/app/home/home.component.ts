import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperComponent, SwiperModule } from 'swiper/angular';
import SwiperCore, { FreeMode, Navigation, Pagination, Scrollbar, A11y, SwiperOptions } from 'swiper';
SwiperCore.use([FreeMode, Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SwiperModule],
  template: `
    <div class="toppers">
      <div class="left cell">top 1</div>
      <div class="right cell">top 2</div>
    </div>
    <div class="svgcontainer">
      <svg>
        <path d="M 160 0 C 160 25, 240 25, 240 50" class="path"/>
        <path d="M 320 0 C 320 25, 240 25, 240 50" class="path"/>
      </svg>
    </div>
    <div class="svgcontainer" #svg>
      <svg><path *ngFor="let slide of paths" attr.d={{slide}} class="path"/></svg>
    </div>
    <swiper #swiper [config]="config"
        (slideChange)="draw($event[0].translate)" (touchMove)="draw($event[0].translate)" 
        (transitionEnd)="draw($event[0].translate)"
      >
      <ng-template *ngFor="let slide of slides" swiperSlide >
        <div class="slide cell">{{slide}}</div>
      </ng-template>
    </swiper>
  `,
  styles: [` 
    .toppers { margin-inline: auto; display: flex; width: 480px; justify-content: center; align-items:center; }
    .left, .right { width: 150px; min-height: 80px; display: inline-flex; justify-content: center; align-items:center; }
    .left { margin-right: 20px; }
    .svgcontainer { margin-inline: auto; width: 480px; height: 50px; }
    svg { user-select: none; height: 100% ; width: 100% ;}
    .path { stroke: blue; stroke-width: 3px; fill: transparent; }
    .swiper { user-select: none; width: 480px; height: 80px }
    .slide { height: 100%; display: flex; align-items: center; justify-content: center; }
    .cell {background: linear-gradient(to top, lightgray, gray);}
  `]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('svg', { read: ElementRef }) svg!: ElementRef<HTMLElement>;
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  slides = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5', 'Slide 6']
  paths: string[] = [];
  config: SwiperOptions = { 
    slidesPerView: 3, spaceBetween: 20, freeMode: true, navigation: false, pagination: { clickable: true}
  };
  h = 0;  // svg height
  w = 0;  // slide width
  m = 0;  // slide margin

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.h = this.svg.nativeElement.offsetHeight;
    this.m = this.swiper?.spaceBetween || 0;
    const nr = <number>this.swiper?.slidesPerView || 1;
    this.w = (this.svg.nativeElement.offsetWidth - (nr - 1) * this.m) / nr;
    this.draw();
  }

  draw(scroll = 0) {
    for (let i = 0; i < this.slides.length; i++) {
      const x = (i + 0.5) * this.w + i * this.m + scroll;
      this.paths[i] = `M ${this.svg.nativeElement.offsetWidth / 2} 0 
        C ${this.svg.nativeElement.offsetWidth / 2} ${2 * this.h / 3}, 
          ${x} ${this.h / 2}, 
          ${x} ${this.h}`;
    }
    
    this.ref.detectChanges();
  }

}
