import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Post } from '../../../models/Post';
import { PostService } from '../../../services/post.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.scss']
})
export class ContentsComponent implements OnInit, OnDestroy {

  // post:Post = {
  //   id: '',
  //   projectName: '',
  //   language: '',
  //   term: '',
  //   description: ''
  // }

  posts: Post[] =[];
  private postsSub: Subscription;
  userIsAuthenticated = false;
  userId: string;
  private isLoading = false;
  private authStatusSub: Subscription;

  // showAddPostForm: boolean = false;
 
  constructor(public postService: PostService, private authServie: AuthService) { }

  ngOnInit() {
    this.postService.getPosts();
    this.userId = this.authServie.getUserId();
    this.postsSub = this.postService.getPostUpdatedLintenr().subscribe((posts: Post[]) => { 
      this.posts = posts;
    });
    this.userIsAuthenticated = this.authServie.getIsAuth();
    this.authStatusSub = this.authServie
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authServie.getUserId();
      });
    }

  onDelete(postId: string){
    this.postService.deletePost(postId);
    this.authStatusSub.unsubscribe();
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

  
}
