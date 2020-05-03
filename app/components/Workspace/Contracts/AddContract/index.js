import React, { Component } from 'react';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contractId: '',
      contractLabel: '',
      errorContractId: '',
      errorContractLabel: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddContract = this.handleAddContract.bind(this);
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleAddContract() {
    let error = false;
    const stateParams = {
      ...this.state,
    };
    stateParams.errorContractLabel = '';
    stateParams.errorContractId = '';
    if (this.state.contractLabel === '') {
      stateParams.errorContractLabel = 'Please enter contract label';
      error = true;
    }
    if (this.state.contractId !== '') {
      const networkId = this.props.dashboardHeader.networkId.split('-')[0];
      const contract = JSON.parse(localStorage.getItem('tezsure')).contracts[
        networkId
      ];
      if (
        contract.filter((elem) => elem.name === this.state.contractLabel)
          .length > 0
      ) {
        stateParams.errorContractLabel =
          'Label already in use, please choose a different label';
        error = true;
      }
    }
    if (this.state.contractId === '') {
      stateParams.errorContractId = 'Please enter contract id';
      error = true;
    }
    if (!this.state.contractId.startsWith('KT')) {
      stateParams.errorContractId =
        'Invalid contract id, contract id must look like this KT1Evv3XuLxzZJfb6wq8ahzEGz4zsgc3L';
      error = true;
    }
    debugger;
    if (error === false) {
      this.setState({ ...stateParams }, () => {
        this.props.addContractAction({ ...this.state, ...this.props });
      });
    } else {
      this.setState({ ...stateParams });
    }
  }

  render() {
    const { errorContractLabel, errorContractId } = this.state;
    return (
      <div className="transactions-contents">
        <div className="modal-input">
          <div className="input-container" style={{ width: '26%' }}>
            Enter Contract Label{' '}
          </div>
          <input
            type="text"
            name="contractLabel"
            className="form-control"
            placeholder="Enter contract label"
            value={this.state.contractLabel}
            onChange={this.handleInputChange}
          />
        </div>
        {errorContractLabel && (
          <div className="modal-input">
            <span className="error-msg">{errorContractLabel}</span>
          </div>
        )}
        <div className="modal-input">
          <div className="input-container" style={{ width: '26%' }}>
            Enter Contract Id{' '}
          </div>
          <input
            type="text"
            name="contractId"
            className="form-control"
            placeholder="Enter contract id"
            value={this.state.contractId}
            onChange={this.handleInputChange}
          />
        </div>
        {errorContractId && (
          <div className="modal-input">
            <span className="error-msg">{errorContractId}</span>
          </div>
        )}
        <div className="cards-container">
          <div className="cards button-card accounts-button-container">
            <div className="button-accounts">
              <button
                type="button"
                className="btn btn-success"
                disabled={this.props.buttonState}
                onClick={this.handleAddContract}
              >
                {this.props.buttonState ? 'Please wait....' : 'Add Contract'}
              </button>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}

export default index;
