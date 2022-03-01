import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-question',
  templateUrl: './post-question.component.html',
  styleUrls: ['./post-question.component.css'],
})
export class PostQuestionComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  code: any;
  postQuestion() {
    //code to store code in HTML tags and load in a target div with css property of =>  white-space: pre-wrap;
    /*     console.log(
      (document.getElementById('sampleCode') as HTMLInputElement).value
    );
    this.code = (
      document.getElementById('sampleCode') as HTMLInputElement
    ).value;

    document.querySelectorAll('.display-content')[0].innerHTML = this.code; */
  }
}
