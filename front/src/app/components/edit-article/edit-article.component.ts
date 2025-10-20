import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MediaUploadService, MediaUploadResponse } from '../../services/media.service';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { FormsModule } from '@angular/forms';
import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed') as any;

class LocalVideoBlot extends BlockEmbed {
  static blotName = 'video';
  static tagName = 'video';
  static className = 'quill-local-video';

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

Quill.register(LocalVideoBlot, true);

interface UploadingFile {
  id: string;
  tempUrl: string;
  type: 'image' | 'video';
  position: number;
  file: File;
}

@Component({
  selector: 'app-edit-article',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css'],
  standalone: true,
})
export class EditArticleComponent implements OnInit, OnDestroy {
  @ViewChild('editor', { static: true }) editorElement!: ElementRef;

  quillEditor!: Quill;
  userId: number = 101; // Replace with actual user ID from auth service
  uploadingFiles = new Map<string, UploadingFile>(); // Track uploading files
  uploadedFiles = new Map<string, string>(); // Map temp URL to server URL
  articleId!: string;

  constructor(
    private mediaUploadService: MediaUploadService,
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  article: any = {
    title: '',
    content: '',
    author: null,
    fileUrl: null,
  };

  ngOnInit() {
    this.initializeQuillEditor();
    this.articleId = this.route.snapshot.paramMap.get('id')!;
    if (this.articleId) {
      this.articleService.getArticleById(this.articleId).subscribe((article) => {
        this.article = article;
        this.quillEditor.root.innerHTML = article.content;
      });
    }
  }

  ngOnDestroy() {
    // Clean up blob URLs
    this.uploadingFiles.forEach((file) => {
      URL.revokeObjectURL(file.tempUrl);
    });
  }

  initializeQuillEditor() {
    this.quillEditor = new Quill(this.editorElement.nativeElement, {
      theme: 'snow',
      modules: {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['link', 'image', 'video'],
            ['clean'],
          ],
          handlers: {
            image: () => this.selectLocalFile('image'),
            video: () => this.selectLocalFile('video'),
          },
        },
      },
      placeholder: 'Write your post here...',
    });
  }

