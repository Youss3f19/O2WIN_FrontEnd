import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommentsService } from '../../../services/comments.service';
import { Comment } from '../../../models/comment';
import { CommentComponent } from '../comment/comment.component';
import { HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from "../../loader/loader.component";

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommentComponent, FormsModule],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
  @Input() comments!: Comment[];
  @Input() boxId!: string;
  @Output() commentAdded = new EventEmitter<void>();

  private readonly commentService: CommentsService = inject(CommentsService);
  newComment: string = '';
  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  onAddComment(): void {
    if (!this.newComment.trim()) return; 
  
    const headers = this.getHeaders();
  
    this.commentService.addComment(this.boxId, this.newComment, headers).subscribe(
      () => {
        this.newComment = ''; // Clear the input
        this.commentAdded.emit(); // Notify the parent to reload comments
      },
      (error) => {
        console.error('Error adding comment:', error);
      }
    );
  }
  onDeleteComment(commentId: string) {
    const headers = this.getHeaders();
    this.commentService.deleteComment(commentId, headers).subscribe(
      () => {
        this.comments = this.comments.filter(comment => comment._id !== commentId); 
      },
      (error) => console.error('Error deleting comment:', error)
    );
  }



  ngOnInit(): void {}
}
