import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/auth.service';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule
  ]
})
export class AppComponent {
  private auth = inject(AuthService);
  constructor(private router: Router) {}

  isLoggedIn() {
    return this.auth.isAuthenticated();
  }

  logout() {
    this.auth.logout();
  }

  navigate(route: string): void {
    console.log('Navigating to:', route);
    this.router.navigateByUrl('/' + route);
  }
}
