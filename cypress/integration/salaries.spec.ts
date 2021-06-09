import mock from "../../salary/mocks/default.json";

describe("Salaries", () => {
  it("deberia mostrar todos los salarios", () => {
    cy.visit("/default");

    cy.get('[data-testid="salary"]').should("have.length", mock.length);
  });

  it("muestra un mensaje cuando no hay salarios", () => {
    cy.visit("/empty");

    cy.get('[data-testid="salary"]').should("have.length", 0);

    cy.contains("No hay salarios");
  });
});
