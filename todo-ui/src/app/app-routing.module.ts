import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./_component/login/login.component";
import {AuthGuard} from "./_guards/auth.guard";
import {TodoListComponent} from "./_component/todo-list/todo-list.component";
import {RegisterComponent} from "./_component/register/register.component";


const routes: Routes = [
  {
    path: 'todolist',
    canActivate: [AuthGuard],
    component: TodoListComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
