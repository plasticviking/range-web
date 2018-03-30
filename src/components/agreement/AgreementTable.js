import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AgreementTableItem from './AgreementTableItem';
import { Table, Form as Loading, Pagination, Icon } from 'semantic-ui-react';
import { RANGE_NUMBER, AGREEMENT_HOLDER, STAFF_CONTACT ,RANGE_NAME, STATUS } from '../../constants/strings';

const propTypes = {
  agreements: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

const defaultProps = {
  agreements: [],
}

export class AgreementTable extends Component {
  state = {
    activePage: 1,
  }

  // handlePaginationChange = (e, { activePage }) => this.setState({ activePage })
  renderAgreementTableItem = (agreement) => {
    return (
      <AgreementTableItem 
        key={agreement.id}
        agreement={agreement}
      />
    );
  }

  render() {
    // const { activePage } = this.state;
    const { agreements, isLoading } = this.props;

    return (
      <Loading loading={isLoading}>
        <Table selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{RANGE_NUMBER}</Table.HeaderCell>
              <Table.HeaderCell>{RANGE_NAME}</Table.HeaderCell>
              <Table.HeaderCell>{AGREEMENT_HOLDER}</Table.HeaderCell>
              <Table.HeaderCell>{STAFF_CONTACT}</Table.HeaderCell>
              <Table.HeaderCell>{STATUS}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
      
          <Table.Body>
            {agreements.map(this.renderAgreementTableItem)}
          </Table.Body>
        </Table>

        {/* <Pagination 
          size='mini'
          activePage={activePage}
          onPageChange={this.handlePaginationChange} 
          totalPages={totalPages}
          ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
          firstItem={{ content: <Icon name='angle double left' />, icon: true }}
          lastItem={{ content: <Icon name='angle double right' />, icon: true }}
          prevItem={{ content: <Icon name='angle left' />, icon: true }}
          nextItem={{ content: <Icon name='angle right' />, icon: true }}
        /> */}
      </Loading>
    );
  }
}

AgreementTable.propTypes = propTypes;
AgreementTable.defaultProps = defaultProps;
export default AgreementTable;