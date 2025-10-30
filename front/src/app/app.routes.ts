import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PostEditorComponent } from './components/create-article/create-article.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { SearchComponent } from './components/search/search.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminPostsComponent } from './components/admin/admin-posts/admin-posts.component';
import { AdminReportsComponent } from './components/admin/admin-reports/admin-reports.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EditArticleComponent } from './components/edit-article/edit-article.component';

// 👇 import your functional guards
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { AdminGuard } from './guards/admin-guard';

export const routes: Routes = [
  // Public (guest) routes
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },

  // Protected routes (require login)
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'search', component: SearchComponent, canActivate: [authGuard] },
  { path: 'profile/:userId', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'create', component: PostEditorComponent, canActivate: [authGuard] },
  { path: 'article/:id', component: ArticleDetailComponent, canActivate: [authGuard] },
  { path: 'edit/:id', component: EditArticleComponent, canActivate: [authGuard] },

  // Admin routes
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [AdminGuard] },
  { path: 'admin/posts', component: AdminPostsComponent, canActivate: [AdminGuard] },
  { path: 'admin/reports', component: AdminReportsComponent, canActivate: [AdminGuard] },

  // Wildcard route
  { path: '**', redirectTo: 'home' },
];
