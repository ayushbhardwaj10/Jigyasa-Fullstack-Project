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
  questionFilters = 'newest';
  pageNumber = 1;

  fetchedAllQuestions: any = [];
  totalQuestions: any = 0;
  paginationPageLimit: any = 5; //value set based on whats decided from backend
  paginationTags: any = [];

  ngOnInit(): void {
    this.dbAPI
      .displayQuestions(this.questionFilters, this.pageNumber)
      .subscribe(
        (response) => {
          let res = JSON.parse(JSON.stringify(response));
          this.fetchedAllQuestions = res[0];
          this.totalQuestions = res[1].totalQuestions;
          this.paginationTags = Array(
            Math.ceil(this.totalQuestions / this.paginationPageLimit)
          ).fill(0);

          console.log('fetched questions list :');
          console.log(this.fetchedAllQuestions);
          console.log('total questions count :');
          console.log(this.totalQuestions);

          console.log('Pagination tabs count :' + this.paginationTags.length);
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

  MoveToPage(currPage: any) {
    this.pageNumber = currPage;
    this.dbAPI
      .displayQuestions(this.questionFilters, this.pageNumber)
      .subscribe(
        (response) => {
          let res = JSON.parse(JSON.stringify(response));
          this.fetchedAllQuestions = res[0];
          this.totalQuestions = res[1].totalQuestions;
          this.paginationTags = Array(
            Math.ceil(this.totalQuestions / this.paginationPageLimit)
          ).fill(0);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  nextPage() {
    this.pageNumber = this.pageNumber + 1;

    if (this.pageNumber > this.paginationTags.length) {
      this.pageNumber = this.pageNumber - 1;
      return;
    }

    this.dbAPI
      .displayQuestions(this.questionFilters, this.pageNumber)
      .subscribe(
        (response) => {
          let res = JSON.parse(JSON.stringify(response));
          this.fetchedAllQuestions = res[0];
          this.totalQuestions = res[1].totalQuestions;
          this.paginationTags = Array(
            Math.ceil(this.totalQuestions / this.paginationPageLimit)
          ).fill(0);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  previousPage() {
    this.pageNumber = this.pageNumber - 1;

    if (this.pageNumber < 1) {
      this.pageNumber = this.pageNumber + 1;
      return;
    }

    this.dbAPI
      .displayQuestions(this.questionFilters, this.pageNumber)
      .subscribe(
        (response) => {
          let res = JSON.parse(JSON.stringify(response));
          this.fetchedAllQuestions = res[0];
          this.totalQuestions = res[1].totalQuestions;
          this.paginationTags = Array(
            Math.ceil(this.totalQuestions / this.paginationPageLimit)
          ).fill(0);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
