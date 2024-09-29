import { fireEvent, render, screen } from "@testing-library/react";

import Drawer from "../Drawer";
import React from "react";

describe("Drawer Component", () => {
  beforeEach(() => {
    render(<Drawer />);
  });

  test("renders the toolbar with buttons", () => {
    expect(screen.getByRole("button", { name: /pencil/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /eraser/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add text box/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  test("adds a text box when 'Add Text Box' is clicked", () => {
    const addTextBoxButton = screen.getByRole("button", {
      name: /add text box/i,
    });

    fireEvent.click(addTextBoxButton);

    expect(screen.getByDisplayValue("Your text here")).toBeInTheDocument();
  });

  test("updates the text in the text box", () => {
    fireEvent.click(screen.getByRole("button", { name: /add text box/i }));

    const textBox = screen.getByDisplayValue("Your text here");
    fireEvent.change(textBox, { target: { value: "New text" } });

    expect(screen.getByDisplayValue("New text")).toBeInTheDocument();
  });

  test("clears the canvas and removes text boxes when 'Clear' is clicked", () => {
    fireEvent.click(screen.getByRole("button", { name: /add text box/i }));

    const clearButton = screen.getByRole("button", { name: /clear/i });
    fireEvent.click(clearButton);

    expect(
      screen.queryByDisplayValue("Your text here")
    ).not.toBeInTheDocument();
  });

  test("changes tool to pencil and eraser", () => {
    const pencilButton = screen.getByRole("button", { name: /pencil/i });
    const eraserButton = screen.getByRole("button", { name: /eraser/i });

    fireEvent.click(pencilButton);
    expect(eraserButton).toBeInTheDocument();
    fireEvent.click(eraserButton);
    expect(pencilButton).toBeInTheDocument();
  });
});
