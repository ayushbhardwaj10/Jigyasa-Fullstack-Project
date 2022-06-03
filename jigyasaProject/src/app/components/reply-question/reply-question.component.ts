import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ActivatedRoute } from '@angular/router';
import { DatabaseConnectionService } from 'src/app/services/database-connection.service';
import { FormControl, FormGroup } from '@angular/forms';

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
  commentsList: any = [];
  questionData: any;

  postCommentForm = new FormGroup({
    ansDescription: new FormControl(''),
    sampleCode: new FormControl(''),
  });

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
    this.dbAPI.displayComments(this.qid).subscribe(
      (response) => {
        console.log('Comments are :');
        this.commentsList = JSON.parse(JSON.stringify(response));
        console.log(this.commentsList);
      },
      (error) => {
        console.log('error in fetching comments list :');
        console.log(error);
      }
    );
  }
  submitComment() {
    let commentDesc = this.postCommentForm.value.ansDescription;
    let sampleCode = this.postCommentForm.value.sampleCode;

    if (commentDesc == '') {
      document
        .getElementsByClassName('comment-desc-invalid')[0]
        .classList.add('display');
    } else {
      this.dbAPI
        .postComment(
          this.qid,
          sessionStorage.getItem('userName'),
          commentDesc,
          sampleCode
        )
        .subscribe(
          (response) => {
            console.log('Commented posted successfully');
            console.log(response);

            let currentComment = {
              qid: this.qid,
              author: sessionStorage.getItem('userName'),
              description_: commentDesc,
              sampleCode: sampleCode,
              votes: 0,
              postedOn: new Date(),
            };
            this.commentsList.push(currentComment);

            document.getElementById('reply-description')!.innerHTML = '';
            document.getElementById('reply-code')!.innerHTML = '';
            document.getElementById('replyHeading')?.click();

            document.getElementById('openCommentSuccessModal')?.click();
            setTimeout(() => {
              document.getElementById('closeCommentSuccessModal')?.click();
            }, 4000);
          },
          (error) => {
            console.log('error while posting comment');
            console.log(error);
          }
        );
    }
  }
}
