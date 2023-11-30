/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { generateStarsInputs } from '../../../lib/functions';
import { useFilePreview } from '../../../lib/customHooks'; // Ensure this import is correct
import addFileIMG from '../../../images/add_file.png';
import styles from './BookForm.module.css';
import { updateBook, addBook } from '../../../lib/common';

function BookForm({ book, validate }) {
  const userRating = book ? book.ratings.find((elt) => elt.userId === localStorage.getItem('userId'))?.grade : 0;
  const [rating, setRating] = useState(0);

  const {
    register,
    watch,
    formState,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: useMemo(() => ({
      id: book?.id,
      title: book?.title,
      author: book?.author,
      year: book?.year,
      genre: book?.genre,
    }), [book]),
  });

  useEffect(() => {
    reset(book);
    setRating(userRating);
  }, [book, reset, userRating]);

  useEffect(() => {
    if (!book && formState.dirtyFields.rating) {
      const rate = document.querySelector('input[name="rating"]:checked').value;
      setRating(parseInt(rate, 10));
      formState.dirtyFields.rating = false;
    }
  }, [formState, book]);

  const onSubmit = async (data) => {
    console.log('ID avant soumission du formulaire :', data.id);

    // When we create a new book
    if (!book) {
      if (!data.file[0]) {
        alert('Vous devez ajouter une image');
        return;
      }

      const newBook = await addBook(data);
      if (!newBook.error) {
        // Passer les informations du livre à la fonction de validation
        validate(newBook);
      } else {
        alert(newBook.message);
      }
    } else {
      const updatedBook = await updateBook(data, data.id);
      if (!updatedBook.error) {
        // Passer les informations du livre à la fonction de validation
        validate(updatedBook);
      } else {
        alert(updatedBook.message);
      }
    }
  };

  const readOnlyStars = !!book;
  const file = watch(['file']);
  const [filePreview] = useFilePreview(file);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.Form}>
      <input type="hidden" id="id" {...register('id')} />
      <label htmlFor="title">
        <p>Titre du livre</p>
        <input type="text" id="title" {...register('title')} />
      </label>
      <label htmlFor="author">
        <p>Auteur</p>
        <input type="text" id="author" {...register('author')} />
      </label>
      <label htmlFor="year">
        <p>Année de publication</p>
        <input type="text" id="year" {...register('year')} />
      </label>
      <label htmlFor="genre">
        <p>Genre</p>
        <input type="text" id="genre" {...register('genre')} />
      </label>
      <label htmlFor="rate">
        <p>Note</p>
        <div className={styles.Stars}>
          {generateStarsInputs(rating, register, readOnlyStars)}
        </div>
      </label>
      <label htmlFor="file">
        <p>Visuel</p>
        <div className={styles.AddImage}>
          {filePreview || book?.imageUrl ? (
            <>
              <img src={filePreview ?? book?.imageUrl} alt="preview" />
              <p>Modifier</p>
            </>
          ) : (
            <>
              <img src={addFileIMG} alt="Add file" />
              <p>Ajouter une image</p>
            </>
          )}
        </div>
        <input {...register('file')} type="file" id="file" name="file" />
      </label>
      <button type="submit">Publier</button>
    </form>
  );
}

BookForm.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    year: PropTypes.number,
    genre: PropTypes.string,
    imageUrl: PropTypes.string,
    ratings: PropTypes.arrayOf(PropTypes.shape({
      userId: PropTypes.string,
      grade: PropTypes.number,
    })),
  }),
  validate: PropTypes.func,
};

BookForm.defaultProps = {
  book: null,
  validate: null,
};

export default BookForm;
