# 📋 Liste des routes disponibles sur l'API

Une fois ngrok configuré, votre API sera accessible via une URL publique. Voici toutes les routes disponibles.

> **Base URL (exemple)** : `https://xxxx-xx-xx-xxx.ngrok-free.app`

---

## 🔓 Routes publiques (pas d'authentification)

### Accueil
```
GET  /                              # Page d'accueil de l'API
GET  /api/health                    # Health check (🔒 Authentification requise)
```

### Utilisateurs
```
POST /api/users/register            # Créer un compte utilisateur
POST /api/users/login               # Se connecter et obtenir un JWT token
```

### Paris (Bets)
```
GET  /api/bets                      # Récupérer tous les paris
GET  /api/bets/race/:raceId         # Récupérer les paris par course
GET  /api/bets/runner/:runnerId     # Récupérer les paris par coureur
GET  /api/bets/:id                  # Récupérer un pari spécifique
POST /api/bets                      # Créer un pari
PUT  /api/bets/:id                  # Modifier un pari
DELETE /api/bets/:id                # Supprimer un pari
```

### Utilisateurs (lecture)
```
GET  /api/users                     # Récupérer tous les utilisateurs
GET  /api/users/:id                 # Récupérer un utilisateur spécifique
```

---

## 🔒 Routes protégées (authentification JWT requise)

> **Note** : Pour utiliser ces routes, vous devez envoyer le header :
> ```
> Authorization: Bearer VOTRE_JWT_TOKEN
> ```

### Utilisateurs
```
GET    /api/users/me/bets           # Récupérer mes paris personnels
POST   /api/users/me/bets           # Créer un pari personnel
DELETE /api/users/me/bets/:betId    # Supprimer un de mes paris
PUT    /api/users/:id               # Modifier un utilisateur
DELETE /api/users/:id               # Supprimer un utilisateur
```

### Groupes
> **Toutes les routes de groupes nécessitent une authentification**

```
GET  /api/groups                    # Récupérer tous les groupes
GET  /api/groups/:id                # Récupérer les membres d'un groupe
POST /api/groups/create             # Créer un groupe
POST /api/groups/join/:code         # Rejoindre un groupe avec un code
POST /api/groups/:id/leave          # Quitter un groupe
POST /api/groups/:id/ban            # Bannir un utilisateur d'un groupe
```

---

## 📝 Exemples d'utilisation

### 1. Créer un compte utilisateur
```bash
curl -X POST https://xxxx-xx-xx-xxx.ngrok-free.app/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "motdepasse123"
  }'
```

### 2. Se connecter
```bash
curl -X POST https://xxxx-xx-xx-xxx.ngrok-free.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "motdepasse123"
  }'
```

**Réponse** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### 3. Créer un pari (authentifié)
```bash
curl -X POST https://xxxx-xx-xx-xxx.ngrok-free.app/api/users/me/bets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN" \
  -d '{
    "runnerId": "abc123",
    "raceId": "race123",
    "amount": 50
  }'
```

### 4. Récupérer tous les groupes (authentifié)
```bash
curl -X GET https://xxxx-xx-xx-xxx.ngrok-free.app/api/groups \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN"
```

### 5. Rejoindre un groupe (authentifié)
```bash
curl -X POST https://xxxx-xx-xx-xxx.ngrok-free.app/api/groups/join/ABC123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN"
```

### 6. Créer un groupe (authentifié)
```bash
curl -X POST https://xxxx-xx-xx-xxx.ngrok-free.app/api/groups/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN" \
  -d '{
    "name": "Mes amis",
    "description": "Groupe pour mes amis"
  }'
```

---

## 🔍 Remarques importantes

### Authentification
- Les routes marquées avec 🔒 nécessitent un JWT token dans le header `Authorization`
- Pour obtenir un token : utilisez `/api/users/login`
- Le token doit être envoyé dans chaque requête protégée

### Codes de statut HTTP
- `200 OK` : Succès
- `201 Created` : Ressource créée
- `400 Bad Request` : Données invalides
- `401 Unauthorized` : Non authentifié ou token invalide
- `404 Not Found` : Ressource introuvable
- `500 Internal Server Error` : Erreur serveur

### Headers requis
```http
Content-Type: application/json
Authorization: Bearer VOTRE_JWT_TOKEN  # Pour les routes protégées
```

---

## 🧪 Tester votre API

### Option 1 : Avec curl
```bash
# Tester la route d'accueil
curl https://xxxx-xx-xx-xxx.ngrok-free.app/

# Tester la création d'un utilisateur
curl -X POST https://xxxx-xx-xx-xxx.ngrok-free.app/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'
```

### Option 2 : Avec Postman
1. Importez la collection
2. Remplacez `localhost:3000` par votre URL ngrok
3. Testez les routes

### Option 3 : Avec le navigateur
- Ouvrez simplement : `https://xxxx-xx-xx-xxx.ngrok-free.app/`
- Vous verrez : `{"message":"API Marathon - Bienvenue!","version":"1.0.0","status":"running"}`

### Option 4 : Dashboard ngrok
- Accédez à : `http://127.0.0.1:4040`
- Inspectez toutes les requêtes en temps réel

---

## 📊 Résumé des routes

| Méthode | Route | Authentification | Description |
|---------|-------|------------------|-------------|
| GET | `/` | ❌ | Accueil |
| GET | `/api/health` | ✅ | Health check |
| POST | `/api/users/register` | ❌ | Inscription |
| POST | `/api/users/login` | ❌ | Connexion |
| GET | `/api/users` | ❌ | Liste utilisateurs |
| GET | `/api/users/:id` | ❌ | Détails utilisateur |
| PUT | `/api/users/:id` | ✅ | Modifier utilisateur |
| DELETE | `/api/users/:id` | ✅ | Supprimer utilisateur |
| GET | `/api/users/me/bets` | ✅ | Mes paris |
| POST | `/api/users/me/bets` | ✅ | Créer un pari |
| DELETE | `/api/users/me/bets/:betId` | ✅ | Supprimer un pari |
| GET | `/api/bets` | ❌ | Liste des paris |
| GET | `/api/bets/race/:raceId` | ❌ | Paris par course |
| GET | `/api/bets/runner/:runnerId` | ❌ | Paris par coureur |
| GET | `/api/bets/:id` | ❌ | Détails d'un pari |
| POST | `/api/bets` | ❌ | Créer un pari |
| PUT | `/api/bets/:id` | ❌ | Modifier un pari |
| DELETE | `/api/bets/:id` | ❌ | Supprimer un pari |
| GET | `/api/groups` | ✅ | Liste des groupes |
| GET | `/api/groups/:id` | ✅ | Membres d'un groupe |
| POST | `/api/groups/create` | ✅ | Créer un groupe |
| POST | `/api/groups/join/:code` | ✅ | Rejoindre un groupe |
| POST | `/api/groups/:id/leave` | ✅ | Quitter un groupe |
| POST | `/api/groups/:id/ban` | ✅ | Bannir un utilisateur |

**Total : 27 routes**
- Routes publiques : 14
- Routes protégées : 13

