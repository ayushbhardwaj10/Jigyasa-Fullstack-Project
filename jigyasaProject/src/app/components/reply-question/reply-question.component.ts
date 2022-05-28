import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { DatabaseConnectionService } from 'src/app/services/database-connection.service';

@Component({
  selector: 'app-reply-question',
  templateUrl: './reply-question.component.html',
  styleUrls: ['./reply-question.component.css'],
})
export class ReplyQuestionComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private dbAPI: DatabaseConnectionService
  ) {}

  qid: any = '';
  questionData: any;

  questionCode =
    '<p>class MyComponent {</p> <p>constructor(){ </p> <p>// how to query the DOM element from here? }} </p><p>}}</p>';
  answerCode1 =
    '<p>"scripts": [</p><p>  "node_modules/jquery/dist/jquery.min.js"</p><p>  ]</p>';
  answerCode2 = '<p>install jquery@latest';

  ngOnInit(): void {
    this.qid = this.route.snapshot.paramMap.get('id');
    console.log('question ID received : ' + this.qid);
    this.dbAPI.displaySpecificQuestion(this.qid).subscribe(
      (response) => {
        console.log('Question details fetched :');
        console.log(response);
        this.questionData = JSON.parse(JSON.stringify(response));
      },
      (error) => {
        console.log('error fetching specific question');
        console.log(error);
      }
    );
  }
}
