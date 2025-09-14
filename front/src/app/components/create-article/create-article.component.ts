import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-create-article',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent {
  article = {
    title: '',
    content: '',
    excerpt: '',
    category: '',
    imageUrl: ''
  };
  
  tagsInput = '';
  selectedImage: File | null = null;
  imagePreview: string = '';

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      // In a real app, you would upload the image to a server
      // For demo purposes, we'll use a placeholder URL
      this.article.imageUrl = 'https://images.pexels.com/photos/276452/pexels-photo-276452.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = '';
    this.article.imageUrl = '';
  }

  isFormValid(): boolean {
    return !!(this.article.title && this.article.content && this.article.excerpt && this.article.category);
  }

  saveDraft() {
    // Implementation for saving draft
    alert('Draft saved successfully!');
  }

  onSubmit() {
    if (this.isFormValid()) {
      const tags = this.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const articleData = {
        ...this.article,
        tags
      };

      this.articleService.createArticle(articleData).subscribe(() => {
        alert('Article published successfully!');
        this.router.navigate(['/home']);
      });
    }
  }
}