import { screen, render } from "@testing-library/react";
import Recipes from "./Recipes";

import { setupServer } from "msw/node";
import { rest } from "msw";

const recipes = [
  { id: 1, title: `Burger` },
  { id: 2, title: `French Toast` },
  { id: 3, title: `Salmon` },
];

const server = setupServer(
  rest.get("/api/recipes", (req, res, ctx) => {
    return res(ctx.json({ recipes }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers()); // prevents leaking of data from one test into another
afterAll(() => server.close());

/* HAPPY PATH TESTS */
test("should render the heading, form elements, recipe list", async () => {
  //   render test component
  render(<Recipes />);

  //   test header content
  const headingElement = screen.getByRole("heading");
  expect(headingElement).toHaveTextContent("Recipe Finder");

  //   test placeholder
  const placeHolderText = screen.getByPlaceholderText(
    "Enter an ingredient to find recipes..."
  );
  expect(placeHolderText).toBeInTheDocument();

  //   test button
  const buttonElement = screen.getByRole("button");
  expect(buttonElement).toHaveTextContent("Find");

  //   test api
  const listItems = await screen.findAllByRole("listitem");
  expect(listItems).toHaveLength(3);
  expect(listItems[0]).toHaveTextContent(`Burger`);
  expect(listItems[1]).toHaveTextContent(`French Toast`);
  expect(listItems[2]).toHaveTextContent(`Salmon`);
});

/* ERROR HANDLING TESTS */
test("should display error message when recipe API call is unsuccessful", async () => {
  // mock server error
  server.use(
    rest.get("/api/recipes", (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({ message: "Internal Server Error" })
      );
    })
  );

  // render test component
  render(<Recipes />);

  // test for error message
  const errorText = await screen.findByText("Failed to fetch recipes!");
  expect(errorText).toBeInTheDocument();

  // test no list items rendered
  const listItem = screen.queryByRole("listitem");
  expect(listItem).not.toBeInTheDocument();
});
