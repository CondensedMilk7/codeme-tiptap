import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  content = new FormControl('initial value here', [Validators.required]);

  ngOnInit(): void {
    this.content.valueChanges.subscribe((val) =>
      console.log(this.content.valid)
    );
  }
}
