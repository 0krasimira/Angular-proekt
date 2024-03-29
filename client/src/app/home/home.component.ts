import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service'; // Import your authentication service here

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  features!: NodeListOf<HTMLDivElement>;
  currentFeatureIndex: number = 0;
  intervalId: any;

  constructor(private authService: AuthService) { } // Inject AuthService

  ngOnInit(): void {
    this.features = document.querySelectorAll('.feature');
    this.showFeature(this.currentFeatureIndex);
    this.intervalId = setInterval(() => this.nextFeature(), 3000);

    // Subscribe to changes in authentication status
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  showFeature(index: number): void {
    this.features.forEach((feature, i) => {
      if (i === index) {
        feature.style.display = 'block';
      } else {
        feature.style.display = 'none';
      }
    });
  }

  nextFeature(): void {
    this.currentFeatureIndex = (this.currentFeatureIndex + 1) % this.features.length;
    this.showFeature(this.currentFeatureIndex);
  }
}
