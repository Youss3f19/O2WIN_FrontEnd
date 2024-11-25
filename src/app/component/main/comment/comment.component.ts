import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../../models/comment';
import { DaysAgoPipe } from '../../../pipes/days-ago.pipe';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../models/user';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [DaysAgoPipe, TitleCasePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {


  private readonly userService: UsersService = inject(UsersService);

  user: User | null = null;
  @Input() comment!: Comment
  @Output() deleteComment = new EventEmitter<string>();


  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  onRemove() {
    this.deleteComment.emit(this.comment._id); 
  }
}
