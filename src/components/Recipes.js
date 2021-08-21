import React, { useState, useEffect } from "react";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(``);

  useEffect(async () => {
    const response = await fetch("/api/recipes");

    if (response.ok) {
      const responseRecipes = await response.json();
      setRecipes(responseRecipes.recipes);
      setErrorMessage(``)
    } else {
      setErrorMessage(`Failed to fetch recipes!`);
    }
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
