import React, { useState } from "react";
import axios from "axios";
import * as PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { API_ROUTES, APP_ROUTES } from "../../utils/constants";
import { useUser } from "../../lib/customHooks";
import { storeInLocalStorage } from "../../lib/common";
import { ReactComponent as Logo } from "../../images/Logo.svg";
import styles from "./SignIn.module.css";

function SignIn({ setUser }) {
  const navigate = useNavigate();
  const { user, authenticated } = useUser();

  // Si l'utilisateur est déjà connecté, redirigez-le vers le tableau de bord
  if (user || authenticated) {
    navigate(APP_ROUTES.DASHBOARD);
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    error: false,
    message: "",
  });

  // Fonction pour gérer les erreurs
  const handleErrors = (error) => {
    console.log("Erreur complète:", error);

    let errorMessage = "Une erreur s'est produite.";

    if (error.response) {
      const responseData = error.response.data;

      // Si la réponse a un corps (contenant un message d'erreur), utilisez ce message
      if (responseData && responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData && responseData.error) {
        // Si la réponse a un champ 'error', utilisez ce message
        errorMessage = responseData.error;
      }

      // Si la réponse a un code d'état, utilisez ce code pour déterminer le message d'erreur
      switch (error.response.status) {
        case 400:
          errorMessage = "Requête incorrecte. Veuillez vérifier vos données.";
          break;
        case 401:
          errorMessage = "Non autorisé. Veuillez vous connecter.";
          break;
        case 403:
          errorMessage =
            "Accès interdit. Vous n'avez pas les autorisations nécessaires.";
          break;
        case 404:
          errorMessage = "Ressource non trouvée.";
          break;
        default:
          errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
      }
    }

    setNotification({ error: true, message: errorMessage });
  };

  // Fonction pour se connecter
  const signIn = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(API_ROUTES.SIGN_IN, {
        email,
        password,
      });
      console.log("Réponse du backend:", response);
      if (!response?.data?.success) {
        handleErrors(response);
      } else {
        storeInLocalStorage(response.data.token, response.data.userId);
        setUser(response.data);
        navigate("/");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      handleErrors(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour s'inscrire
  const signUp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(API_ROUTES.SIGN_UP, {
        email,
        password,
      });

      if (!response?.data?.success) {
        handleErrors(response);
      } else {
        setNotification({
          error: false,
          message: "Votre compte a bien été créé, vous pouvez vous connecter",
        });
      }
    } catch (err) {
      console.error(err);
      handleErrors(err);
    } finally {
      setIsLoading(false);
    }
  };

  const errorClass = notification.error ? styles.Error : null;

  return (
    <div className={`${styles.SignIn} container`}>
      <Logo />
      <div className={`${styles.Notification} ${errorClass}`}>
        {notification.message.length > 0 && <p>{notification.message}</p>}
      </div>
      <div className={styles.Form}>
        <label htmlFor={email}>
          <p>Adresse email</p>
          <input
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="password">
          <p>Mot de passe</p>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className={styles.Submit}>
          <button
            type="button"
            onClick={signIn}
            className={`${styles.Button} ${isLoading ? styles.Loading : ""}`}
          >
            {isLoading ? <div className={styles.Spinner} /> : null}
            <span>Se connecter</span>
          </button>
          <span>OU</span>
          <button type="button" onClick={signUp} className={styles.Button}>
            {isLoading ? <div className={styles.Spinner} /> : null}
            <span>S'inscrire</span>
          </button>
        </div>
      </div>
    </div>
  );
}

SignIn.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default SignIn;