import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Line } from '../../layout/line/line';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.services';
import { Product } from '../../models/product.model';
@Component({
  selector: 'app-home',
  imports: [RouterLink, Line, CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  email: string = '';
  onSubscribe() {
    alert('Merci de vous être inscrit à notre newsletter !');
  }

  products: Product[] | undefined = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    for (let i = 0; i <= 8; i++) {
      const product: Product | undefined = this.productService.getProductById(i);

      if (product) {
        this.products?.push(product);
      }
    }
  }
}
