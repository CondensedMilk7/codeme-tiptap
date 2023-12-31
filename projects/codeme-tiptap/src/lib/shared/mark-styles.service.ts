import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarkStylesService {
  private markStyles: { [key: string]: string } = {};

  constructor() {}

  // Function to save hex parameter
  saveHexParameter(key: string, hexValue: string): void {
    this.markStyles[key] = hexValue;
  }

  // Function to get hex parameter by key
  getHexParameter(key: string): string | undefined {
    return this.markStyles[key];
  }

  // Function to get all hex parameters
  getAllHexParameters(): Observable<{ [key: string]: string }> {
    return of(this.markStyles);
  }
}
