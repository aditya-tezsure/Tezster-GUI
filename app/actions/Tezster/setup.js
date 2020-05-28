import Docker from 'dockerode';
import checkConnectionStatus from './Helper/index';

const TEZSTER_IMAGE = 'tezsureinc/tezster:1.0.2';
const TEZSTER_CONTAINER_NAME = 'tezster';

export function startTezsterNodesAction() {
  const docker = new Docker();
  const checkInternetConnectionStatus = {
    connectionType: '',
  };
  return async (dispatch) => {
    checkInternetConnectionStatus.connectionType = 'CHECK_CONTAINER_PRESENT';
    checkInternetConnectionStatus.command = TEZSTER_CONTAINER_NAME;
    const isTezsterContainerPresent = await checkConnectionStatus(
      checkInternetConnectionStatus
    );
    checkInternetConnectionStatus.connectionType = 'CHECK_CONTAINER_RUNNING';
    checkInternetConnectionStatus.command = TEZSTER_CONTAINER_NAME;
    const isTezsterContainerRunning = await checkConnectionStatus(
      checkInternetConnectionStatus
    );
    if (!isTezsterContainerPresent && !isTezsterContainerRunning) {
      docker.createContainer(
        {
          name: `${TEZSTER_CONTAINER_NAME}`,
          Image: `${TEZSTER_IMAGE}`,
          Tty: true,
          ExposedPorts: {
            '18731/tcp': {},
            '18732/tcp': {},
            '18733/tcp': {},
          },
          PortBindings: {
            '18731/tcp': [
              {
                HostPort: '18731',
              },
            ],
            '18732/tcp': [
              {
                HostPort: '18732',
              },
            ],
            '18733/tcp': [
              {
                HostPort: '18733',
              },
            ],
          },
          NetworkMode: 'host',
          Cmd: [
            '/bin/bash',
            '-c',
            'cd /usr/local/bin && start_nodes.sh && tail -f /dev/null',
          ],
        },
        (err, data, container) => {
          if (err) {
            return dispatch({
              type: 'TEZSTER_ERROR',
              payload: 'Error in starting nodes',
            });
          }
          return dispatch({
            type: 'TEZSTER_START_NODES',
            payload: {
              msg: 'Nodes started successfully',
              ...data,
              ...container,
            },
          });
        }
      );
    } else if (!isTezsterContainerRunning) {
      docker.listContainers({ all: true }, (err, containers) => {
        if (err) {
          return dispatch({
            type: 'TEZSTER_ERROR',
            payload: 'Unable to fetch containers',
          });
        }
        const containerId = containers.filter((elem) =>
          elem.Names[0].includes('tezster')
        )[0].Id;
        const container = docker.getContainer(containerId);
        container.start((error, data) => {
          return dispatch({
            type: 'TEZSTER_START_NODES',
            payload: {
              msg: 'Nodes started successfully',
              data,
            },
          });
        });
      });
    } else {
      return dispatch({
        type: 'TEZSTER_START_NODES',
        payload: { msg: 'Nodes already running' },
      });
    }
  };
}

export function stopTezsterNodesAction() {
  const docker = new Docker();
  const checkInternetConnectionStatus = {
    connectionType: '',
  };
  return async (dispatch) => {
    checkInternetConnectionStatus.connectionType = 'CHECK_CONTAINER_PRESENT';
    checkInternetConnectionStatus.command = TEZSTER_CONTAINER_NAME;
    const isTezsterContainerPresent = await checkConnectionStatus(
      checkInternetConnectionStatus
    );
    checkInternetConnectionStatus.connectionType = 'CHECK_CONTAINER_RUNNING';
    checkInternetConnectionStatus.command = TEZSTER_CONTAINER_NAME;
    const isTezsterContainerRunning = await checkConnectionStatus(
      checkInternetConnectionStatus
    );
    if (isTezsterContainerPresent && isTezsterContainerRunning) {
      docker.listContainers({ all: true }, (err, containers) => {
        if (err) {
          return dispatch({
            type: 'TEZSTER_ERROR',
            payload: 'Unable to fetch containers',
          });
        }
        const containerId = containers.filter((elem) =>
          elem.Names[0].includes('tezster')
        )[0].Id;
        docker.getContainer(containerId).stop((error, response) => {
          if (error) {
            return dispatch({
              type: 'TEZSTER_ERROR',
              payload: 'Unable to stop container',
            });
          }
          return dispatch({
            type: 'TEZSTER_STOP_NODES',
            payload: { msg: 'Nodes stopped successfully', response },
          });
        });
      });
    }
    if (!isTezsterContainerRunning) {
      return dispatch({
        type: 'TEZSTER_STOP_NODES',
        payload: { msg: 'Nodes already stopped' },
      });
    }
  };
}
