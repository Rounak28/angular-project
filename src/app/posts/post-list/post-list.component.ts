import { Component, OnInit, OnDestroy} from '@angular/core';
import { Post } from '../post-model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';
import { timeInterval } from 'rxjs/operators';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html'
})

export class PostListComponent implements OnInit, OnDestroy {

  //  posts = [
  //    {title: 'First Post', content: 'This is the first post'},
  //    {title: 'Second Post' , content: 'This is the second post'},
  //    {title: 'Third Post' , content: 'This is the third post'}
  //  ];
   posts = [];
   private postsSub: Subscription;
    constructor(private postService: PostsService) {
    }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  ngOnInit() {
    this.postService.getPosts();
    // console.log(this.postService)
    this.postsSub = this.postService.getPostUpdateListner()
    .subscribe((posts: Post[]) => {
      console.log('asd');
      this.posts = posts;
    });


    // console.log('after');
  }




  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
