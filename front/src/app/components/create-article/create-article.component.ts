import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { AuthService } from '../../services/auth.service';
import Quill from 'quill';
import { jwtDecode } from 'jwt-decode';

const BlockEmbed = Quill.import('blots/block/embed') as any;
const Parchment = Quill.import('parchment');

class ImageBlot extends BlockEmbed {
  static blotName = 'image';
  static tagName = 'img';

  static create(value: any) {
    let node = super.create();
    node.setAttribute('src', value);
    return node;
  }
}

Quill.register(ImageBlot);

class LocalVideoBlot extends BlockEmbed {
  static blotName = 'localVideo';
  static tagName = 'video';
  static className = 'quill-local-video';
  static scope = Parchment.Scope.BLOCK_BLOT;

  static create(value: string) {
    const node: HTMLVideoElement = super.create() as HTMLVideoElement;
    node.setAttribute('controls', '');
    node.setAttribute('src', value);
    node.setAttribute('style', 'max-width: 100%; height: auto;');
    return node;
  }

  static value(node: HTMLVideoElement) {
    return node.getAttribute('src');
  }
}

Quill.register({ 'formats/localVideo': LocalVideoBlot });

@Component({
  selector: 'app-create-article',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css'],
})
export class CreateArticleComponent implements AfterViewInit, OnInit {
  article: any = {
    title: '',
    content: '',
    author: null
  };

  private quillEditor!: Quill;

  constructor(
    private articleService: ArticleService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.article.author = { id: decodedToken.userId };
    }
  }

  ngAfterViewInit() {
    this.quillEditor = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image', 'video'],
        ],
      },
    });

    this.quillEditor.on('text-change', () => {
      this.article.content = this.quillEditor.root.innerHTML;
    });

    const toolbar = this.quillEditor.getModule('toolbar') as any;
    toolbar.addHandler('image', () => this.selectLocalFile('image'));
    toolbar.addHandler('video', () => this.selectLocalFile('video'));
  }

  selectLocalFile(type: 'image' | 'video') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type + '/*';
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const range = this.quillEditor.getSelection(true);
      if (!range) return;

      if (type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          this.quillEditor.insertEmbed(range.index, 'image', imageUrl);
        };
        reader.readAsDataURL(file);
      } else if (type === 'video') {
        const videoUrl = URL.createObjectURL(file);
        this.quillEditor.insertEmbed(range.index, 'localVideo', videoUrl);
      }
    };
  }

  isFormValid(): boolean {
    const text = this.quillEditor?.getText().trim() || '';
    return !!(this.article.title && text.length > 0);
  }

  onSubmit() {
    if (!this.isFormValid()) return alert('Please enter title and content');

    this.articleService.createArticle(this.article).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }
}