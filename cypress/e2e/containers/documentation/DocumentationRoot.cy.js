/// <reference types="cypress" />

describe('Documentation Root', () => {
  beforeEach(() => {
    cy.intercept('GET', '/platform-backend/v0/providers/transformations/legacy.json*', {
      fixture: 'legacy.json',
    }).as('LPB datastore');
  });

  it('Side nav is sticky on scroll', () => {
    cy.fixture('vaFormsMetaData.spec.json').then(json => {
      cy.intercept('/internal/docs/forms/metadata.json', json);
    });
    cy.fixture('vaFormsOpenAPI.spec.json').then(json => {
      cy.intercept('/internal/docs/forms/v0/openapi-sf.json', json);
    });
    cy.visit('/explore/api/forms/docs');
    // This is needed as a waitFor fails because Swagger UI
    // adds the DOM elements before showing them visually.
    cy.get('#operations-tag-Forms').should('be.visible');
    cy.get('.va-api-side-nav').then($el => {
      expect($el[0].offsetTop).to.equal(0);
    });
    cy.scrollTo('bottom');
    cy.get('.va-api-side-nav').then($el => {
      expect($el[0].offsetTop).to.be.greaterThan(0);
    });
  });
});
