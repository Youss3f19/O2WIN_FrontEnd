import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor() { }
  private readonly http:HttpClient = inject(HttpClient);
  API_URL="http://localhost:3000/comment/";


  getComments(boxId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.API_URL + 'getCommentsByBoxId/'+boxId);
  }

  addComment(boxId: string , content : string,headers:HttpHeaders): Observable<Comment[]> {
    return this.http.post<Comment[]>(this.API_URL + 'addComment' , {boxId,content} , {headers});
  }

  deleteComment(commentId: string , headers:HttpHeaders): Observable<Comment[]> {
    return this.http.delete<Comment[]>(this.API_URL + 'deleteComment/' + commentId ,{headers} );
  }

  

}
