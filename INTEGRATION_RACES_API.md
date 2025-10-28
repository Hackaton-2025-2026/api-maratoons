# 🔗 Intégration avec l'API externe des Races et Runners

## 📌 Contexte

L'API Marathon doit intégrer les données de courses ET de coureurs depuis une API externe située à :
**https://unsurrounded-gary-unprotruding.ngrok-free.dev**

L'URL de base est stockée dans la variable d'environnement : `API_PUBLIC_URI`

## 🎯 Objectif

Lors de la création d'un pari (bet), il faut **valider que le `race_id` ET le `runner_id` correspondent à des entités existantes** dans l'API externe :
- Le `race_id` doit exister dans l'API des races
- Le `runner_id` doit exister dans l'API des runners

## 📋 Routes disponibles de l'API externe

### 🏃 API Races :
- `GET /api/races` - Liste toutes les courses
- `GET /api/races/{id}` - Détails d'une course spécifique
- `GET /api/races/{id}/results` - Résultats d'une course
- `GET /api/races/{id}/km` - Distance en kilomètres d'une course

### 👟 API Runners :
- `GET /api/runners` - Liste tous les coureurs
- `GET /api/runners/{id}` - Détails d'un coureur spécifique
- `GET /api/runners/{id}/results` - Résultats d'un coureur

## 📊 Structure des données

### 🏃 Race
```json
{
  "id": 24,                                    // ID numérique unique de la course
  "id_public_race": "35ea45fb-af9e-3e4a-b373-571c61f7ab31",  // UUID public
  "name": "Marathon de Londres",              // Nom de la course
  "description": "Le Marathon de Londres...",  // Description
  "startDate": "2025-10-28T08:02:01+00:00",  // Date de début
  "createAt": "2020-12-18T19:28:25+00:00",   // Date de création
  "updatedAt": "2024-01-11T23:05:12+00:00",  // Date de mise à jour
  "kilometer": 60.28                          // Distance en km
}
```

### 👟 Runner
```json
{
  "id": 101,                                    // ID numérique unique du coureur
  "race": [],                                   // Tableau des courses du coureur
  "firstName": "Richard",                       // Prénom
  "lastName": "Mathieu",                        // Nom
  "nationality": "LR",                          // Nationalité (code ISO)
  "bibNumber": 2112,                            // Numéro de dossard
  "createAt": "2023-07-22T22:17:30+00:00",     // Date de création
  "updatedAt": "2025-01-16T22:37:22+00:00"     // Date de mise à jour
}
```

## ✅ Modifications nécessaires

### 1. Modèle Bets (models/Bets.js)
- **Changer le type de `race_id`** de `mongoose.Schema.Types.ObjectId` vers `Number`
- **Changer le type de `runner_id`** de `mongoose.Schema.Types.ObjectId` vers `Number`
- Le `race_id` stockera l'`id` numérique de la race depuis l'API externe (ex: 24, 31, etc.)
- Le `runner_id` stockera l'`id` numérique du runner depuis l'API externe (ex: 101, 102, etc.)
- ⚠️ **IMPORTANT** : Les IDs ne sont PLUS des ObjectId MongoDB mais des nombres simples

### 2. Contrôleur Bets (controllers/bet.controller.js)
- **Avant de créer un pari**, valider les deux IDs :
  - Vérifier que `race_id` existe via : `GET {API_PUBLIC_URI}/api/races/{race_id}`
  - Vérifier que `runner_id` existe via : `GET {API_PUBLIC_URI}/api/runners/{runner_id}`
- **Si les deux entités existent** → créer le pari
- **Si une entité n'existe pas** → retourner une erreur 400/404 avec message spécifique
- Même logique pour la modification d'un pari

### 3. Service à créer (services/race/race.service.js)
- Créer un service dédié pour interagir avec l'API externe
- Méthode : `validateRaceExists(raceId)` qui retourne `{ exists: boolean, data: object }`
- Méthode : `validateRunnerExists(runnerId)` qui retourne `{ exists: boolean, data: object }`
- Utiliser `axios` pour les appels HTTP
- Utiliser `process.env.API_PUBLIC_URI` comme URL de base

## 🔄 Flux de validation

```
1. Client fait POST /api/bets avec { race_id: 24, runner_id: 101, cote: 1.5, position: 1 }
                    ↓
2. Contrôleur valide race_id = 24
    Appel HTTP → GET {API_PUBLIC_URI}/api/races/24
                    ↓
3a. Race trouvée ✅ → Continuer
3b. Race non trouvée ❌ → Erreur 400 "Race ID 24 invalide"
                    ↓
4. Contrôleur valide runner_id = 101
    Appel HTTP → GET {API_PUBLIC_URI}/api/runners/101
                    ↓
5a. Runner trouvé ✅ → Créer le pari dans MongoDB
5b. Runner non trouvé ❌ → Erreur 400 "Runner ID 101 invalide"
```

## 🛠️ Dépendances à installer

```bash
npm install axios
```

## 📝 Exemple de code pour valider race et runner

```javascript
const axios = require('axios');

const API_BASE_URL = process.env.API_PUBLIC_URI;

// Valider une race
async function validateRaceExists(raceId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/races/${raceId}`);
    return { exists: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { exists: false, data: null };
    }
    throw error; // Autre erreur réseau
  }
}

// Valider un runner
async function validateRunnerExists(runnerId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/runners/${runnerId}`);
    return { exists: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { exists: false, data: null };
    }
    throw error; // Autre erreur réseau
  }
}
```

## 🎯 Points importants

1. **Les IDs dans Bets ne sont plus des ObjectId MongoDB** mais des nombres simples provenant de l'API externe
2. **Il faut vérifier l'existence de race_id ET runner_id** avant chaque création/modification de pari
3. **Les courses et coureurs ne sont pas stockés localement** dans MongoDB, ils restent dans l'API externe
4. **En cas d'indisponibilité de l'API externe**, il faudra gérer l'erreur (cache ? erreur 503 ?)
5. **Utiliser `process.env.API_PUBLIC_URI`** pour construire les URLs de l'API externe

## 📦 Variables d'environnement

Créer/Modifier le fichier `.env` :
```env
API_PUBLIC_URI=https://unsurrounded-gary-unprotruding.ngrok-free.dev
```

## ⚠️ Modifications du modèle Bets

Le modèle `models/Bets.js` doit être modifié ainsi :

**AVANT** :
```javascript
race_id: {
  type: mongoose.Schema.Types.ObjectId,  // ❌ ObjectId
  required: true,
},
runner_id: {
  type: mongoose.Schema.Types.ObjectId,  // ❌ ObjectId
  required: true,
}
```

**APRÈS** :
```javascript
race_id: {
  type: Number,  // ✅ Nombre simple (24, 31, etc.)
  required: true,
},
runner_id: {
  type: Number,  // ✅ Nombre simple (101, 102, etc.)
  required: true,
}
```

## 🔍 Questions restantes

1. Faut-il stocker des informations complémentaires (nom de la race, prénom du runner, etc.) dans le pari ?
2. Que faire si l'API externe est hors service temporairement ?
3. Faut-il implémenter un cache pour éviter trop d'appels HTTP ?
4. Le runner doit-il participer à la race spécifiée dans le pari ?

