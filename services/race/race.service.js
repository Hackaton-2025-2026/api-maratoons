// Service pour valider les races et runners auprès de l'API externe

const axios = require('axios');

const API_BASE_URL = process.env.API_PUBLIC_URI;

// Vérifier que l'URL de l'API est définie
if (!API_BASE_URL) {
  console.error('⚠️  API_PUBLIC_URI n\'est pas définie dans les variables d\'environnement');
}

/**
 * Valider qu'une race existe dans l'API externe
 * @param {number} raceId - ID de la race à valider
 * @returns {Promise<{exists: boolean, data: object|null}>}
 */
async function validateRaceExists(raceId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/races/${raceId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      },
      timeout: 5000 // Timeout de 5 secondes
    });
    return { exists: true, data: response.data };
  } catch (error) {
    if (error.response) {
      // Erreur HTTP (404, 500, etc.)
      if (error.response.status === 404) {
        return { exists: false, data: null };
      }
      // Autres erreurs HTTP (500, 502, etc.)
      console.error(`Erreur HTTP ${error.response.status} lors de la validation de la race ${raceId}:`, error.response.data);
      return { exists: false, data: null };
    }
    // Erreur réseau (timeout, connexion, etc.)
    console.error(`Erreur réseau lors de la validation de la race ${raceId}:`, error.message);
    return { exists: false, data: null };
  }
}

/**
 * Valider qu'un runner existe dans l'API externe
 * @param {number} runnerId - ID du runner à valider
 * @returns {Promise<{exists: boolean, data: object|null}>}
 */
async function validateRunnerExists(runnerId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/runners/${runnerId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      },
      timeout: 5000
    });
    
    return { exists: true, data: response.data };
  } catch (error) {
    if (error.response) {
      // Erreur HTTP (404, 500, etc.)
      if (error.response.status === 404) {
        return { exists: false, data: null };
      }
      // Autres erreurs HTTP (500, 502, etc.)
      console.error(`Erreur HTTP ${error.response.status} lors de la validation du runner ${runnerId}:`, error.response.data);
      return { exists: false, data: null };
    }
    
    // Erreur réseau (timeout, connexion, etc.)
    console.error(`Erreur réseau lors de la validation du runner ${runnerId}:`, error.message);
    return { exists: false, data: null };
  }
}

/**
 * Valider qu'une race et un runner existent tous les deux
 * @param {number} raceId - ID de la race
 * @param {number} runnerId - ID du runner
 * @returns {Promise<{raceValid: boolean, runnerValid: boolean, errors: string[]}>}
 */
async function validateRaceAndRunner(raceId, runnerId) {
  const errors = [];
  let raceValid = false;
  let runnerValid = false;

  // Valider la race
  const raceValidation = await validateRaceExists(raceId);
  if (!raceValidation.exists) {
    errors.push(`Race ID ${raceId} invalide - Cette course n'existe pas`);
  } else {
    raceValid = true;
  }

  // Valider le runner
  const runnerValidation = await validateRunnerExists(runnerId);
  if (!runnerValidation.exists) {
    errors.push(`Runner ID ${runnerId} invalide - Ce coureur n'existe pas`);
  } else {
    runnerValid = true;
  }

  return {
    raceValid,
    runnerValid,
    errors
  };
}

module.exports = {
  validateRaceExists,
  validateRunnerExists,
  validateRaceAndRunner
};

