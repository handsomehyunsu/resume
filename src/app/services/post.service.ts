import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

// import { environment } from "../../environments/environment";
import { environment } from '../../environments/environment.prod';


import { Post } from '../models/Post';

const postUrl = environment.localUrl + "posts/"

@Injectable({
  providedIn: 'root'
})


//비슷한 기능들을 묶어 코드의 중복 제거, 컴포넌트 간 데이터 중개
export class PostService {
  //post init
  private posts : Post[] =[];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { 
    //컨스트럭터의 매게변수로 받으면 앵귤러가 자동으로 서비스객체를 생성(new Http())해서 해당 클래스 속성으로 부여해줌
  }

  getPosts(){
    this.http.get<{posts: any}>(postUrl)
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          projectName: post.projectName,
          language: post.language,
          term: post.term,
          description: post.description,
          id: post._id,
          creator: post.creator
        };
      });
    }))
      .subscribe(transformedPosts => {
        console.log(transformedPosts);
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdatedLintenr(){
    return this.postsUpdated.asObservable();
  }

  getPost(id: string){
    return this.http.get<{_id: string, projectName: string, language: string, term: string, description: string, creator: string}>(
      postUrl + id
      );
  }

  addPost(projectName: string, language: string, term: string, description: string){
    const post: Post = {id: null, projectName: projectName, language: language, term: term, description: description, creator: null};
    this.http
      .post<{postId: string}>(postUrl, post)
      .subscribe(responseData => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, projectName: string, language: string, term: string, description: string){
    const post: Post = {id: id, projectName: projectName, language: language, term: term, description: description, creator: null};
    this.http.put(postUrl + id, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string){
    this.http.delete(postUrl + postId)
    .subscribe(() => {
      //왜 find는 못사용할까????
      //const updatedPost = this.posts.find(post => post.projectName != postProjectName);
      const updatedPost = this.posts.filter(post => post.id != postId);
      this.posts = updatedPost;
      this.postsUpdated.next([...this.posts]);
    });
  }

}
