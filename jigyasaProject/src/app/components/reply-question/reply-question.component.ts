import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-reply-question',
  templateUrl: './reply-question.component.html',
  styleUrls: ['./reply-question.component.css'],
})
export class ReplyQuestionComponent implements OnInit {
  constructor() {}

  questionCode =
    '<p>class MyComponent {</p> <p>constructor(){ </p> <p>// how to query the DOM element from here? }} </p><p>}}</p>';
  answerCode1 =
    '<p>"scripts": [</p><p>  "node_modules/jquery/dist/jquery.min.js"</p><p>  ]</p>';
  answerCode2 = '<p>install jquery@latest';

  ngOnInit(): void {}
}
