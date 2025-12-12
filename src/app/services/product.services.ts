import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Revêtement A',
      price: 69.99,
      description: 'Un tapis très utile et qualitatif.',
      imageUrl: '/tapis/tapis1.jpg',
    },
    {
      id: 2,
      name: 'Revêtement B',
      price: 69.99,
      description: 'Un tapis solution fiable et performante.',
      imageUrl: '/tapis/tapis2.webp',
    },
    {
      id: 3,
      name: 'Revêtement C',
      price: 69.99,
      description: 'Le meilleur tapis de sa catégorie.',
      imageUrl: '/tapis/tapis3.webp',
    },
    {
      id: 4,
      name: 'Revêtement D',
      price: 85.99,
      description: 'Un tapis confortable et élégant.',
      imageUrl: '/tapis/tapis4.jpg',
    },
    {
      id: 5,
      name: 'Revêtement E',
      price: 85.99,
      description: 'Un tapis haut de gamme pour les connaisseurs.',
      imageUrl: '/tapis/tapis5.jpg',
    },
    {
      id: 6,
      name: 'Revêtement F',
      price: 85.99,
      description: 'Un tapis abordable et de bonne qualité.',
      imageUrl: '/tapis/tapis6.jpg',
    },
    {
      id: 7,
      name: 'Revêtement G',
      price: 85.99,
      description: 'Un tapis durable et résistant.',
      imageUrl: '/tapis/tapis7.jpeg',
    },
    {
      id: 8,
      name: 'Revêtement H',
      price: 85.99,
      description: 'Un tapis design et moderne.',
      imageUrl: '/tapis/tapis8.jpeg',
    },
    {
      id: 9,
      name: 'Revêtement I',
      price: 85.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis9.jpg',
    },
    {
      id: 10,
      name: 'Revêtement J',
      price: 89.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis10.jpeg',
    },
    {
      id: 11,
      name: 'Revêtement K',
      price: 89.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis11.jpeg',
    },
    {
      id: 12,
      name: 'Revêtement L',
      price: 89.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis12.jpeg',
    },
    {
      id: 13,
      name: 'Revêtement M',
      price: 89.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis13.jpeg',
    },
    {
      id: 14,
      name: 'Revêtement N',
      price: 89.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis14.jpeg',
    },
    {
      id: 15,
      name: 'Revêtement O',
      price: 89.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis15.jpeg',
    },
    {
      id: 16,
      name: 'Revêtement P',
      price: 89.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis16.jpeg',
    },
    {
      id: 17,
      name: 'Revêtement Q',
      price: 93.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis17.jpeg',
    },
    {
      id: 18,
      name: 'Revêtement R',
      price: 93.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis18.jpeg',
    },
    {
      id: 19,
      name: 'Revêtement S',
      price: 93.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis19.jpeg',
    },
  ];

  getProducts(): Product[] {
    console.log('Fetching products:', this.products);
    return this.products;
  }

  getProductsByName(name: string): Product[] | undefined {
    return this.products.filter((product) =>
      product.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  getProductById(id: number): Product | undefined {
    return this.products.find((product) => product.id === id);
  }
}
