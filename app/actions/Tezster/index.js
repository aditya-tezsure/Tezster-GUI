import executeCommandHelper from './Helper/index';

export default function installTezsterCliAction() {
  const command = 'npm install -g tezster@latest';
  return (dispatch) => {
    executeCommandHelper(command, (err, response) => {
      if (err) {
        dispatch(err);
      }
    });
  };
}
