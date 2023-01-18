import { Component, OnInit, Inject } from '@angular/core';
import { LeaderService } from '../services/leader.service';
import { FeedbackService } from '../services/feedback.service'
import { Leader } from '../shared/leader';
import { Feedback } from '../shared/feedback';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class AboutComponent implements OnInit {

  leaders: Leader[] = []
  errMess: string = ''
  feedbacks: Feedback[] = []

  constructor(
    private leaderService: LeaderService,
    private feedbackService: FeedbackService,
    @Inject('baseURL') public baseURL: string
  ) { }

  ngOnInit(): void {
    this.leaderService.getLeaders().subscribe(
      leaders => this.leaders = leaders,
      errmess => this.errMess = <any>errmess
    )
    this.feedbackService.getFeedback().subscribe(
      feedback => this.feedbacks = feedback,
      errmess => this.errMess = <any>errmess
    )
  }

}
