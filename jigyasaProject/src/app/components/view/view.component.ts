import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { DatabaseConnectionService } from 'src/app/services/database-connection.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit {
  constructor(private dbAPI: DatabaseConnectionService) {}

  fetchedAllQuestions: any = [];

  ngOnInit(): void {
    this.dbAPI.fetchAllQuestions().subscribe(
      (response) => {
        this.fetchedAllQuestions = JSON.parse(JSON.stringify(response));
        console.log('fetched questions list :');
        console.log(this.fetchedAllQuestions);
      },
      (error) => {
        console.log(error);
      }
    );
  }

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
