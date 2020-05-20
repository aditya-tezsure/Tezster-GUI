/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';

class TransactionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      senderAccount: '0',
      senderAccountErr: '',
      recieverAccount: '',
      recieverAccountErr: '',
      amount: '',
      showOptions: false,
      amountErr: '',
      gasPrice: '',
      gasPriceErr: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAutoComplete = this.handleAutoComplete.bind(this);
    this.handleSelectRecieverAccount = this.handleSelectRecieverAccount.bind(
      this
    );
    this.handleExecuteTransaction = this.handleExecuteTransaction.bind(this);
  }

  handleSelectRecieverAccount(event, recieverAccount) {
    this.setState({ recieverAccount, showOptions: false });
  }

  handleExecuteTransaction() {
    let errorFlag = false;
    const stateParams = {
      ...this.state,
      senderAccountErr: '',
      recieverAccountErr: '',
      amountErr: '',
      gasPriceErr: '',
    };
    if (stateParams.senderAccount === '0') {
      stateParams.senderAccountErr = 'Please select senders account';
      errorFlag = true;
    }
    if (stateParams.recieverAccount === '0') {
      stateParams.recieverAccountErr = 'Please select recievers account';
      errorFlag = true;
    }
    if (stateParams.amount === '') {
      stateParams.amountErr = 'Please enter amount';
      errorFlag = true;
    }
    if (stateParams.gasPrice === '') {
      stateParams.gasPriceErr = 'Please enter gas price';
      errorFlag = true;
    }
    if (parseInt(stateParams.gasPrice, 10) < 1500) {
      stateParams.gasPriceErr =
        'Please enter gas price more than or equals to 1500';
      errorFlag = true;
    }

    if (!errorFlag) {
      this.props.executeTransactionAction({
        ...this.props,
        ...this.state,
      });
    } else {
      this.setState(stateParams);
    }
  }

  handleInputChange(event) {
    if (event.target.name === 'recieverAccount') {
      this.setState({
        [event.target.name]: event.target.value,
        showOptions: false,
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
        showOptions: false,
      });
    }
  }

  handleAutoComplete(event) {
    this.setState({
      [event.target.name]: event.target.value,
      showOptions: true,
    });
  }

  render() {
    const recieverAccountsOptions = [];
    const { recieverAccount, showOptions } = this.state;
    const sendersAccounts = this.props.userAccounts.map((elem, index) => (
      <option key={elem.account + index} value={elem.account}>
        {`${elem.label}-${elem.account}`}
      </option>
    ));
    this.props.userAccounts.forEach((elem, index) => {
      if (elem.account.indexOf(recieverAccount) !== -1) {
        recieverAccountsOptions.push(
          <div
            key={elem.account + index}
            className="autocomplete-list"
            onClick={(event) =>
              this.handleSelectRecieverAccount(event, elem.account)
            }
          >
            {elem.account}
            <input type="hidden" value={elem.account} />
          </div>
        );
      }
    });
    return (
      <div
        className="modal fade show"
        role="dialog"
        style={{
          display: 'block',
          paddingRight: '15px',
          opacity: 1,
        }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Transfer/Send Tezos</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  this.props.handleModalToggle();
                  this.props.toggleButtonState();
                }}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-input">
              <div className="input-container">From </div>
              <select
                className="custom-select"
                name="senderAccount"
                value={this.state.senderAccount}
                onChange={this.handleInputChange}
              >
                <option value="0" disabled>
                  Select Sender&rsquo;s Account
                </option>
                {sendersAccounts}
              </select>
            </div>
            <span className="error-msg">{this.state.senderAccountErr}</span>
            <div className="modal-input">
              <div className="input-container">To </div>
              <input
                id="myInput"
                type="text"
                name="recieverAccount"
                className="custom-select"
                onChange={this.handleInputChange}
                onFocus={this.handleAutoComplete}
                value={this.state.recieverAccount}
                placeholder="Enter Reciever&rsquo;s Account"
              />
              {recieverAccountsOptions.length > 0 && showOptions ? (
                <div
                  id="myInputautocomplete-list"
                  className="autocomplete-items"
                >
                  {recieverAccountsOptions}
                </div>
              ) : (
                ''
              )}
            </div>
            <span className="error-msg">{this.state.recieverAccountErr}</span>
            <div className="modal-input">
              <div className="input-container" style={{ width: '26%' }}>
                Amount{' '}
              </div>
              <input
                type="number"
                name="amount"
                className="form-control"
                placeholder="Enter your amount"
                value={this.state.amount}
                onChange={this.handleInputChange}
                style={{ width: '60%' }}
              />
              <span className="tezos-icon" style={{ marginLeft: '10px' }}>
                {' '}
                ꜩ
              </span>
            </div>
            <span className="error-msg">{this.state.amountErr}</span>
            <div className="modal-input" style={{ paddingBottom: '0px' }}>
              <p style={{ paddingBottom: '0px', marginBottom: '0px' }}>
                Note: Please enter gas price more than or equals to 1500 <br />{' '}
              </p>
            </div>
            <div className="modal-input">
              <div className="input-container" style={{ width: '26%' }}>
                Gas Price{' '}
              </div>
              <input
                type="number"
                name="gasPrice"
                className="form-control"
                placeholder="Enter your gas price eg 1500"
                value={this.state.gasPrice}
                onChange={this.handleInputChange}
                style={{ width: '60%' }}
              />
              <span className="tezos-icon" style={{ marginLeft: '10px' }}>
                {' '}
                <b>mu</b>ꜩ
              </span>
            </div>
            <span className="error-msg">{this.state.gasPriceErr}</span>
            <br />
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => {
                  this.props.handleModalToggle();
                  this.props.toggleButtonState();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                disabled={this.props.buttonState}
                onClick={() => this.handleExecuteTransaction()}
              >
                {this.props.buttonState ? 'Please wait....' : 'Pay Amount'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TransactionModal;
