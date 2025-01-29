class LoginPage {
  navigate() {
    cy.visit(Cypress.env('baseUrl') + '/signin'); // Navigate to the login page
  }

  enterUsername(username) {
    cy.get('#user_email').type(username); // Enter username
  }

  enterPassword(password) {
    cy.get('#password-field').type(password); // Enter password
  }

  clickLogin() {
    cy.get('[type="submit"]').click(); // Click the login button
  }

  login(username, password) {
    this.navigate(); // Navigate to the login page
    this.enterUsername(username); // Enter username
    this.enterPassword(password); // Enter password
    this.clickLogin(); // Submit the login form

    // Verify navigation to the Pricing Dashboard
    cy.origin('https://app.pricelabs.co', { args: { expectedUrl: '/pricing' } }, ({ expectedUrl }) => {
      cy.url().should('include', expectedUrl); // Verify redirection
    });
  }
}

export default LoginPage;





  