import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.services';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
  imports: [],
})
export class ProductDetail implements OnInit {
  productId!: string;
  product: Product | undefined;
  item: { id: Number; name: String; image: String; price: Number; quantity: Number } = {
    id: 0,
    name: '',
    image: '',
    price: 0,
    quantity: 0,
  };
  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.product = this.productService.getProductById(Number(this.productId));
    if (this.product)
      this.item = {
        id: this.product?.id,
        name: this.product?.name,
        image: this.product?.imageUrl,
        price: this.product?.price,
        quantity: 1,
      };
  }

  increaseQty(item: any) {
    item.quantity++;
  }

  decreaseQty(item: any) {
    if (item.quantity > 1) item.quantity--;
  }

  addItem() {
    // Récupérer le panier depuis localStorage
    const cartString = localStorage.getItem('cart');
    let cart: any[] = cartString ? JSON.parse(cartString) : [];

    // Vérifier si le produit existe déjà dans le panier
    const existingItemIndex = cart.findIndex((i) => i.id === this.item.id);

    if (existingItemIndex !== -1) {
      // Produit déjà présent → ajouter la quantité
      cart[existingItemIndex].quantity += this.item.quantity;
    } else {
      // Produit non présent → ajouter l'item
      cart.push({ ...this.item });
    }

    // Sauvegarder à nouveau dans localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Optionnel : notifier l'utilisateur
    alert(`${this.item.name} a été ajouté au panier !`);
  }
}
