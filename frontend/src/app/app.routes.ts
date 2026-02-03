import { Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    {
        path: 'home', component: SidenavComponent, children: [
            { path: 'gadgets', canActivate: [AuthGuard], loadChildren: () => import('./gadget/gadget.module').then(m => m.GadgetModule) },
        ]
    },
    { path: '**', redirectTo: '' }
];
