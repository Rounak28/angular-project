import { Post } from './post-model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable()
export class PostsService {
   private posts: Post[] = [];
   private postsUpdated = new Subject<Post[]>();

   constructor(private http: HttpClient) {
   }
   getPosts() {
   this.http
     .get<{posts: any}>('http://localhost:3000/api/posts')
     .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
     };
   });
   }))
   .subscribe((transformedpost) => {
     // console.log('while deleting get post');
     this.posts = transformedpost;
     this.postsUpdated.next([...this.posts]);
   });
   // return this.posts;
 }

 getPost(id: string) {
    return {...this.posts.find(post => post.id === id)};
  }

 getPostUpdateListner() {
   return this.postsUpdated.asObservable();
 }

 addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts/', post)
    .subscribe((response) => {
         post.id = response.postId;
         this.posts.push(post);
         this.postsUpdated.next([...this.posts]);
       }, (err) => {
console.error(err);
       });
    }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content};
    this.http.put<{message: string, postId: string}>('http://localhost:3000/api/posts/' + id, post)
    .subscribe((responseData) => {
        console.log(responseData);

    });
  }

 deletePost(postId: string) {
  this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe((responseData) => {
      // console.log(responseData);
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
    //  console.log('this.post', this.posts);
      this.postsUpdated.next([...this.posts]);
      console.log(responseData);
    });
}
}
