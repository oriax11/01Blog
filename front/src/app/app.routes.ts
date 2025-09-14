import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CreateArticleComponent } from './components/create-article/create-article.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'create', component: CreateArticleComponent },
  { path: 'article/:id', component: ArticleDetailComponent },
  { path: '**', redirectTo: '' }
];