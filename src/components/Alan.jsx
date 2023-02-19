import React, { useEffect, useContext } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  selectGenreOrCategory,
  searchMovie,
} from "../features/currentGenreOrCategory";
import { ColorModeContext } from "../utils/ToggleColorMode";
import { fetchToken } from "../utils";

const useAlan = () => {
  const { setMode } = useContext(ColorModeContext);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    alanBtn({
      key: "d728a5266a0729bfec1271945c2b31692e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: ({ command, mode, genres, genreOrCategory, query }) => {
        if (command === "chooseGenre") {
          const foundGenre = genres.find(
            (genre) =>
              genre.name.toLowerCase() === genreOrCategory.toLowerCase()
          );
          if (foundGenre) {
            history.push("/");
            dispatch(selectGenreOrCategory(foundGenre.id));
          } else {
            // top rated, upcoming, popular
            const category = genreOrCategory.startsWith("top")
              ? "top_rated"
              : genreOrCategory;
            history.push("/");
            dispatch(selectGenreOrCategory(category));
          }
        } else if (command === "changeMode") {
          if (mode === "light") {
            setMode("light");
          } else {
            setMode("dark");
          }
        } else if (command === "login") {
          fetchToken();
        } else if (command === "logout") {
          localStorage.clear();
          history.push("/");
        } else if (command === "search") {
            dispatch(searchMovie(query))
        }
      },
    });
  }, []);
};

export default useAlan;
