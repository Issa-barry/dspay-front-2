describe('Vérification', () => {
  const visitPage = () => cy.visit('/auth/register-verification');

  const otp = (n: 1 | 2 | 3 | 4) => cy.get(`[data-cy="otp-${n}"] input`);
  const verifyBtn = () => cy.get('[data-cy="btn-verify"]');

  it('désactive le bouton si le code est incomplet', () => {
    visitPage();

    verifyBtn().should('be.disabled');

    otp(1).type('1');
    verifyBtn().should('be.disabled');

    otp(2).type('2');
    verifyBtn().should('be.disabled');

    otp(3).type('3');
    verifyBtn().should('be.disabled');
  });

  it('active le bouton quand 4 chiffres sont saisis', () => {
    visitPage();

    otp(1).type('1');
    otp(2).type('2');
    otp(3).type('3');
    otp(4).type('4');

    verifyBtn().should('not.be.disabled');
  });

  it('clique sur Vérifier quand le code est complet', () => {
    visitPage();

    otp(1).type('1');
    otp(2).type('2');
    otp(3).type('3');
    otp(4).type('4');

    verifyBtn().should('not.be.disabled').click();

    // Optionnel : si tu log "hello"
    cy.window().then((win) => {
      // rien à assert si tu ne fais que console.log
      // idéalement, déclenche une requête API ou affiche un message pour pouvoir tester
    });
  });
});
