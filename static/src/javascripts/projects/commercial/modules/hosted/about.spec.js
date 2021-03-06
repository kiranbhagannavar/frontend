// @flow
import { init } from 'commercial/modules/hosted/about';

describe('Hosted About Popup', () => {
    beforeEach(() => {
        if (document.body) {
            document.body.innerHTML = '<div class="js-hosted-about"></div>';
        }
    });

    afterEach(() => {
        if (document.body) {
            document.body.innerHTML = '';
        }
        const overlay: any = document.querySelector('.js-survey-overlay');
        if (overlay) overlay.parentNode.removeChild(overlay);
    });

    it('should exist', () => {
        expect(init).toBeDefined();
    });

    it('should hide popup after initialization', done => {
        init()
            .then(() => {
                expect(
                    (document.querySelector(
                        '.js-survey-overlay'
                    ): any).classList.toString()
                ).toEqual(expect.stringContaining('u-h'));
            })
            .then(done)
            .catch(done.fail);
    });

    it('should show popup after clicking on the button', done => {
        init()
            .then(() => {
                (document.querySelector('.js-hosted-about'): any).click();
                expect(
                    (document.querySelector(
                        '.js-survey-overlay'
                    ): any).classList.toString()
                ).not.toEqual(expect.stringContaining('u-h'));
            })
            .then(done)
            .catch(done.fail);
    });
});
