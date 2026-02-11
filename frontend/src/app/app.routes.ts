import { Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { RegisterComponent } from './auth/register/register.component';
import { GadgetListComponent } from './gadget/gadget-list/gadget-list.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {path:'register',component:RegisterComponent},
    {
        path: 'home', component: SidenavComponent, children: [
            { path: 'gadgets', canActivate: [AuthGuard],component:GadgetListComponent},
        ]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
