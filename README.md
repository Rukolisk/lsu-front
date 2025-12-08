# lab-GlycAmed
GlycAmed - Backend

Description

GlycAmed est une application collaborative de suivi de consommation de sucre, caféine et calories d’un étudiant nommé Amed.  
Les étudiants peuvent signaler les boissons ou produits consommés par Amed afin de suivre ses apports en temps réel.

Ce dépôt contient l’API backend, développée avec Node.js, Express, TypeScript, MongoDB et JWT.

---

## Stack technique

- Node.js + Express
- TypeScript (mode strict)
- MongoDB + Mongoose
- JWT pour l’authentification
- bcrypt pour le hash des mots de passe
- dotenv pour la configuration
- axios pour interroger l’API Open Food Facts
- cookie-parser pour la gestion des cookies & JWT

---

## Structure du projet

backend/
├── src/
│ ├── config/ # Connexion MongoDB
│ ├── controllers/ # Logique des routes
│ ├── middlewares/ # Auth JWT, validation...
│ ├── models/ # Schémas Mongoose (User, Conso)
│ ├── routes/ # Routes Express
│ ├── services/ # (à venir) logique métier
│ ├── utils/ # Fonctions utilitaires
│ ├── index.ts # Point d'entrée du serveur
│ └── types/ # Types et interfaces TS
├── package.json
├── tsconfig.json
└── .env.example


---

## Fonctionnalités implémentées

### Authentification JWT

- POST `/api/auth/register` → inscription d’un utilisateur  
  - Données requises : `email`, `password`, `prenom`, `nom`
  - Hash du mot de passe avec bcrypt
- POST `/api/auth/login` → connexion + génération d’un token JWT
- Middleware `authMiddleware` → protège les routes privées

### Consommations

- Modèle `Conso` :
  ```ts
  {
    produit: string;
    sucre: number;
    cafeine: number;
    calories: number;
    lieu?: string;
    notes?: string;
    user: ObjectId; // référence au contributeur connecté
  }

    POST /api/conso → ajout d’une consommation pour le contributeur connecté
    les nutriments sont récupérés via API Open Food Facts

    GET /api/conso/byUser → liste des consommations du contributeur connecté (/byUser/:id)

    Intégration de l’API Open Food Facts :

    https://world.openfoodfacts.org/api/v0/product/{barcode}.json

    Permet de récupérer automatiquement le sucre, la caféine et les calories à partir du code-barres.

Installation et lancement
Prérequis

    Node.js ≥ 18

    MongoDB en local ou sur Atlas

    npm ou yarn

Installation

cd backend
npm install

Lancement du serveur

npm run dev

Le serveur démarre par défaut sur :
    http://localhost:3000
    Variables d’environnement (.env)

Crée un fichier .env à la racine du backend :

PORT=3000
MONGO_URI=mongodb+srv://bastienfournier:5oEU5m6W2rI3N5x3@glycameddb.mr2jdh4.mongodb.net/GlycAmedDB?retryWrites=true&w=majority
JWT_SECRET=changeme_really_secret
JWT_EXPIRES_IN=1d

Endpoints actuels
    Auth
Méthode	    Endpoint	         Description
POST	    /api/auth/register	 Crée un utilisateur
POST	    /api/auth/login	     Connecte un utilisateur et renvoie un JWT
    Consommations
Méthode	    Endpoint	                Description
POST	    /api/conso	                Ajoute une consommation
GET	        /api/conso/byUser	        Récupère les consommations du user courant
GET	        /api/conso/byUser/:id	    Récupère les consommations d’un user spécifique
GET	        /api/conso/summary/day	    Récupère les consommations du jour en paramètre
GET	        /api/conso/summary/month	Récupère les consommations du mois en paramètre
GET	        /api/conso/summary/week	    Récupère les consommations de la semaine en paramètre

Exemple de flux complet (Postman)

    Inscription

POST /api/auth/register
{
  "prenom": "Thomas",
  "nom": "Durand",
  "email": "thomas@example.com",
  "password": "azerty123"
}

Connexion

POST /api/auth/login
{
  "email": "thomas@example.com",
  "password": "azerty123"
}

→ renvoie un token à ajouter dans bearer token dans l'onglet Auth pour les prochaines requête

Ajout de consommation

POST /api/conso
{
  "barcode": "9002490100070",
  "quantite": 250, //optionnel
  "lieu": "Bibliothèque" //optionnel
}