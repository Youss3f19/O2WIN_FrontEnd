import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BoxesService } from '../../../services/boxes.service';
import { Box } from '../../../models/box';
import { UsersService } from '../../../services/users.service';
import { LoaderComponent } from '../../loader/loader.component';
import { Product } from '../../../models/product';
import { NgClass } from '@angular/common';
import { EnStockPipe } from '../../../pipes/en-stock.pipe';
import { CommentListComponent } from "../comment-list/comment-list.component";
import { CommentsService } from '../../../services/comments.service';
import { Comment } from '../../../models/comment';

@Component({
  selector: 'app-detailproduit',
  standalone: true,
  imports: [RouterLink, LoaderComponent, NgClass, EnStockPipe, CommentListComponent],
  templateUrl: './detailproduit.component.html',
  styleUrl: './detailproduit.component.css'
})
export class DetailproduitComponent {
  
  private readonly boxService : BoxesService = inject(BoxesService);
  private readonly usersService: UsersService = inject(UsersService);
  private readonly commentService: CommentsService = inject(CommentsService);

  private readonly route : ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);


  box? :  Box;
  products: Product[] = [];
  comments: Comment[] = [];
  isLoading: boolean = true; 
  error: string | null = null; 
  boxId!: string ;
  

  ngOnInit(): void {
    this.boxId = this.route.snapshot.params["id"];
    if (this.boxId) {
    
      this.getBoxById();
      this.getComments()
   

    } else {
      this.error = "Box ID not found.";
      this.isLoading = false;
    }


  }


  getBoxById():void{
    this.boxService.getBoxById(this.boxId).subscribe(
      (box) => {
       this.box = box;
       this.getBoxByProduct(this.boxId);
       console.log(box);
       this.isLoading = false;
       
     },
     (err) => {
       this.error = "Unable to fetch box details.";
       console.error(err);
       this.isLoading = false;
     },
   );
  }

  getComments(): void {
    this.commentService.getComments(this.boxId).subscribe(
      (comments) => {
        this.comments = comments;
        console.log(comments);
      
      },
      (error) => console.error('Error retrieving comments', error)
    );
  }

  onCommentDeleted(): void {
    this.getComments(); 
  }
  onCommentAdded(): void {
    this.getComments();
  }

  



  getBoxByProduct(boxId:string):void {
    this.boxService.getProductsByBox(boxId).subscribe(
      (res) => {
        console.log('Products fetched:', res);
        this.products = res;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      }
    )
  }

  addBoxToCart(box: Box): void {
    this.usersService.currentUser$.subscribe(user => {
      if (user) {
        this.boxService.addToPanier(box);
      } else {
        this.router.navigate(['/main/auth/login']);
      }
    })
  }

  getImagePath(relativePath: string): string {
    return `http://localhost:3000/${relativePath.replace(/\\/g, '/')}`;
  }
}
