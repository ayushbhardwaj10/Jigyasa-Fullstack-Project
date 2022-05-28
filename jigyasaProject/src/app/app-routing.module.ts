import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ReplyQuestionComponent } from './components/reply-question/reply-question.component';
import { ViewComponent } from './components/view/view.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'welcomeHome', component: ViewComponent },
  { path: 'login', component: LoginComponent },
  { path: 'question/:id/:title', component: ReplyQuestionComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
