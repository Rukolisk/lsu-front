import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-carrousel',
  imports: [CommonModule],
  templateUrl: './carrousel.html',
  styleUrl: './carrousel.css',
})
export class Carrousel {
  images = [
    '/tapis/tapis1.jpg',
    '/tapis/tapis2.webp',
    '/tapis/tapis3.webp',
    '/tapis/tapis4.jpg',
    '/tapis/tapis5.jpg',
    '/tapis/tapis6.jpg',
    '/tapis/tapis7.jpeg',
    '/tapis/tapis8.jpeg',
    '/tapis/tapis9.jpg',
  ];
}
