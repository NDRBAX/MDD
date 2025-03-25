import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[truncateText]'
})
export class TruncateTextDirective implements OnInit {
  @Input('truncateText') lineCount: number = 1;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'display', '-webkit-box');
    this.renderer.setStyle(this.el.nativeElement, '-webkit-line-clamp', this.lineCount);
    this.renderer.setStyle(this.el.nativeElement, '-webkit-box-orient', 'vertical');
    this.renderer.setStyle(this.el.nativeElement, 'overflow', 'hidden');
    this.renderer.setStyle(this.el.nativeElement, 'text-overflow', 'ellipsis');
    this.renderer.setStyle(this.el.nativeElement, 'line-height', '1.5em');
    this.renderer.setStyle(this.el.nativeElement, 'max-height', `calc(1.5em * ${this.lineCount})`);
  }
}
