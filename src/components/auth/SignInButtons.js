import React, { Component, Fragment } from 'react';
import { Button } from 'semantic-ui-react';
import { ELEMENT_ID } from '../../constants/variables';
import { SSO_LOGIN_ENDPOINT, SSO_IDIR_LOGIN_ENDPOINT, SSO_BCEID_LOGIN_ENDPOINT } from '../../constants/api';

class SignInButtons extends Component {
  openNewTab = link => window.open(link, '_blank')
  onSigninBtnClick = () => this.openNewTab(SSO_LOGIN_ENDPOINT)
  onIdirSigninBtnClick = () => this.openNewTab(SSO_IDIR_LOGIN_ENDPOINT)
  onBceidSigninBtnClick = () => this.openNewTab(SSO_BCEID_LOGIN_ENDPOINT)

  render() {
    return (
      <Fragment>
        <Button
          id={ELEMENT_ID.LOGIN_BCEID_BUTTON}
          className="signin__button"
          primary
          fluid
          style={{ height: '45px', marginTop: '15px', marginRight: '0' }}
          onClick={this.onBceidSigninBtnClick}
        >
          Login as Agreement Holder
        </Button>
        <div className="signin__link-container">
          <div
            role="button"
            tabIndex="0"
            onClick={this.onIdirSigninBtnClick}
          >
            Range Staff Login
          </div>
          <div className="signin__divider" />
          <div
            role="button"
            tabIndex="0"
            onClick={this.onSigninBtnClick}
          >
            Admin Login
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SignInButtons;