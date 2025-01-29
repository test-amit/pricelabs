class MultiCalendarPage {
    // URL for the Multicalendar page
    appUrl = 'https://app.pricelabs.co/multicalendar';
  
    // Helper method to wrap commands inside cy.origin()
    runInAppOrigin(callback, args = {}) {
      cy.origin(this.appUrl, callback, args);
    }
  
    verifyPageLoaded() {
      this.runInAppOrigin(() => {
        // Check if the Multicalendar page is visible
        cy.contains('Multicalendar').should('be.visible');
      });
    }
  
    selectDateRange(startDate, endDate) {
      this.runInAppOrigin(({ startDate, endDate }) => {
        cy.get('[data-testid="date-range-picker"]').click();
        cy.get(`[aria-label="${startDate}"]`).click();
        cy.get(`[aria-label="${endDate}"]`).click();
      }, { startDate, endDate });
    }
  
    toggleSyncPrice(listingName) {
      this.runInAppOrigin(({ listingName }) => {
        // Locate the listing row and toggle the Sync Price checkbox
        cy.contains(listingName).parent().find('[data-testid^="sync-price-toggle"]').click();
      }, { listingName });
    }
  
    updateBasePrice(listingName, price) {
      this.runInAppOrigin(({ listingName, price }) => {
        cy.contains(listingName)
          .parent()
          .find('[data-testid^="base-price-"]')
          .clear()
          .type(price);
      }, { listingName, price });
    }
  
    copyMinBaseMaxToChild() {
      this.runInAppOrigin(() => {
        cy.get('[data-testid="copy-base-prices"]').click();
      });
    }
  
    saveChanges() {
      this.runInAppOrigin(() => {
        cy.get('[data-testid="save-button"]').click();
      });
    }
  
    searchListing(listingName) {
      this.runInAppOrigin(({ listingName }) => {
        cy.get('#pd-search-listing').type(`${listingName}{enter}`);
      }, { listingName });
    }
  
    verifyUpdatedPrice(listingName, expectedPrice) {
      this.runInAppOrigin(({ listingName, expectedPrice }) => {
        cy.contains(listingName).parent().find('[data-testid^="base-price-"]').should('have.value', expectedPrice);
      }, { listingName, expectedPrice });
    }
  
    getErrorMessage() {
      return cy.get('.error-message');
    }
  }
  
  export default MultiCalendarPage;
  




