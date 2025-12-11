import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Tapis A',
      price: 19.99,
      description: 'Un tapis très utile et qualitatif.',
      imageUrl: '/tapis/tapis1.jpg',
    },
    {
      id: 2,
      name: 'Tapis B',
      price: 29.99,
      description: 'Un tapis solution fiable et performante.',
      imageUrl: '/tapis/tapis2.webp',
    },
    {
      id: 3,
      name: 'Tapis C',
      price: 49.99,
      description: 'Le meilleur tapis de sa catégorie.',
      imageUrl: '/tapis/tapis3.webp',
    },
    {
      id: 4,
      name: 'Tapis D',
      price: 39.99,
      description: 'Un tapis confortable et élégant.',
      imageUrl: '/tapis/tapis4.jpg',
    },
    {
      id: 5,
      name: 'Tapis E',
      price: 59.99,
      description: 'Un tapis haut de gamme pour les connaisseurs.',
      imageUrl: '/tapis/tapis5.jpg',
    },
    {
      id: 6,
      name: 'Tapis F',
      price: 24.99,
      description: 'Un tapis abordable et de bonne qualité.',
      imageUrl: '/tapis/tapis6.jpg',
    },
    {
      id: 7,
      name: 'Tapis G',
      price: 34.99,
      description: 'Un tapis durable et résistant.',
      imageUrl: '/tapis/tapis7.jpeg',
    },
    {
      id: 8,
      name: 'Tapis H',
      price: 44.99,
      description: 'Un tapis design et moderne.',
      imageUrl: '/tapis/tapis8.jpeg',
    },
    {
      id: 9,
      name: 'Tapis I',
      price: 54.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis9.jpg',
    },
    {
      id: 10,
      name: 'Tapis J',
      price: 54.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis10.jpeg',
    },
    {
      id: 11,
      name: 'Tapis K',
      price: 54.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis11.jpeg',
    },
    {
      id: 12,
      name: 'Tapis L',
      price: 54.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis12.jpeg',
    },
    {
      id: 13,
      name: 'Tapis M',
      price: 54.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis13.jpeg',
    },
    {
      id: 14,
      name: 'Tapis N',
      price: 54.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis14.jpeg',
    },
    {
      id: 15,
      name: 'Tapis O',
      price: 54.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis15.jpeg',
    },
    {
      id: 16,
      name: 'Tapis P',
      price: 54.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis16.jpeg',
    },
    {
      id: 17,
      name: 'Tapis Q',
      price: 54.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis17.jpeg',
    },
    {
      id: 18,
      name: 'Tapis R',
      price: 54.99,
      description: 'Un tapis luxueux pour un intérieur chic.',
      imageUrl: '/tapis/tapis18.jpeg',
    },
    {
      id: 19,
      name: 'Tapis S',
      price: 54.99,
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
