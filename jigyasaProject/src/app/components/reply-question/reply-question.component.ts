import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
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
  userVote :any = 0;
  upVoteQuestionURL :any = "assets/images/upvote.png";
  downVoteQuestionURL : any = "assets/images/downvote.png";
  upVoteDefaultURL : any = "assets/images/upvote.png";
  downVoteDefaultURL : any = "assets/images/downvote.png";
  upVoteActiveURL : any="assets/images/upvote-active.png";
  downVoteActiveURL : any = "assets/images/downvote-active.png";
  isLoginUserQuestion : Boolean = true;
  commentIDList:any=[];
  commentIDVotes:any={};
  commentsUpvotesURL :any={};
  commentsDownvotesURL :any={};
  commentTickStatus:any ={};
  questionAuthor:any;

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
        if(this.questionData.sampleCode==""){
          document.getElementById("tagsofQuestion")?.classList.add("pd-b-emptyComment");
        }
        this.questionAuthor=this.questionData.author;
        if(this.questionData.author == sessionStorage.getItem("userName"))
        { this.isLoginUserQuestion = false;
          console.log("Logged in user same");
        }
        else console.log("Logged in user different");
      
          
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
        this.commentsList = this.sortByKey(this.commentsList,"votes").reverse();
        console.log(this.commentsList);
        for(let i=0; i<this.commentsList.length; i++){
          this.commentIDList.push(this.commentsList[i].commentID);
          this.commentTickStatus[this.commentsList[i].commentID] = this.commentsList[i].isMarked;
        }
        console.log("commentsID List :");
        console.log(this.commentIDList);
        console.log("commentTickStatus :");
        console.log(this.commentTickStatus);

        this.dbAPI.getUserVotesForComments(sessionStorage.getItem('email'),this.commentIDList).subscribe((response)=>{
          let res = JSON.parse(JSON.stringify(response));
           console.log("getUserVoteForComment response :");
           this.commentIDVotes = JSON.parse(JSON.stringify(response));
           console.log(this.commentIDVotes);
           
           for(let i=0; i<this.commentIDList.length; i++){
              if(this.commentIDList[i] in this.commentIDVotes)
              {
                if(this.commentIDVotes[this.commentIDList[i]] == 1)
                 { 
                   this.commentsUpvotesURL[this.commentIDList[i]] = this.upVoteActiveURL;
                   this.commentsDownvotesURL[this.commentIDList[i]] = this.downVoteDefaultURL;
                 }
                if(this.commentIDVotes[this.commentIDList[i]] == -1)
                 {
                    this.commentsUpvotesURL[this.commentIDList[i]] = this.upVoteDefaultURL;
                    this.commentsDownvotesURL[this.commentIDList[i]] = this.downVoteActiveURL;
                 }
              }
              else {
                this.commentsUpvotesURL[this.commentIDList[i]] = this.upVoteDefaultURL;
                this.commentsDownvotesURL[this.commentIDList[i]] = this.downVoteDefaultURL;
              }       
           }
           console.log("Finals objects ::::");
           console.log(this.commentsUpvotesURL);
           console.log(this.commentsDownvotesURL);
          
        },(error)=>{
          console.log("error while fetching user vote status for comments :");
          console.log(error);
        });

      },
      (error) => {
        console.log('error in fetching comments list :');
        console.log(error);
      }
    );
    this.dbAPI.getUserVoteForQuestion(sessionStorage.getItem('email'),this.qid).subscribe((response)=>{
      console.log("user vote :");
      let res = JSON.parse(JSON.stringify(response));
      if(res.length!=0)
       { 
         this.userVote = res[0].votes;
         if(this.userVote == 1)
           this.upVoteQuestionURL = "assets/images/upvote-active.png"
         if(this.userVote== -1)
         this.downVoteQuestionURL = "assets/images/downvote-active.png"
         
       }
      
    },(error)=>{
      console.log("error while fetching user vote status for question :");
      console.log(error);
    });
    
    
    
   
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
          sampleCode,
          this.commentsList.length + 1
        )
        .subscribe(
          (response) => {
            console.log('Commented posted successfully');
            console.log(response);
            let newCommentID = JSON.parse(JSON.stringify(response)).commentID;
            
            let currentComment = {
              commentID: newCommentID,
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

            // adding default upvote and downvotes URLs for new comment
            this.commentsUpvotesURL[newCommentID] = this.upVoteDefaultURL;
            this.commentsDownvotesURL[newCommentID] = this.downVoteDefaultURL;

           //adding deafult tick status of not visible for new comment
           this.commentTickStatus[newCommentID]=0;
          },
          (error) => {
            console.log('error while posting comment');
            console.log(error);
          }
        );
    }
  }
  voteQuestion(vote: any) {

    if( (this.userVote==1 && vote == 1) || (this.userVote==-1 && vote== -1) )
      return;

    let queryType = "insert"
    if(this.userVote==1 || this.userVote==-1)
        queryType="update"
    
    if(vote == 1){
      this.questionData.votes = this.questionData.votes+1;
      this.upVoteQuestionURL = "assets/images/upvote-active.png";
      this.downVoteQuestionURL = "assets/images/downvote.png";
      this.userVote=1;
    }
    else {
      this.questionData.votes = this.questionData.votes-1;
      this.downVoteQuestionURL = "assets/images/downvote-active.png";
      this.upVoteQuestionURL = "assets/images/upvote.png";
      this.userVote=-1;
    }
      
    this.dbAPI
      .voteQuestion(this.qid, sessionStorage.getItem('email'), vote,queryType)
      .subscribe(
        (response) => {
          console.log('successfully voted');
        },
        (error) => {
          console.log('Error in voting question');
          console.log(error);
        }
      );
  }
  voteComment(vote :any,commentID:any){

    if(this.commentIDVotes[commentID]==1 && vote == 1)
      return;
    if(this.commentIDVotes[commentID]==-1 && vote == -1)
      return;

    let queryType = "insert";

    if(commentID in this.commentIDVotes)
      queryType = "update";
    
    this.dbAPI.voteComment(sessionStorage.getItem('email'),commentID,vote,queryType).subscribe((response)=>{
       if(vote == 1) { 
        this.commentsUpvotesURL[commentID] = this.upVoteActiveURL;
        this.commentsDownvotesURL[commentID] = this.downVoteDefaultURL;
        this.commentIDVotes[commentID]=1
      }else {
        this.commentsUpvotesURL[commentID] = this.upVoteDefaultURL;
        this.commentsDownvotesURL[commentID] = this.downVoteActiveURL;
        this.commentIDVotes[commentID]=-1
      }
      // updating the comment vote count
      for(let i=0; i<this.commentsList.length; i++){
        if(this.commentsList[i]["commentID"] == commentID)
        {
          console.log("in");
          if(vote == 1)
            this.commentsList[i]["votes"] = this.commentsList[i]["votes"] +1;
          else this.commentsList[i]["votes"] = this.commentsList[i]["votes"] -1;
         
          break;
        }
      }

    },(error)=>{
       console.log("Error in coting comment :");
       console.log(error);
    });
  }
  commentUpVoteURL(comment:any){
     if(! (comment.commentID in this.commentsUpvotesURL))
       return this.upVoteDefaultURL;

     return this.commentsUpvotesURL[comment.commentID];
  }
  commentDownVoteURL(comment:any){
    if(! (comment.commentID in this.commentsDownvotesURL))
      return this.downVoteDefaultURL;

    return this.commentsDownvotesURL[comment.commentID];
 }
  sortByKey(array:any, key:any) {
  return array.sort(function(a:any, b:any) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}
giveTickOption(index:any,commentID:any){
  if(this.commentTickStatus[commentID]==1)
    return;

  if(this.questionAuthor != sessionStorage.getItem("userName"))
    return;  

  console.log("Comment number :" + index);
  document.getElementsByClassName("tick")[index].classList.remove("display-none");
}
removeTickOption(index:any,commentID:any){
  if(this.commentTickStatus[commentID]==1)
    return;

  if(this.questionAuthor != sessionStorage.getItem("userName"))
    return;

  console.log("Comment left :" + index);
  document.getElementsByClassName("tick")[index].classList.add("display-none");
}
markTickQuestion(commentID:any){
  this.dbAPI.tickQuestion(commentID,1).subscribe((response)=>{
   console.log("question marked as useful");
   this.commentTickStatus[commentID]=1;
   
  },(error)=>{
    console.log("error while marking question as useful:");
    console.log(error);
  });

}
checkTickStatus(commentID:any){
  if(!(commentID in this.commentTickStatus))
    return true;

  if(this.commentTickStatus[commentID]==1)
    return false;
  else return true;
}

}
