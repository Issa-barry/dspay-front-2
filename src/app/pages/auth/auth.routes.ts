import { Routes } from '@angular/router';
import { Access } from './access';
 import { Error } from './error';
import { Login } from './login/login';
import { Register } from './register/register';
import { Verification } from './verification/verification';
import { Forgotpassword } from './forgotpassword/forgotpassword';
import { Newpassword } from './newpassword/newpassword';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'register', component: Register},
    { path:'register-verification', component:Verification},
    { path:'forgot-password', component:Forgotpassword},
    { path:'new-password', component:Newpassword}

] as Routes;
