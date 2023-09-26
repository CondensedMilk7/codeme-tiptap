import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmEndpoint], tiptap-editor[cdmEndpoint]',
})
export class CdmEndpointDirective implements OnInit {
  @Input('cdmEndpoint') backendUrl: string = '';
  @Input() data: any;
  @Input() debounceTime: number = 300;
  @Input() sendDatainChar: number = 50;
  private sendDataSubject = new Subject<any>();
  private lastSentLength = 0;
  private isRequestInProgress = false;

  constructor(private http: HttpClient) {
    this.sendDataSubject
      .pipe(
        debounceTime(this.debounceTime),
        switchMap((dataToSend) => {
          this.isRequestInProgress = true;
          return this.http.put(this.backendUrl, dataToSend);
        })
      )
      .subscribe(
        (response) => {
          console.log('Data sent successfully:', response);
          this.isRequestInProgress = false;
        },
        (error) => {
          console.error('Data sending failed:', error);
          this.isRequestInProgress = false;
        }
      );
  }

  ngOnInit(): void {}

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    this.checkDataLength();
  }

  checkDataLength(): void {
    if (this.isRequestInProgress) return;

    const currentLength = this.data?.description.length || 0;
    console.log('CURRENT LENGTH' + currentLength);
    if (currentLength >= this.lastSentLength + this.sendDatainChar) {
      this.sendData();
      this.lastSentLength = currentLength;
      console.log("DATA THAT I'M SENDING:", this.data);
      console.log('CHARACTER LENGHT' + this.data.description.length);
    }
  }

  sendData(): void {
    this.sendDataSubject.next(this.data);
  }
}
