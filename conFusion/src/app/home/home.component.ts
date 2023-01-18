import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animations/app.animation';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish?: Dish
  promotion?: Promotion
  leader?: Leader
  errMess?: string

  constructor(
    private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('baseURL') public baseURL: string
  ) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish().subscribe(
      dish => this.dish = dish,
      errmess => this.errMess = <any>errmess
    )
    this.promotionService.getFeaturedPromotion().subscribe(
      promotion => this.promotion = promotion,
      errmess => this.errMess = <any>errmess
    )
    this.leaderService.getLeaderEC().subscribe(
      leader => this.leader = leader,
      errmess => this.errMess = <any>errmess
    )
  }

}
