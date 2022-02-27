import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    //managing shrinking of header content on scroll
    window.onscroll = function () {
      scrollFunction();
    };
    function scrollFunction() {
      if (
        document.body.scrollTop > 50 ||
        document.documentElement.scrollTop > 50
      ) {
        (document.querySelector('#logoText') as HTMLElement).style.fontSize =
          '1rem';
        if (screen.width < 1000) {
          (
            document.querySelector('#logoText') as HTMLElement
          ).style.paddingTop = '3rem';
          (document.querySelector('#logoImg') as HTMLElement).style.marginTop =
            '2rem';
          (
            document.querySelector('.login-btn') as HTMLElement
          ).style.marginTop = '1rem';
        }

        (document.querySelector('#logoImg') as HTMLElement).style.maxHeight =
          '2.875rem';
        (document.querySelector('#logoText') as HTMLElement).style.left =
          '-0.5625rem';
      } else {
        (document.querySelector('#logoText') as HTMLElement).style.fontSize =
          '1.5rem';
        (document.querySelector('#logoImg') as HTMLElement).style.maxHeight =
          '4.625rem';
        (document.querySelector('#logoText') as HTMLElement).style.left =
          '-1.125rem';
        if (screen.width < 1000) {
          (
            document.querySelector('#logoText') as HTMLElement
          ).style.paddingTop = '1.5rem';
          (document.querySelector('#logoImg') as HTMLElement).style.marginTop =
            '14px';
          (
            document.querySelector('.login-btn') as HTMLElement
          ).style.paddingTop = '1rem';
        }
      }
    }
  }
}
