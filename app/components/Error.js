/* eslint-disable no-param-reassign */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';

function Error(props) {
  return (
    <div className="main-container">
      <div className="workplace-container">
        <div className="logo-container">
          <span className="logo-icon"></span>
        </div>
        <div className="description-container">
          <div className="workplace-header">
            <b>
              {props.isAvailableTezsterCli === 'pending'
                ? 'Please wait...'
                : 'Sorry'}
            </b>
          </div>
          <p className="workplace-description" style={{ marginBottom: '0px' }}>
            {props.isAvailableTezsterCli === 'pending'
              ? 'While we check whether tezster-cli is running'
              : `Tezster-CLI is not running on your PC, please install Tezster-CLI to use the localnode`}
          </p>
          <p className="workplace-description">
            or click on below button to continue with remote carthagenet nodes
          </p>
          <div className="cards-container">
            <div
              className="cards button-card accounts-button-container"
              style={{ justifyContent: 'center' }}
            >
              <div className="button-accounts">
                {props.isAvailableTezsterCli === 'pending' ? (
                  ''
                ) : (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      props.dashboardHeader.networkId = 'Carthagenet-Tezster';
                      props.handleNetworkChangeAction(props);
                      props.getAccountsAction(props);
                      props.handleTezsterCliActionChange();
                    }}
                  >
                    Go To Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error;
