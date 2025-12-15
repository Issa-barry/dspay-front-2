import { Routes } from '@angular/router';
import { Access } from './access';
 import { Error } from './error';
import { Login } from './login/login';
import { Register } from './register/register';
import { Verification } from './verification/verification';
import { ForgotPassword } from './forgot-password/forgot-password';
import { NewPassword } from './new-password/new-password';
 

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'register', component: Register},
    { path:'verification', component:Verification},
    { path:'forgot-password', component:ForgotPassword},
    { path:'new-password', component:NewPassword}

] as Routes;
