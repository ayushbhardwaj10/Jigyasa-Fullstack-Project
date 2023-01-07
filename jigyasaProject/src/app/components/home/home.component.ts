import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import * as AOS from 'aos';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    AOS.init();
  }
  ngAfterViewInit(): void {
  }
  changeBox(i:any){
    document.getElementsByClassName("home-box")[i].classList.add("changeBoxBack");
    document.getElementsByClassName("home-box-img-wrap")[i].classList.add("changeIconColor");
    console.log("hi");
  }
  resetBox(i:any){
    document.getElementsByClassName("home-box")[i].classList.remove("changeBoxBack")
    document.getElementsByClassName("home-box-img-wrap")[i].classList.remove("changeIconColor");
  }
  serviceMouseOver(index :any){
     var serviceTitle = document.getElementsByClassName("service-item-title") as HTMLCollectionOf<HTMLElement>;
     serviceTitle[index].style.borderBottom = "4px solid #008374";
     var serviceImg = document.getElementsByClassName("topover-circle") as HTMLCollectionOf<HTMLElement>;
     serviceImg[index].style.background="#20c997";
     
  }
  serviceMouseOut(index:any){
    var serviceTitle = document.getElementsByClassName("service-item-title") as HTMLCollectionOf<HTMLElement>;
    serviceTitle[index].style.borderBottom = "4px solid #eeeeee";
    var serviceImg = document.getElementsByClassName("topover-circle") as HTMLCollectionOf<HTMLElement>;
    serviceImg[index].style.background="#eeeeee";
  }
  login() {
    this.router.navigate(['/login']);
  }
}
