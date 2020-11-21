import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

import { Post } from '../../../models/Post';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-content-form',
  templateUrl: './content-form.component.html',
  styleUrls: ['./content-form.component.scss']
})

export class ContentFormComponent implements OnInit {
  posts: Post[]
  post: Post;
  isLoading = false;
  private mode = 'create'; //edit
  private postId: string; //edi

  postFormGroup : FormGroup;
  // @ViewChild('postForm') form: any; //html에서 사용한 #와 일치해야함

  categories = ['project', 'workExp']

  //ActivatedRoute
  //현재 active된 route를 감지하여 파라미터값을 전달받는다.
  constructor(
    public postService: PostService, 
    public route: ActivatedRoute
    ) { }

  ngOnInit(){
    this.postFormGroup = new FormGroup({
      category : new FormControl(''),
      projectName: new FormControl(''),
      language: new FormControl(''),
      term: new FormControl(''),
      description: new FormControl('')
    });

    //라우팅 규칙에 정의된 라우팅 변수를 map 타입의 Observable로 표현
    //맵을 사용하면 라우팅 규칙에 포함된 라우팅 인자를 한 번에 모두 가져올 수도 있음
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.postFormGroup.patchValue({
            category: postData.category,
            id: postData._id, 
            projectName: postData.projectName,
            language: postData.language,
            term: postData.term,
            description: postData.description,
            creator: postData.creator
          });
        });
        console.log(this.postFormGroup);
      }else{
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSubmit(){
    this.post = this.postFormGroup.value
    if(this.mode === 'create'){
      this.postService.addPost(
        this.post.category,
        this.post.projectName,
        this.post.language,
        this.post.term,
        this.post.description);
    }else{
      this.postService.updatePost(
        this.post.category,
        this.postId,
        this.post.projectName,
        this.post.language,
        this.post.term,
        this.post.description);
    }
    this.postFormGroup.reset();
  }
    
}
