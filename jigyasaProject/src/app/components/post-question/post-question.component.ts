import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatabaseConnectionService } from 'src/app/services/database-connection.service';

@Component({
  selector: 'app-post-question',
  templateUrl: './post-question.component.html',
  styleUrls: ['./post-question.component.css'],
})
export class PostQuestionComponent implements OnInit {
  constructor(private dbAPI: DatabaseConnectionService) {}

  code: any;

  postQuestionForm = new FormGroup({
    heading: new FormControl(''),
    desc: new FormControl(''),
    sampleCode: new FormControl(''),
    javaCheckbox: new FormControl(''),
    pythonCheckbox: new FormControl(''),
    mlCheckbox: new FormControl(''),
    frontendCheckbox: new FormControl(''),
    othersCheckbox: new FormControl(''),
  });

  ngOnInit(): void {}

  postQuestion() {
    //code to store code in HTML tags and load in a target div with css property of =>
    //white-space: pre-wrap;

    //if user not logged in, request the user to login before posting question
    if (
      sessionStorage.getItem('userName') == '' ||
      sessionStorage.getItem('userName') == undefined
    ) {
      document
        .getElementById('emptyFieldsNotAllowedError')
        ?.classList.add('display-none');
      document.getElementById('loginPostQuestionBtn')?.click();
    }
    //checking if empty data
    else if (
      this.postQuestionForm.value.heading == '' ||
      this.postQuestionForm.value.heading == undefined ||
      this.postQuestionForm.value.desc == '' ||
      this.postQuestionForm.value.desc == undefined
    ) {
      document
        .getElementById('emptyFieldsNotAllowedError')
        ?.classList.remove('display-none');
    } else {
      document
        .getElementById('emptyFieldsNotAllowedError')
        ?.classList.add('display-none');

      let tagsList = [];
      if (this.postQuestionForm.value.javaCheckbox) tagsList.push('Java');
      if (this.postQuestionForm.value.pythonCheckbox) tagsList.push('Python');
      if (this.postQuestionForm.value.mlCheckbox) tagsList.push('ML');
      if (this.postQuestionForm.value.frontendCheckbox)
        tagsList.push('Front-end');
      if (this.postQuestionForm.value.othersCheckbox) tagsList.push('Others');
      this.dbAPI
        .postQuestion(
          sessionStorage.getItem('userName'),
          this.postQuestionForm.value.heading,
          this.postQuestionForm.value.desc,
          this.postQuestionForm.value.sampleCode,
          tagsList
        )
        .subscribe(
          (response) => {
            document.getElementById('postQuestionModalBtn')?.click();
            setTimeout(() => {
              document.getElementById('closePostQuestionSuccessModal')?.click();
            }, 4000);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
}
