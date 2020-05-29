describe('/add', () => {
  beforeEach(() => {
    cy.svcClientLogout()
    cy.svcClientLogin().as('tokens')
    cy.get('@tokens').then(cy.svcClientSetCookie)
  })

  it('Signs in', () => {
    cy.visit('https://web-range-myra-test.pathfinder.gov.bc.ca/home')
    cy.url().should('not.include', 'login')
  })
  it('Search for the agreement', () => {
    cy.get('form').within(() => {
      cy.get('input').type('RAN099915{enter}') // Only yield inputs within form
    })
  })
})
