import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddPaintingService } from './add-painting.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-add-painting',
  templateUrl: './add-painting.component.html',
  styleUrls: ['./add-painting.component.css']
})
export class AddPaintingComponent implements OnInit {
  paintingForm: FormGroup;
  authorEmail: string = '';
  

  constructor(
    private fb: FormBuilder,
    private addPaintingService: AddPaintingService, 
    private router: Router,
    private authService: AuthService 
  ) {
    this.paintingForm = this.fb.group({
      title: ['', Validators.required],
      year: ['', Validators.required],
      technique: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      price: ['', Validators.required],
      author: [{ value: this.authorEmail, disabled: true }, Validators.required] // Disable and set authorEmail
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe({
      next: (user) => {
        console.log('User from AuthService:', user);
        if (user) {
          console.log('User:', user);
          // Update the author field value directly
          this.paintingForm.get('author')?.setValue(user.email);
        }
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      }
    });
  }
  
  onSubmit() {
    if (this.paintingForm.valid) {
      // Submit the painting form
      console.log('Submitting painting:', this.paintingForm.value);
      this.addPaintingService.submitPainting(this.paintingForm.value).subscribe(
        (response) => {
          console.log(response);
          console.log('Painting submitted successfully!');
          this.router.navigate(['/paintings']);
        },
        (error) => {
          console.error('Error submitting painting:', error);
          if (error.error && error.error.message) {
            console.error('Error message from server:', error.error.message);
          }
          if (error.status === 0) {
            console.error('Connection error: Could not connect to server.');
          }
        }
      );
    }
  }
}


