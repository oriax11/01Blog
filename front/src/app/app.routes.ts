import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PostEditorComponent } from './components/create-article/create-article.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminPostsComponent } from './components/admin/admin-posts/admin-posts.component';
import { AdminReportsComponent } from './components/admin/admin-reports/admin-reports.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EditArticleComponent } from './components/edit-article/edit-article.component';

// 👇 import your functional guards
import { AuthGuard } from './guards/auth-guard';
import { GuestGuard } from './guards/guest-guard';
import { AdminGuard } from './guards/admin-guard';

export const routes: Routes = [
  // Public (guest) routes
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },

  // Protected routes (require login)
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile/:userId', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'create', component: PostEditorComponent, canActivate: [AuthGuard] },
  { path: 'article/:id', component: ArticleDetailComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: EditArticleComponent, canActivate: [AuthGuard] },

  // Admin routes
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [AdminGuard] },
  { path: 'admin/posts', component: AdminPostsComponent, canActivate: [AdminGuard] },
  { path: 'admin/reports', component: AdminReportsComponent, canActivate: [AdminGuard] },

  // Wildcard route
  { path: '**', redirectTo: 'home' },
];
