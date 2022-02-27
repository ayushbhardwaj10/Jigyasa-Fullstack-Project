import { AfterViewInit, Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor() {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      $('.c1').css('opacity', '1');
      $('.c1').css('animation', 'zoomIn');
      $('.c1').css('animation-duration', '0.7s');
    }, 700);
    setTimeout(() => {
      $('.c2').css('opacity', '1');
      $('.c2').css('animation', 'zoomIn');
      $('.c2').css('animation-duration', '0.7s');
    }, 1400);
    setTimeout(() => {
      $('.c3').css('opacity', '1');
      $('.c3').css('animation', 'zoomIn');
      $('.c3').css('animation-duration', '0.7s');
    }, 2100);
    setTimeout(() => {
      $('.c4').css('opacity', '1');
      $('.c4').css('animation', 'zoomIn');
      $('.c4').css('animation-duration', '0.7s');
    }, 2800);
  }
}
