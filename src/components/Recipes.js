import React, { useState, useEffect } from "react";
import axios from "axios";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(``);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("/api/recipes");
        setRecipes(response.data.recipes);
      } catch (error) {
        setErrorMessage(`Failed to fetch recipes!`);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <>
      <h1>Recipe Finder</h1>
      <form>
        <input
          type="text"
          placeholder="Enter an ingredient to find recipes..."
        />
        <button type="submit">Find</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>{recipe.title}</li>
        ))}
      </ul>
    </>
  );
}

export default Recipes;
