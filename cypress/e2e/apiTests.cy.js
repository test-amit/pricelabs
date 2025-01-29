describe('Simple API Tests - Pricing Dashboard', () => {
  
    const baseUrl = 'https://app.pricelabs.co/api'; // API base URL
  
    beforeEach(() => {
      cy.session('userSession', () => {
        cy.origin('https://app.pricelabs.co', { args: { baseUrl } }, ({ baseUrl }) => {
          cy.visit('/pricing'); // Ensure login page
          cy.get('#user_email').type(Cypress.env('username'));
          cy.get('#password-field').type(Cypress.env('password'));
          cy.get('[type="submit"]').click();
  
          // ✅ Store Auth Token
          cy.getCookie('auth_token').should('exist').then((cookie) => {
            Cypress.env('authToken', cookie.value);
          });
  
          // ✅ Verify Dashboard is Loaded
          cy.url().should('include', '/pricing');
        });
      });
    });
  
    // ✅ Test 1: Fetch PMS List
    it('should fetch PMS list successfully', () => {
      cy.origin('https://app.pricelabs.co', { args: { baseUrl } }, ({ baseUrl }) => {
        cy.request('GET', `${baseUrl}/pms_list`)
          .then((response) => {
            // ✅ Check HTTP Status Code
            expect(response.status).to.eq(200);
  
            // ✅ Ensure Response is an Array
            expect(response.body).to.be.an('array');
  
            // ✅ Validate Response Contains Expected Data
            if (response.body.length > 0) {
              expect(response.body[0]).to.have.property('id');  
              expect(response.body[0]).to.have.property('name'); 
            }
          });
      });
    });
  
    // ✅ Test 2: Fetch User Preferences
    it('should fetch user preferences successfully', () => {
      cy.origin('https://app.pricelabs.co', { args: { baseUrl } }, ({ baseUrl }) => {
        cy.request('GET', `${baseUrl}/get_user_preferences`)
          .then((response) => {
            // ✅ Check HTTP Status Code
            expect(response.status).to.eq(200);
  
            // ✅ Validate Response Format
            expect(response.body).to.have.property('preferences');
          });
      });
    });
  
    // ✅ Test 3: Fetch Children Listings (Valid Parent ID)
    it('should fetch children listings for a valid parent ID', () => {
      const parentId = '123456'; // Replace with a valid Parent ID
  
      cy.origin('https://app.pricelabs.co', { args: { baseUrl, parentId } }, ({ baseUrl, parentId }) => {
        cy.request('GET', `${baseUrl}/fetch_children?parent_key=${parentId}`)
          .then((response) => {
            // ✅ Check HTTP Status Code
            expect(response.status).to.eq(200);
  
            // ✅ Validate Response Contains Children Data
            expect(response.body).to.have.property('children');
            expect(response.body.children).to.be.an('array');
          });
      });
    });
  
    // ❌ Negative Test Case: Invalid Parent ID
    it('should return an error for an invalid parent ID', () => {
      cy.origin('https://app.pricelabs.co', { args: { baseUrl } }, ({ baseUrl }) => {
        cy.request({
          method: 'GET',
          url: `${baseUrl}/fetch_children?parent_key=invalid-id`,
          failOnStatusCode: false // Prevent Cypress from failing the test on expected error
        }).then((response) => {
          // ✅ Validate HTTP Status Code for Error
          expect(response.status).to.eq(404);
        });
      });
    });
  
  });
  
  


