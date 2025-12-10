import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.services';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products implements OnInit {
  products: Product[] | undefined = [];
  allProducts: Product[] = [];
  searchTerm: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.allProducts = this.productService.getProducts();
    this.products = [...this.allProducts];
  }

  search() {
    if (this.searchTerm.trim() === '') {
      this.products = [...this.allProducts]; // reset si barre vide
    } else {
      this.products = this.productService.getProductsByName(this.searchTerm);
    }
  }
}
