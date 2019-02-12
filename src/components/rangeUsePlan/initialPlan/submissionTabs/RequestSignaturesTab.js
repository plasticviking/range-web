import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from 'semantic-ui-react';
import RightBtn from '../RightBtn';
import LeftBtn from '../LeftBtn';
import TabTemplate from '../TabTemplate';
import { isClientCurrentUser } from '../../../../utils';

class RequestSignaturesTab extends Component {
  static propTypes = {
    currTabId: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    onSubmitClicked: PropTypes.func.isRequired,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    user: PropTypes.shape({}).isRequired,
    tab: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      back: PropTypes.string.isRequired,
      next: PropTypes.string.isRequired,
      text1: PropTypes.string.isRequired,
      text2: PropTypes.string.isRequired,
      text3: PropTypes.string.isRequired,
    }).isRequired,
  }

  onBackClicked = (e) => {
    const { handleTabChange, tab } = this.props;

    handleTabChange(e, { value: tab.back });
  }

  onSubmitClicked = (e) => {
    const { onSubmitClicked, handleTabChange, tab } = this.props;

    onSubmitClicked(e).then(() => {
      handleTabChange(e, { value: tab.next });
    });
  }

  renderAgreementHolder = (client) => {
    const { user } = this.props;

    return (
      <div key={client.id} className="rup__multi-tab__ah-list">
        <Icon name="user outline" />
        <span
          className={classnames(
            'rup__multi-tab__ah-list__cname',
            { 'rup__multi-tab__ah-list__cname--bold': isClientCurrentUser(client, user) },
          )}
        >
          {client.name}
        </span>
      </div>
    );
  }

  render() {
    const {
      currTabId,
      tab,
      isSubmitting,
      clients,
    } = this.props;
    const { id, title, text1, text2, text3 } = tab;
    const isActive = id === currTabId;

    if (!isActive) {
      return null;
    }

    return (
      <TabTemplate
        isActive={isActive}
        title={title}
        actions={
          <Fragment>
            <LeftBtn
              onClick={this.onBackClicked}
              content="Back"
            />
            <RightBtn
              onClick={this.onSubmitClicked}
              loading={isSubmitting}
              content="Request eSignatures and Submit"
            />
          </Fragment>
        }
        content={
          <div>
            <div style={{ marginBottom: '20px' }}>
              {text1}
            </div>
            <div style={{ marginBottom: '20px' }}>
              {text2}
            </div>
            <div className="rup__multi-tab__ah-list__header">
              {text3}
            </div>
            {clients.map(this.renderAgreementHolder)}
          </div>
        }
      />
    );
  }
}

export default RequestSignaturesTab;
