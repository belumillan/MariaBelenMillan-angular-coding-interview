import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../../core/services/questions.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { QuestionModel } from '../../core/state/question.model';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  errorMessage: string = '';
  questions$ = this.questionsService.questions$;
  gettingQuestions$ = this.questionsService.gettingQuestions$;
  getQuestionsSubscription: Subscription = this.route.queryParams
    .pipe(switchMap(params =>
      this.questionsService.getQuestions({
        type: params.type,
        amount: params.amount,
        difficulty: params.difficulty
      })
    )).subscribe( (questionModel: QuestionModel[]) => {},
    (error) => {
      this.errorMessage = error;
    });

  answersMessage: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly questionsService: QuestionsService,
  ) { }

  ngOnInit(): void {

    this.questions$.subscribe((questions: QuestionModel[]) => {
      const answeredQuestions = questions.filter((question: QuestionModel) => question.selectedId);
      if(answeredQuestions.length == questions.length){
        let correctAnswers = 0;
        let incorrectAnswers = 0;

        questions.forEach((q) => {
          let correct = q.answers.find((a) => a.isCorrect);
          q.selectedId == correct?._id ? correctAnswers++ : incorrectAnswers++;
        });

        this.answersMessage = `Correct answers: ${correctAnswers}. Incorrect answers: ${incorrectAnswers}`;

      }

    })
  }

  onAnswerClicked(questionId: QuestionModel['_id'], answerSelected: string): void {
    this.questionsService.selectAnswer(questionId, answerSelected);
  }

}
