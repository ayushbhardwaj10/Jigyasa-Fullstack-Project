import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyQuestionComponent } from './reply-question.component';

describe('ReplyQuestionComponent', () => {
  let component: ReplyQuestionComponent;
  let fixture: ComponentFixture<ReplyQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplyQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
