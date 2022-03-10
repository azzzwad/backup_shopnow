import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog/blog.component';
import { PostComponent } from './post/post.component';



@NgModule({
  declarations: [BlogComponent, PostComponent],
  imports: [
    CommonModule
  ]
})
export class BlogModule { }
