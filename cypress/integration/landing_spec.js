/* eslint jest/expect-expect: 0 */

describe('Landing Page', () => {
    it('successfully loads', () => {
        cy.visit('/')
    })
})
