import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import Quill from 'quill';

@Component({
  selector: 'app-create-article',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements AfterViewInit {
  article = {
    title: '',
    content: '',
    imageUrl: '',
    videos: [] as File[]
  };

  selectedImage: File | null = null;
  imagePreview: string = '';

  selectedVideos: { file: File; preview: string }[] = [];

  private quillEditor!: Quill;

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.quillEditor = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image', 'video']
        ]
      }
    });

    this.quillEditor.on('text-change', () => {
      this.article.content = this.quillEditor.root.innerHTML;
    });

    const toolbar = this.quillEditor.getModule('toolbar') as any;
    toolbar.addHandler('image', () => this.selectLocalImage());
    toolbar.addHandler('video', () => this.selectLocalVideo());
  }

  selectLocalImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const range = this.quillEditor.getSelection(true);
        if (range) this.quillEditor.insertEmbed(range.index, 'image', imageUrl);
      };
      reader.readAsDataURL(file);
    };
  }

  selectLocalVideo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const videoUrl = e.target?.result as string;
        const range = this.quillEditor.getSelection(true);
        if (range) this.quillEditor.insertEmbed(range.index, 'video', videoUrl);
      };
      reader.readAsDataURL(file);
    };
  }

  onImageSelect(event: any) {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      this.article.imageUrl = this.imagePreview;
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = '';
    this.article.imageUrl = '';
  }

  onVideoSelect(event: any) {
    const files = event.target.files as FileList;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('video/')) continue;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedVideos.push({ file, preview: e.target?.result as string });
        this.article.videos.push(file);
      };
      reader.readAsDataURL(file);
    }
  }

  removeVideo(index: number) {
    this.selectedVideos.splice(index, 1);
    this.article.videos.splice(index, 1);
  }

  isFormValid(): boolean {
    const text = this.quillEditor?.getText().trim() || '';
    return !!(this.article.title && text.length > 0);
  }

  onSubmit() {
    if (!this.isFormValid()) return alert('Please enter title and content');

    console.log('Article ready to submit:', this.article);

    this.articleService.createArticle(this.article).subscribe(() => {
      // alert('Article published!');
      // this.router.navigate(['/home']);
    });
  }
}
