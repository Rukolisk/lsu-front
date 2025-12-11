import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class Cart implements OnInit {
  cartItems: { id: number; name: string; image: string; price: number; quantity: number }[] = [];

  shippingCost = 8;

  constructor(private stripeService: StripeService) {}

  ngOnInit(): void {
    // Récupérer le panier depuis localStorage
    const cartString = localStorage.getItem('cart');
    this.cartItems = cartString ? JSON.parse(cartString) : [];
  }

  // Paiement
  pay() {
    this.stripeService.pay();
  }

  // Total d'articles
  get totalItems() {
    return this.cartItems.reduce((t, item) => t + item.quantity, 0);
  }

  // Total prix
  get totalPrice() {
    return this.cartItems.reduce((t, item) => t + item.quantity * item.price, 0);
  }

  // Ajouter quantité
  increaseQty(item: any) {
    item.quantity++;
    this.updateLocalStorage();
  }

  // Diminuer quantité
  decreaseQty(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateLocalStorage();
    }
  }

  // Supprimer un produit
  removeFromCart(item: any) {
    this.cartItems = this.cartItems.filter((i) => i.id !== item.id);
    this.updateLocalStorage();
  }

  // Mettre à jour localStorage
  private updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
}