  selectLocalFile(type: 'image' | 'video') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'image' ? 'image/*' : 'video/*';
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size exceeds 10MB limit');
        return;
      }

      const range = this.quillEditor.getSelection(true);
      if (!range) return;

      // Create temporary blob URL for immediate preview
      const tempUrl = URL.createObjectURL(file);
      console.log(tempUrl);
      const uploadId = `upload_${Date.now()}_${Math.random()}`;

      // Insert media immediately with temp URL

      this.quillEditor.insertEmbed(range.index, type, uploadId);

      // Move cursor after the inserted media
      this.quillEditor.setSelection(range.index + 1, 0);

      // Track uploading file
      this.uploadingFiles.set(uploadId, {
        id: uploadId,
        tempUrl: tempUrl,
        type: type,
        position: range.index,
        file: file,
      });

      // Upload to backend
      this.uploadFile(uploadId, file, tempUrl, type);
    };
  }

  private uploadFile(uploadId: string, file: File, tempUrl: string, type: 'image' | 'video') {
    this.mediaUploadService
      .uploadFile(file, this.userId)
      .pipe(
        finalize(() => {
          // Clean up
          this.uploadingFiles.delete(uploadId);
        })
      )
      .subscribe({
        next: (response: MediaUploadResponse) => {
          console.log('Upload successful:', response);

          // Build full URL for media preview
          const serverUrl = `${environment.apiUrl}/api/media${response.fileUrl}`;

          // Store mapping from temp URL to server URL
          this.uploadedFiles.set(tempUrl, serverUrl);
          console.log('link : ', serverUrl);

          // Replace temp URL with server URL in editor
          this.replaceUrlInEditor(uploadId, serverUrl, type);

          // Clean up blob URL
          URL.revokeObjectURL(tempUrl);
        },
        error: (error) => {
          console.error('Upload failed:', error);
          const errorMessage = error.error?.message || 'Failed to upload file';
          alert(`Upload failed: ${errorMessage}`);

          // Remove failed upload from editor
          this.removeUrlFromEditor(tempUrl, type);

          // Clean up blob URL
          URL.revokeObjectURL(tempUrl);
        },
      });
  }

  /**
   * Replace temporary URL with server URL in editor
   */
  private replaceUrlInEditor(oldUrl: string, newUrl: string, type: 'image' | 'video') {
    const delta = this.quillEditor.getContents();
    let position = 0;
    let found = false;
    console.log(delta);

    for (let i = 0; i < delta.ops!.length; i++) {
      const op = delta.ops![i];

      if (op.insert && typeof op.insert === 'object') {
        // Check if this is the media we're looking for
        if (
          (type === 'image' && op.insert['image'] === oldUrl) ||
          (type === 'video' && op.insert['video'] === oldUrl)
        ) {
          // Delete old embed
          this.quillEditor.deleteText(position, 1, 'silent');

          // Insert new embed with server URL
          this.quillEditor.insertEmbed(position, type, newUrl, 'silent');
          console.log('new here :' + newUrl);

          found = true;
          break;
        }
        position += 1;
      } else if (typeof op.insert === 'string') {
        position += op.insert.length;
      }
    }

    if (!found) {
      console.warn('Could not find URL to replace:', oldUrl);
    }
  }

  /**
   * Remove URL from editor (for failed uploads)
   */
  private removeUrlFromEditor(url: string, type: 'image' | 'video') {
    const delta = this.quillEditor.getContents();
    let position = 0;

    for (let i = 0; i < delta.ops!.length; i++) {
      const op = delta.ops![i];

      if (op.insert && typeof op.insert === 'object') {
        if (
          (type === 'image' && op.insert['image'] === url) ||
          (type === 'video' && op.insert['video'] === url)
        ) {
          this.quillEditor.deleteText(position, 1, 'silent');
          break;
        }
        position += 1;
      } else if (typeof op.insert === 'string') {
        position += op.insert.length;
      }
    }
  }

  /**
   * Extract all file URLs from editor content (server URLs only)
   */
  extractFileUrls(): string[] {
    const content = this.quillEditor.getContents();
    const urls: string[] = [];

    content.ops?.forEach((op) => {
      if (op.insert && typeof op.insert === 'object') {
        let url: string | undefined;

        if ('image' in op.insert && typeof op.insert['image'] === 'string') {
          url = op.insert['image'];
        } else if ('video' in op.insert && typeof op.insert['video'] === 'string') {
          url = op.insert['video'];
        }

        // Only include server URLs (not blob URLs)
        if (url && !url.startsWith('blob:')) {
          urls.push(url);
        }
      }
    });

    return urls;
  }

  /**
   * Get editor content as HTML
   */
  getContent(): string {
    return this.quillEditor.root.innerHTML;
  }

  /**
   * Get editor content as Delta (Quill's internal format)
   */
  getDelta() {
    return this.quillEditor.getContents();
  }

  /**
   * Check if any files are still uploading
   */
  isUploading(): boolean {
    return this.uploadingFiles.size > 0;
  }

  /**
   * Get number of files currently uploading
   */
  getUploadingCount(): number {
    return this.uploadingFiles.size;
  }

  /**
   * Submit post
   */
  async updatePost() {
    if (this.isUploading()) {
      alert('Please wait for all files to finish uploading');
      return;
    }

    const content = this.getContent();
    const fileUrls = this.extractFileUrls();

    console.log('Post content:', content);
    console.log('File URLs:', fileUrls);
    this.article.content = content;
    this.article.fileUrls = fileUrls;

    this.articleService.updateArticle(this.articleId, this.article).subscribe(() => {
      this.router.navigate(['/article', this.articleId]);
    });
  }

  /**
   * Clear editor content
   */
  clearEditor() {
    this.quillEditor.setText('');
    this.uploadedFiles.clear();
  }

  /**
   * Set editor content (for editing existing posts)
   */
  setContent(html: string) {
    this.quillEditor.root.innerHTML = html;
  }
}
