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
  products: Product[] = [];
  allProducts: Product[] = [];

  searchTerm: string = '';

  // Pagination
  itemsPerPage: number = 8;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.allProducts = this.productService.getProducts();
    this.updatePagination();
  }

  updatePagination() {
    // nombre total de pages
    this.totalPages = Math.ceil(this.allProducts.length / this.itemsPerPage);

    // produits affichés
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.products = this.allProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.updatePagination();
  }

  search() {
    if (this.searchTerm.trim() === '') {
      this.allProducts = this.productService.getProducts();
    } else {
      const product: Product[] | undefined = this.productService.getProductsByName(this.searchTerm);

      if (product) {
        this.allProducts = product;
      }
    }

    // reset page après une recherche
    this.currentPage = 1;
    this.updatePagination();
  }

  addItem() {
    // Récupérer le panier depuis localStorage
    const cartString = localStorage.getItem('cart');
    let cart: any[] = cartString ? JSON.parse(cartString) : [];

    const item = {
      id: 1000,
      name: 'Base',
      image: '/tapis/basetapis.jpg',
      price: 200,
      quantity: 1,
    };
    cart.push({ ...item });

    // Sauvegarder à nouveau dans localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Optionnel : notifier l'utilisateur
    alert(`${item.name} a été ajouté au panier !`);
  }
}
