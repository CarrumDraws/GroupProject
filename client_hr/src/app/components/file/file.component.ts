import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  // imageUrl: string | null = null;


  ngOnInit(): void {

    // let encodeFileUrl = localStorage.getItem(encodedFileUrl);

    // if(encodeFileUrl != null){
    //   this.imageUrl = CryptoJS.AES.decrypt(encodeFileUrl, environment.myEncodeKey).toString(CryptoJS.enc.Utf8);
    // }
    
  }

  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHandler(event: Event) {
  //   // Remove local storage item before leaving the page
  //   localStorage.removeItem('encodedFileUrl');
  // }

  // @HostListener('window:visibilitychange', ['$event'])
  // visibilityChangeHandler(event: Event) {
  //   // Check if the tab/window is hidden (user switched tabs)
  //   if (document.visibilityState === 'hidden') {
  //     // Remove local storage item when the tab/window is hidden
  //     localStorage.removeItem('encodedFileUrl');
  //   }
  // }




}
