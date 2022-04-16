import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  ShowTagSelectionBar() {
    let selectionBar = document.querySelectorAll('.tag-selection-bar')[0];
    if (selectionBar.classList.contains('display-block'))
      selectionBar.classList.remove('display-block');
    else selectionBar.classList.add('display-block');
  }

  topFilterApply(index: number) {
    //changing active on UI
    let filterTabs = document.querySelectorAll('.top-filter-tab');

    filterTabs.forEach((dom) => {
      dom.classList.remove('active-top-filter');
    });

    document
      .querySelectorAll('.top-filter-tab')
      [index].classList.add('active-top-filter');

    //Fetching filtered api data
  }
}
