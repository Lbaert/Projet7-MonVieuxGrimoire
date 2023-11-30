import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AddBook.module.css';
import BookForm from '../../components/Books/BookForm/BookForm';
import BackArrow from '../../components/BackArrow/BackArrow';
import { useUser } from '../../lib/customHooks';
import { APP_ROUTES } from '../../utils/constants';
import bookAdd from '../../images/book_add.jpg';

function AddBook() {
  const navigate = useNavigate();
  const { connectedUser, auth, userLoading } = useUser();
  const [created, setCreated] = useState(false);
  const [addedBookInfo, setAddedBookInfo] = useState(null);

  useEffect(() => {
    if (!userLoading) {
      if (!connectedUser || !auth) {
        navigate(APP_ROUTES.SIGN_IN);
      }
    }
  }, [userLoading]);

  useEffect(() => {
    if (created && addedBookInfo) {
      // Ajouter le console.log ici pour afficher les informations du livre
      console.log('Informations du livre ajouté :', addedBookInfo);
    }
  }, [created, addedBookInfo]);

  return (
    <div className="content-container">
      <BackArrow />
      <div className={styles.Container}>
        {!created ? (
          <>
            <h1>Ajouter un livre</h1>
            <p>Tous les champs sont obligatoires</p>
            {/* Passer une fonction pour mettre à jour addedBookInfo lors de l'ajout du livre */}
            <BookForm
              validate={(bookInfo) => {
                setAddedBookInfo(bookInfo);
                setCreated(true);
              }}
            />
          </>
        ) : (
          <div className={styles.Created}>
            <h1>Merci!</h1>
            <p>Votre livre a bien été publié</p>
            <img src={bookAdd} alt="Livre ajouté" />
            <Link to="/" className="button">
              Retour à l&apos;accueil
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddBook;
