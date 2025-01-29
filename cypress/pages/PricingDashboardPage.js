class PricingDashboardPage {
  // URL for the app's pricing dashboard
  appUrl = 'https://app.pricelabs.co';

  // Helper method to wrap commands inside cy.origin()
  runInAppOrigin(callback) {
    cy.origin(this.appUrl, callback);
  }

  verifyPageLoaded() {
    this.runInAppOrigin(() => {
      // Check if the Pricing Dashboard is visible
      cy.contains('Pricing Dashboard').should('be.visible');
    });
  }

  toggleSyncPrice(listingName) {
    this.runInAppOrigin(({ listingName }) => {
      // Locate the listing row and toggle the Sync Price checkbox
      cy.contains(listingName).parent().find('.css-1niqckn').click();
    }, { listingName });
  }

  searchListing(listingName) {
    this.runInAppOrigin(({ listingName }) => {
      // Perform a search for the listing
      cy.get(#pd-search-listing).type(`${listingName}{enter}`);
    }, { listingName });
  }

  addColumn(columnName) {
    this.runInAppOrigin(({ columnName }) => {
      // Add a new column
      cy.contains('Add Column').click();
      cy.contains(columnName).click();
      cy.contains('Apply').click();
    }, { columnName });
  }
}

export default PricingDashboardPage;


