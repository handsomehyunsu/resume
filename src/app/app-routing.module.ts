import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentsComponent } from './components/projects/contents/contents.component';
import { ContentFormComponent } from './components/projects/content-form/content-form.component';
import { AuthGuard } from './auth-guard/auth.guard';

const routes: Routes = [
  { path: '', component: ContentsComponent },
  { path: 'create', component: ContentFormComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: ContentFormComponent, canActivate: [AuthGuard] },
  { path: "auth", loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
