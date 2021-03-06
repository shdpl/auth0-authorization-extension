import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Error, TableAction, SectionHeader, BlankState, SearchBar, LoadingPanel } from 'auth0-extension-ui';

import { PermissionDeleteDialog, PermissionDialog, PermissionsTable } from './';
import PermissionsIcon from '../Icons/PermissionsIcon';

export default class PermissionsOverview extends Component {

  static propTypes = {
    onReset: React.PropTypes.func.isRequired,
    onSearch: React.PropTypes.func.isRequired,
    permission: PropTypes.object.isRequired,
    permissions: PropTypes.object.isRequired,
    applications: PropTypes.object.isRequired,
    createPermission: PropTypes.func.isRequired,
    editPermission: PropTypes.func.isRequired,
    savePermission: PropTypes.func.isRequired,
    clearPermission: PropTypes.func.isRequired,
    requestDeletePermission: PropTypes.func.isRequired,
    cancelDeletePermission: PropTypes.func.isRequired,
    deletePermission: PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.searchBarOptions = [
      {
        value: 'name',
        title: 'Name',
        selected: true,
        filterBy: 'name'
      },
      {
        value: 'description',
        title: 'Description',
        filterBy: 'description'
      }
    ];

    this.state = {
      selectedFilter: this.searchBarOptions[0]
    };

    // Searchbar.
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onHandleOptionChange = this.onHandleOptionChange.bind(this);
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.props.onSearch(e.target.value, this.state.selectedFilter.filterBy);
    }
  }

  onReset() {
    this.props.onReset();
  }

  onHandleOptionChange(option) {
    this.setState({
      selectedFilter: option
    });
  }

  renderPermissionActions = (permission) => (
    <div>
      <TableAction
        id={`edit-${permission._id}`} title="Edit Permission" icon="274"
        onClick={this.props.editPermission} args={[ permission ]} disabled={this.props.permissions.get('loading') || false}
      />
      <TableAction
        id={`delete-${permission._id}`} type="default" title="Delete Permission" icon="471"
        onClick={this.props.requestDeletePermission} args={[ permission ]} disabled={this.props.permissions.get('loading') || false}
      />
    </div>
  )

  renderBody(records, loading) {
    return (
      <div>
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-xs-12">
            <SearchBar
              placeholder="Search for permissions"
              searchOptions={this.searchBarOptions}
              handleKeyPress={this.onKeyPress}
              handleReset={this.onReset}
              handleOptionChange={this.onHandleOptionChange}
            />
          </div>
        </div>
        <PermissionsTable
          applications={this.props.applications}
          permissions={this.props.permissions.get('records')}
          loading={loading}
          renderActions={this.renderPermissionActions}
        />
      </div>
    );
  }

  renderEmptyState() {
    return (
      <BlankState
        title="Permissions"
        iconImage={
          <div className="no-content-image">
            <PermissionsIcon />
          </div>
        }
        description="Permissions description."
      >
        <a href="https://auth0.com/docs/extensions/authorization-extension" target="_blank" rel="noopener noreferrer" className="btn btn-transparent btn-md">
          Read more
        </a>
        <Button bsStyle="success" onClick={this.props.createPermission} disabled={this.props.permissions.loading}>
          <i className="icon icon-budicon-473" /> Create your first permission
        </Button>
      </BlankState>
    );
  }

  render() {
    const { error, loading, records, fetchQuery } = this.props.permissions.toJS();

    return (
      <div>
        <PermissionDialog applications={this.props.applications} permission={this.props.permission} onSave={this.props.savePermission} onClose={this.props.clearPermission} />
        <PermissionDeleteDialog permission={this.props.permission} onCancel={this.props.cancelDeletePermission} onConfirm={this.props.deletePermission} />

        { !error && !records.length && !loading && (!fetchQuery || !fetchQuery.length) ? this.renderEmptyState() : (
          <div>
            <SectionHeader
              title="Permissions"
              description="Define permissions for your applications. These can be grouped together using roles."
            >
              <Button bsStyle="success" onClick={this.props.createPermission} disabled={loading}>
                <i className="icon icon-budicon-473" /> Create Permission
              </Button>
            </SectionHeader>

            <div className="row">
              <div className="col-xs-12">
                <Error message={error} />
                <LoadingPanel show={loading}>
                  {this.renderBody(records, loading)}
                </LoadingPanel>
              </div>
            </div>
          </div>
        ) }
      </div>
    );
  }
}
