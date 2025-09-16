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
    imageUrl: ''
  };

  selectedImage: File | null = null;
  imagePreview: string = '';
  private quillEditor!: Quill;

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.quillEditor = new Quill('#editor', {
      theme: 'snow',
      placeholder: 'Write your article content here...',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image']
        ]
      }
    });

    this.quillEditor.on('text-change', () => {
      this.article.content = this.quillEditor.root.innerHTML;
    });

    (this.quillEditor.getModule('toolbar') as any).addHandler('image', () => {
      this.selectLocalImage();
    });
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
        if (range) {
          this.quillEditor.insertEmbed(range.index, 'image', imageUrl);
        }
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
