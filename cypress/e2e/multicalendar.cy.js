import LoginPage from '../pages/LoginPage';
import MultiCalendarPage from '../pages/MultiCalendarPage';

const loginPage = new LoginPage();
const multiCalendar = new MultiCalendarPage();

describe('Multicalendar DSO Feature Tests', () => {
  beforeEach(() => {
    // Login to the application
    loginPage.login(Cypress.env('username'), Cypress.env('password'));
    cy.visit('https://app.pricelabs.co/multicalendar'); 
    Cypress.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('Minified React error')) {
        return false; // Ignore React errors and continue tests
      }
    });
    
  });

  // ✅ Fixed: Key Functional Test Cases
  it('should select a date range', () => {
    cy.origin(multiCalendar.appUrl, { args: { startDate: 'Jan 28, 2025', endDate: 'Apr 28, 2025' } }, 
      ({ startDate, endDate }) => {
        cy.get('[qa-id="date-picker-calendar-start"]',{ timeout: 10000 }).click();
        cy.get(`[aria-label="${startDate}"]`).click();
        cy.get(`[aria-label="${endDate}"]`).click();
    });
  });

  it('should toggle sync price for a listing', () => {
    cy.origin(multiCalendar.appUrl, { args: { listingName: 'Sunset Watcher' } }, 
      ({ listingName }) => {
        cy.contains(listingName).parent().find('[data-testid^="sync-price-toggle"]').click();
        cy.get('.chakra-toast', { timeout: 5000 }).should('exist');
        cy.contains('Your prices are scheduled to be updated overnight.').should('be.visible');
    });
  });

  it('should update base price for a listing', () => {
    cy.origin(multiCalendar.appUrl, { args: { listingName: 'Ocean Bliss', price: '250' } }, 
      ({ listingName, price }) => {
        cy.contains(listingName).parent().find('[data-testid^="base-price-"]').clear().type(price);
        cy.contains(listingName).parent().find('[data-testid^="base-price-"]').should('have.value', price);
    });
  });

  it('should copy Min/Base/Max prices to child listings', () => {
    cy.origin(multiCalendar.appUrl, () => {
      cy.get('[data-testid="copy-base-prices"]').click();
    });
  });

  it('should save changes successfully', () => {
    cy.origin(multiCalendar.appUrl, () => {
      cy.get('[data-testid="save-button"]').click();
      cy.contains('Changes saved successfully').should('be.visible');
    });
  });

  // 🔁 Fixed: End-to-End (E2E) Test Cases
  it('should update base price and save changes', () => {
    cy.origin(multiCalendar.appUrl, { args: { listingName: 'Ocean Bliss', price: '300' } }, 
      ({ listingName, price }) => {
        cy.contains(listingName).parent().find('[data-testid^="base-price-"]').clear().type(price);
        cy.get('[data-testid="save-button"]').click();
        cy.contains(listingName).parent().find('[data-testid^="base-price-"]').should('have.value', price);
    });
  });

  it('should copy Min/Base/Max values and verify updates', () => {
    cy.origin(multiCalendar.appUrl, () => {
      cy.get('[data-testid="copy-base-prices"]').click();
      cy.get('[data-testid="save-button"]').click();
      cy.contains('Changes applied to child listings').should('be.visible');
    });
  });

  it('should search for a listing and toggle sync price', () => {
    cy.origin(multiCalendar.appUrl, { args: { listingName: 'Sunset Watcher' } }, 
      ({ listingName }) => {
        cy.get('input[placeholder="Search listings"]').type(`${listingName}{enter}`);
        cy.contains(listingName).parent().find('[type="checkbox"]').click();
        cy.contains(listingName).parent().find('[type="checkbox"]').should('be.checked');
    });
  });

  // ❌ Fixed: Negative Test Cases
  it('should not allow setting base price as negative value', () => {
    cy.origin(multiCalendar.appUrl, { args: { listingName: 'Ocean Bliss', price: '-100' } }, 
      ({ listingName, price }) => {
        cy.contains(listingName).parent().find('[data-testid^="base-price-"]').clear().type(price);
        cy.get('[data-testid="save-button"]').click();
        cy.get('.error-message').should('contain', 'Invalid price value');
    });
  });

  it('should show no results for an invalid search', () => {
    cy.origin(multiCalendar.appUrl, { args: { listingName: 'InvalidListing' } }, 
      ({ listingName }) => {
        cy.get('#pd-search-listing').type(`${listingName}{enter}`);
        cy.contains('No Listings To Show').should('be.visible');
    });
  });

  it('should disable Next button on the last page', () => {
    cy.origin(multiCalendar.appUrl, { args: { lastPageBtn: 'button[aria-label="last-page"]', nextPageBtn: 'button[aria-label="next-page"]' } }, 
      ({ lastPageBtn, nextPageBtn }) => {
        cy.get(lastPageBtn).click();
        cy.get(nextPageBtn).should('be.disabled');
    });
  });

});





