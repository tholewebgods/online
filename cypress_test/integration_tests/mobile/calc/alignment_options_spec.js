/* global describe it cy beforeEach require afterEach expect*/

var helper = require('../../common/helper');
var calcHelper = require('../../common/calc_helper');
var mobileHelper = require('../../common/mobile_helper');
var calcMobileHelper = require('./calc_mobile_helper');

require('cypress-wait-until');

describe('Change alignment settings.', function() {
	var testFileName = 'alignment_options.ods';

	beforeEach(function() {
		helper.beforeAll(testFileName, 'calc');

		// Click on edit button
		mobileHelper.enableEditingMobile();
	});

	afterEach(function() {
		helper.afterAll(testFileName);
	});

	function getTextPosForFirstCell() {
		calcHelper.dblClickOnFirstCell();

		// Select text content
		helper.typeIntoDocument('{ctrl}a');

		helper.initAliasToNegative('currentTextPos');

		cy.get('.leaflet-selection-marker-end')
			.invoke('offset')
			.its('left')
			.as('currentTextPos');

		cy.get('@currentTextPos')
			.should('be.greaterThan', 0);

		calcHelper.removeTextSelection();
	}

	function openAlignmentPaneForFirstCell() {
		calcHelper.clickOnFirstCell();

		mobileHelper.openMobileWizard();

		helper.clickOnIdle('#ScAlignmentPropertyPanel');

		cy.get('#AlignLeft')
			.should('be.visible');
	}

	it('Apply left/right alignment', function() {
		openAlignmentPaneForFirstCell();

		// Set right aligment first
		helper.clickOnIdle('#AlignRight');

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td')
			.should('have.attr', 'align', 'right');

		// Change alignment back
		calcHelper.clickOnFirstCell();

		mobileHelper.openMobileWizard();

		helper.clickOnIdle('#ScAlignmentPropertyPanel');

		helper.clickOnIdle('#AlignLeft');

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td')
			.should('have.attr', 'align', 'left');
	});

	it('Align to center horizontally.', function() {
		openAlignmentPaneForFirstCell();

		helper.clickOnIdle('#AlignHorizontalCenter');

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td')
			.should('have.attr', 'align', 'center');
	});

	it('Change to block alignment.', function() {
		openAlignmentPaneForFirstCell();

		helper.clickOnIdle('#AlignBlock');

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td')
			.should('have.attr', 'align', 'justify');
	});

	it('Right-to-left and left-to-right writing mode.', function() {
		openAlignmentPaneForFirstCell();

		helper.clickOnIdle('#ParaRightToLeft');

		// TODO: we don't have a way of testing this
		// copy container doesn't have info about this
		cy.wait(500);

		helper.clickOnIdle('#ParaLeftToRight');

		cy.wait(500);
	});

	it('Align to the top and to bottom.', function() {
		openAlignmentPaneForFirstCell();

		helper.clickOnIdle('#AlignTop');

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td')
			.should('have.attr', 'valign', 'top');

		// Change alignment back
		calcHelper.clickOnFirstCell();

		mobileHelper.openMobileWizard();

		helper.clickOnIdle('#ScAlignmentPropertyPanel');

		helper.clickOnIdle('#AlignBottom');

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td')
			.should('have.attr', 'valign', 'bottom');
	});

	it('Align to center vertically.', function() {
		openAlignmentPaneForFirstCell();

		helper.clickOnIdle('#AlignVCenter');

		calcHelper.selectAllMobile();

		cy.get('#copy-paste-container table td')
			.should('have.attr', 'valign', 'middle');
	});

	it('Increment / decrement text indent.', function() {
		helper.initAliasToNegative('originalTextPos');

		// Get text position first
		getTextPosForFirstCell();
		cy.get('@currentTextPos')
			.as('originalTextPos');

		cy.get('@originalTextPos')
			.should('be.greaterThan', 0);

		openAlignmentPaneForFirstCell();

		// Increase indent
		helper.clickOnIdle('#IncrementIndent');

		// We use the text position as indicator
		cy.get('body')
			.should(function() {
				getTextPosForFirstCell();

				cy.get('@currentTextPos')
					.then(function(currentTextPos) {
						cy.get('@originalTextPos')
							.then(function(originalTextPos) {
								expect(originalTextPos).to.be.lessThan(currentTextPos);
							});
					});
			});

		helper.initAliasToNegative('originalTextPos');

		cy.get('@currentTextPos')
			.as('originalTextPos');

		cy.get('@currentTextPos')
			.should('be.greaterThan', 0);

		// Decrease indent
		openAlignmentPaneForFirstCell();

		helper.clickOnIdle('#DecrementIndent');

		// We use the text position as indicator
		cy.get('body')
			.should(function() {
				getTextPosForFirstCell();

				cy.get('@currentTextPos')
					.then(function(currentTextPos) {
						cy.get('@originalTextPos')
							.then(function(originalTextPos) {
								expect(originalTextPos).to.be.greaterThan(currentTextPos);
							});
					});
			});
	});

	it.skip('Change text indent via input field.', function() {
		// TODO: this fails, because the input field always becomes disabled.
		helper.initAliasToNegative('originalTextPos');

		getTextPosForFirstCell();
		cy.get('@currentTextPos')
			.as('originalTextPos');

		cy.get('@currentTextPos')
			.should('be.greaterThan', 0);

		openAlignmentPaneForFirstCell();

		// TODO: First we need to increase indent to make the input enabled
		helper.clickOnIdle('#IncrementIndent');

		cy.wait(300);

		helper.clickOnIdle('#IncrementIndent');

		calcHelper.removeTextSelection();

		openAlignmentPaneForFirstCell();

		cy.get('#leftindent .spinfield')
			.should('not.have.attr', 'disabled');

		// Increase indent
		cy.get('#leftindent .spinfield')
			.clear()
			.type('20{enter}');

		// We use the text position as indicator
		cy.get('body')
			.should(function() {
				getTextPosForFirstCell();

				cy.get('@currentTextPos')
					.then(function(currentTextPos) {
						cy.get('@originalTextPos')
							.then(function(originalTextPos) {
								expect(originalTextPos).to.be.lessThan(currentTextPos);
							});
					});
			});
	});

	it('Enable text wrapping.', function() {
		helper.initAliasToNegative('originalTextPos');

		getTextPosForFirstCell();
		cy.get('@currentTextPos')
			.as('originalTextPos');

		cy.get('@currentTextPos')
			.should('be.greaterThan', 0);

		openAlignmentPaneForFirstCell();

		cy.get('input#wraptext')
			.should('not.have.prop', 'checked', true);

		helper.clickOnIdle('input#wraptext');

		cy.get('input#wraptext')
			.should('have.prop', 'checked', true);

		// We use the text position as indicator
		cy.waitUntil(function() {
			getTextPosForFirstCell();

			return cy.get('@currentTextPos')
				.then(function(currentTextPos) {
					return cy.get('@originalTextPos')
						.then(function(originalTextPos) {
							return originalTextPos > currentTextPos;
						});
				});
		});
	});

	it('Apply stacked option.', function() {
		openAlignmentPaneForFirstCell();

		cy.get('input#stacked')
			.should('not.have.prop', 'checked', true);

		helper.clickOnIdle('input#stacked');

		cy.get('input#stacked')
			.should('have.prop', 'checked', true);

		cy.wait(500);

		// TODO: we don't have a good indicator here
		// neither the text position nor the clipboard container helps here.
	});

	it('Merge cells.', function() {
		// Select the full row
		calcMobileHelper.selectFirstRow();

		// Despite the selection is there, merge cells needs more time here.
		cy.wait(1000);

		mobileHelper.openMobileWizard();

		helper.clickOnIdle('#ScAlignmentPropertyPanel');

		cy.get('#AlignLeft')
			.should('be.visible');

		cy.get('input#mergecells')
			.should('not.have.attr', 'disabled');

		// Click merge cells
		cy.get('input#mergecells')
			.should('not.have.prop', 'checked', true);

		helper.clickOnIdle('input#mergecells');

		cy.get('input#mergecells')
			.should('have.prop', 'checked', true);

		// Check content
		calcHelper.selectAllMobile(false);

		cy.get('#copy-paste-container table td')
			.should('have.attr', 'colspan', '1024');
	});
});
