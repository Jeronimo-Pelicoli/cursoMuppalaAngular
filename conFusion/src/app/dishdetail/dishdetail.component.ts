import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comments';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { visibility, flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  dish?: Dish
  dishIds!: string[]
  prev?: string
  next?: string
  commentForm!: FormGroup
  errMess?: string
  dishcopy?: Dish
  @ViewChild('cform') commentFormDirective!: NgForm
  visibility: string = 'shown'

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
    },
    'comment': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
  }
}

  constructor(
    private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('baseURL') public baseURL: string
  ) {
    this.createFormComments()
  }

  ngOnInit(): void {
    // const id = +this.route.snapshot.params['id'];
    // this.dishservice.getDish(String(id)).subscribe(dish => this.dish = dish);
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => {
      this.visibility = 'hidden'
      return this.dishservice.getDish(params['id'])
    }))
    .subscribe(
      dish => {
        this.dish = dish
        this.dishcopy = dish
        this.setPrevNext(dish.id)
        this.visibility = 'shown'
      },
      errmess => this.errMess = <any>errmess
    )
  }

  goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createFormComments(): void {
    this.commentForm = this.fb.group({
      author: new FormControl<string>('', [ Validators.required, Validators.minLength(2) ]) ,
      rating: new FormControl<number>(0),
      comment: new FormControl<string>('', [ Validators.required, Validators.minLength(2) ]),
      date: new FormControl<string>(new Date().toISOString())
    })
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onSubmit() {
    this.dishcopy?.comments.push(this.commentForm.value)
    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = undefined; this.dishcopy = undefined; this.errMess = <any>errmess; })
    this.commentForm.reset({
      author: '',
      rating: '',
      comment: '',
      date: new Date().toISOString()
    })
    this.commentFormDirective.resetForm()
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        (this.formErrors as any)[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = (this.validationMessages as any)[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              (this.formErrors as any)[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
