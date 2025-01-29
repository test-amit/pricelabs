import LoginPage from '../pages/LoginPage';

const loginPage = new LoginPage();

describe('Pricing Dashboard Tests', () => {
  beforeEach(() => {
    // Login to the application
    loginPage.login(Cypress.env('username'), Cypress.env('password'));
    Cypress.on('uncaught:exception', (err, runnable) => {
      // Prevent Cypress from failing the test due to uncaught exceptions
      return false;
    });
    
  });

  // Key Functional Test Cases
  it('should toggle sync price for a listing', () => {
    cy.origin('https://app.pricelabs.co', { args: { listingName: 'Nelson-2007', toggleSelector: '#mc-sync-toggle-5dcb9fddb61b8e001f3d1b6b' } }, ({ listingName, toggleSelector }) => {
      // Locate the listing and find the toggle element
      cy.contains(listingName)
        .parent()
        .get(toggleSelector, { timeout: 10000 })
        .scrollIntoView() 
        .as('syncPriceToggle') // Alias for reusability
        .click();
        // Check the current state of the toggle
        cy.get('.chakra-toast', { timeout: 5000 }).should('exist');
        cy.get('.chakra-text.css-hbdr6j')
       .should('be.visible')
       .and('contain.text', 'Your prices are scheduled to be updated overnight.');
    });
  });
  

  it('should search for a listing by name', () => {
    cy.origin('https://app.pricelabs.co', { args: { listingName: 'Nelson-2007' } }, ({ listingName }) => {
      // Perform a search for the listing
      cy.get('#pd-search-listing').type(`${listingName}{enter}`);
      cy.contains(listingName).should('be.visible');
    });
  });

  it('should add the "Base Price" column and verify its presence on UI', () => {
    cy.origin('https://app.pricelabs.co', { args: { columnId: '#mc-syncPricesAndLastSynced-checkbox', columnName: 'Sync Price' } }, ({ columnId, columnName }) => {
      // Open the "Add Column" dropdown
      cy.contains('Add Column', { timeout: 10000 }).click();
  
      // Ensure the checkbox is checked to add the column
      cy.get(columnId)
        .as('checkbox')
        .then(($checkbox) => {
          if (!$checkbox.is(':checked')) {
            cy.get('@checkbox').click();
          }
        });
  
      // Scroll to the table and ensure the column is visible
      cy.get('table').scrollIntoView(); // Ensure the table is in view
      cy.get('table').contains('th', columnName).should('be.visible');
    });
  });
  
  // End-to-End Test Cases
  it.only('should create a dummy listing and handle max limit exceeded validation', () => {
  cy.origin('https://app.pricelabs.co', { 
    args: { 
      listingName: 'Ajit Kumar Nayak',
      streetAddress: 'Btm 2nd Stage',
      city: 'Bangalore',
      zip: '560076',
      country: 'United States',
      basePrice: '111',
      bedroomCount: 'Studio',
      currency: 'USD',
      createButtonSelector: '#menu-button-:rj:'
    } 
  }, ({
    listingName, streetAddress, city, zip, country, basePrice, bedroomCount, currency, createButtonSelector
  }) => {

    // ✅ Click on the button to open the create listing modal
    cy.get('createButtonSelector').click();

    // ✅ Click to create dummy listing
    cy.contains('Create Dummy Listing').click();

    // ✅ Fill in listing details dynamically
    cy.get('input[name="listingName"]').type(listingName);
    cy.get('input[name="streetAddress"]').type(streetAddress);
    cy.get('input[name="city"]').type(city);
    cy.get('input[name="zip"]').type(zip);
    cy.get('input[name="country"]').type(country);
    cy.get('input[name="basePrice"]').type(basePrice);
    cy.get('select[name="bedroomCount"]').select(bedroomCount);
    cy.get('select[name="currency"]').select(currency);

    // ✅ Click Continue
    cy.contains('Continue').click();

    // ✅ Proceed with creation
    cy.contains('Create').click();

    // ✅ Validate the max limit exceeded message
    cy.contains('You have reached the limit of creating Dummy listings').should('be.visible');
  });
});


  it('should search for a listing and toggle sync price', () => {
    cy.origin('https://app.pricelabs.co', { args: { listingName: 'Nelson-2007' } }, ({ listingName }) => {
      // Search and toggle sync price
      cy.get('input[placeholder="Search listings"]').type(`${listingName}{enter}`);
      cy.contains(listingName).parent().find('[type="checkbox"]').click();
      cy.contains(listingName).parent().find('[type="checkbox"]').should('be.checked');
    });
  });

  // Negative Test Cases
  it('should show no results for an invalid search', () => {
    cy.origin('https://app.pricelabs.co', { args: { listingName: 'InvalidListing' } }, ({ listingName }) => {
      // Perform a search for an invalid listing
      cy.get('#pd-search-listing').type(`${listingName}{enter}`);
      cy.contains('No Listings To Show').should('be.visible');
    });
  });

  it('should disable Next button on the last page', () => {
    cy.origin('https://app.pricelabs.co', { 
      args: { 
        lastPageBtn: 'button[aria-label="last-page"]', 
        nextPageBtn: 'button[aria-label="next-page"]', 
      } 
    }, ({ lastPageBtn, nextPageBtn }) => {
      // Click on the last page button
      cy.get(lastPageBtn).click();
  
      // Verify that the Next button is disabled
      cy.get(nextPageBtn).should('be.disabled');
        });
  });
});


