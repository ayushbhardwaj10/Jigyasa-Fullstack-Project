import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedin: Boolean = false;
  userName: any = '';
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('userName') != undefined) {
      this.isLoggedin = true;
      this.userName = sessionStorage.getItem('userName');
    }
    //managing shrinking of header content on scroll
    window.onscroll = function () {
      scrollFunction();
    };
    function scrollFunction() {
      if (
        document.body.scrollTop > 23 ||
        document.documentElement.scrollTop > 23
      ) {
        document.getElementsByClassName("header")[0].classList.add('box-shadow-header');
      } else {
        document.getElementsByClassName("header")[0].classList.remove('box-shadow-header');
      }
    }
  }
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
  login() {
    this.router.navigate(['/login']);
  }
  scrollToTopSection(){
    $('html,body').animate({
      scrollTop: $(".home-body").offset().top},
      'slow');
      document.getElementsByClassName("head-right-content")[0].classList.add("nav-active");
      document.getElementsByClassName("head-right-content")[1].classList.remove("nav-active");
  }
  scrollToServiceSection(){
    $('html,body').animate({
      scrollTop: $(".home-section4").offset().top},
      'slow');
    document.getElementsByClassName("head-right-content")[1].classList.add("nav-active");
    document.getElementsByClassName("head-right-content")[0].classList.remove("nav-active");  
  }
  isLogin(){
    let userName = sessionStorage.getItem("userName");
    if(userName==null || userName=='')
     return false;
    else return true;
  }
}
