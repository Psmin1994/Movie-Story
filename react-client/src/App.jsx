import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Header from "components/layout/Header";
import Footer from "components/layout/Footer";
import MainPage from "pages/Home/MainPage";
import MoviePage from "pages/Movie/MoviePage";
import MovieListPage from "pages/List/MovieListPage";
import MovieSearchPage from "pages/List/MovieSearchPage";
import UserPage from "pages/User/UserPage";
import SupportPage from "pages/Support/SupportPage";
import BookPage from "pages/Book/BookPage";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 1104px;
  height: 100vh;
`;

const App = () => {
  return (
    <Container>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route index path="/" element={<MainPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/search" element={<MovieSearchPage />} />
          <Route path="/movie" element={<MovieListPage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/support" element={<SupportPage />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </Container>
  );
};

export default App;
