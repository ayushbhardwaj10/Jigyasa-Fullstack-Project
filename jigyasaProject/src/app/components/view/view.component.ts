import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { DatabaseConnectionService } from 'src/app/services/database-connection.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit {
  constructor(
    private dbAPI: DatabaseConnectionService,
    private router: Router
  ) {}
  questionFilters = 'newest';
  pageNumber = 1;

  fetchedAllQuestions: any = [];
  totalQuestions: any = 0;
  paginationPageLimit: any = 5; //value set based on whats decided from backend
  paginationTags: any = [];
  tagsList: any = [];

  tagSelectionForm = new FormGroup({
    javaSelection: new FormControl(''),
    pythonSelection: new FormControl(''),
    MLSelection: new FormControl(''),
    frontEndSelection: new FormControl(''),
    othersSelection: new FormControl(''),
  });

  ngOnInit(): void {
    this.dbAPI
      .displayQuestions(this.questionFilters, this.pageNumber)
      .subscribe(
        (response) => {
          let res = JSON.parse(JSON.stringify(response));
          this.fetchedAllQuestions = res[0];
          this.totalQuestions = res[1].totalQuestions;

          //Array created to display pagination tabs dynamically
          this.paginationTags = Array(
            Math.ceil(this.totalQuestions / this.paginationPageLimit)
          ).fill(0);
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

  topFilterApply(index: number, filterType: any) {
    //changing active on UI
    let filterTabs = document.querySelectorAll('.top-filter-tab');
    this.questionFilters = filterType;

    filterTabs.forEach((dom) => {
      dom.classList.remove('active-top-filter');
    });

    document
      .querySelectorAll('.top-filter-tab')
      [index].classList.add('active-top-filter');

    //Fetching filtered api data
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

  MoveToPage(currPage: any) {
    this.pageNumber = currPage;

    if (this.tagsList.length > 0) {
      this.dbAPI.tagFilteredQuestions(this.pageNumber, this.tagsList).subscribe(
        (response) => {
          console.log('successful tag selected questions:');
          console.log(response);
          let data = JSON.parse(JSON.stringify(response));
          this.fetchedAllQuestions = data[0];

          console.log("'questions count :");

          let tabsPages = Math.ceil(
            data[1][0].totalQuestions / this.paginationPageLimit
          );

          console.log(tabsPages);
          if (this.pageNumber > tabsPages) {
            this.pageNumber = tabsPages;
          }

          //Array created to display pagination tabs dynamically
          this.paginationTags = Array(tabsPages).fill(0);
        },
        (error) => {
          console.log('error while fetched questions based on tags');
          console.log(error);
        }
      );
    } else {
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
  nextPage() {
    this.pageNumber = this.pageNumber + 1;

    if (this.tagsList.length > 0) {
      this.dbAPI.tagFilteredQuestions(this.pageNumber, this.tagsList).subscribe(
        (response) => {
          console.log('successful tag selected questions:');
          console.log(response);
          let data = JSON.parse(JSON.stringify(response));
          this.fetchedAllQuestions = data[0];

          console.log("'questions count :");

          let tabsPages = Math.ceil(
            data[1][0].totalQuestions / this.paginationPageLimit
          );

          console.log(tabsPages);
          if (this.pageNumber > tabsPages) {
            this.pageNumber = tabsPages;
          }

          //Array created to display pagination tabs dynamically
          this.paginationTags = Array(tabsPages).fill(0);
        },
        (error) => {
          console.log('error while fetched questions based on tags');
          console.log(error);
        }
      );
    } else {
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
  }
  previousPage() {
    this.pageNumber = this.pageNumber - 1;

    if (this.tagsList.length > 0) {
      this.dbAPI.tagFilteredQuestions(this.pageNumber, this.tagsList).subscribe(
        (response) => {
          console.log('successful tag selected questions:');
          console.log(response);
          let data = JSON.parse(JSON.stringify(response));
          this.fetchedAllQuestions = data[0];

          console.log("'questions count :");

          let tabsPages = Math.ceil(
            data[1][0].totalQuestions / this.paginationPageLimit
          );

          console.log(tabsPages);
          if (this.pageNumber > tabsPages) {
            this.pageNumber = tabsPages;
          }

          //Array created to display pagination tabs dynamically
          this.paginationTags = Array(tabsPages).fill(0);
        },
        (error) => {
          console.log('error while fetched questions based on tags');
          console.log(error);
        }
      );
    } else {
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
  tagSelection() {
    console.log('Tag selection..');
    this.tagsList = [];

    if (this.tagSelectionForm.value.javaSelection) this.tagsList.push('Java');
    if (this.tagSelectionForm.value.pythonSelection)
      this.tagsList.push('Python');
    if (this.tagSelectionForm.value.MLSelection) this.tagsList.push('ML');
    if (this.tagSelectionForm.value.frontEndSelection)
      this.tagsList.push('Front-end');
    if (this.tagSelectionForm.value.othersSelection)
      this.tagsList.push('Others');

    // For the scenerio if nothing is selected show all tags
    if (this.tagsList.length == 0) {
      this.tagsList.push('Java');
      this.tagsList.push('Python');
      this.tagsList.push('ML');
      this.tagsList.push('Front-end');
      this.tagsList.push('Others');
    }

    this.dbAPI.tagFilteredQuestions(this.pageNumber, this.tagsList).subscribe(
      (response) => {
        console.log('successful tag selected questions:');
        console.log(response);
        let data = JSON.parse(JSON.stringify(response));
        this.fetchedAllQuestions = data[0];

        console.log("'questions count :");

        let tabsPages = Math.ceil(
          data[1][0].totalQuestions / this.paginationPageLimit
        );

        console.log(tabsPages);
        if (this.pageNumber > tabsPages) {
          this.pageNumber = tabsPages;
        }

        //Array created to display pagination tabs dynamically
        this.paginationTags = Array(tabsPages).fill(0);
      },
      (error) => {
        console.log('error while fetched questions based on tags');
        console.log(error);
      }
    );
  }
  navigateToQuestionPage(qid: any, title: any) {
    console.log('Question ID to navigate :' + qid);
    this.router.navigate(['/question', qid, title]);
  }
}
