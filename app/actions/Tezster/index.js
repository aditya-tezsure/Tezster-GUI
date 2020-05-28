import Docker from 'dockerode';
import checkConnectionStatus from './Helper/index';

const TEZSTER_IMAGE = 'tezsureinc/tezster:1.0.2';
const TEZSTER_CONTAINER_NAME = 'tezster';
const CHECK_DOCKER_VERSION = 'docker -v';

export default function installTezsterCliAction() {
  const checkInternetConnectionStatus = {
    connectionType: '',
  };
  return async (dispatch) => {
    checkInternetConnectionStatus.connectionType = 'INTERNET';
    const isInternetAvailable = await checkConnectionStatus(
      checkInternetConnectionStatus
    );
    checkInternetConnectionStatus.connectionType = 'DOCKER_INSTALL_STATUS';
    checkInternetConnectionStatus.command = CHECK_DOCKER_VERSION;
    const isDockerInstalled = await checkConnectionStatus(
      checkInternetConnectionStatus
    );
    checkInternetConnectionStatus.connectionType = 'CHECK_DOCKER_IMAGE';
    checkInternetConnectionStatus.command = TEZSTER_IMAGE;
    const isTezsterImagePresent = await checkConnectionStatus(
      checkInternetConnectionStatus
    );
    checkInternetConnectionStatus.connectionType = 'CHECK_CONTAINER_PRESENT';
    checkInternetConnectionStatus.command = TEZSTER_CONTAINER_NAME;
    const isTezsterContainerPresent = await checkConnectionStatus(
      checkInternetConnectionStatus
    );
    if (!isInternetAvailable) {
      return dispatch({
        type: 'TEZSTER_ERROR',
        payload: 'Internet unavailable',
      });
    }
    if (!isDockerInstalled) {
      return dispatch({
        type: 'TEZSTER_ERROR',
        payload: 'Docker is not install on your system',
      });
    }
    return dispatch(
      installTezsterImage({
        isTezsterImagePresent,
        isTezsterContainerPresent,
      })
    );
  };
}

function installTezsterImage(args) {
  let payload = {};
  let subImages = [];
  const docker = new Docker();
  let progressPercentage;
  let totalProgressPercentage;
  let previousProgressPercentage = 0;
  const { isTezsterImagePresent, isTezsterContainerPresent } = args;
  return (dispatch) => {
    if (!isTezsterImagePresent) {
      docker.pull(TEZSTER_IMAGE, (err, stream) => {
        docker.modem.followProgress(stream, onFinished, onProgress);
        function onFinished(error, output) {
          if (error) {
            return dispatch({
              type: 'TEZSTER_ERROR',
              payload: 'Error in installing tezster',
            });
          }
          dispatch({
            type: 'TEZSTER_IMAGE_DOWNLOAD',
            payload: {
              msg: `Download Complete`,
              enum: 'DOWNLOAD_COMPLETE',
              totalProgressPercentage: 100,
              output,
            },
          });
          return dispatch(installTezsterContainer());
        }
        function onProgress(event) {
          switch (event.status) {
            case 'Pulling from tezsureinc/tezster':
              payload = {
                msg: `Downloading tezster-cli version ${event.id}`,
                enum: 'STARTING_DOWNLOAD',
              };
              return dispatch({
                type: 'TEZSTER_IMAGE_DOWNLOAD',
                payload,
              });
            case 'Pulling fs layer':
              subImages.push({
                id: event.id,
                progress: 0,
              });
              return true;
            case 'Downloading':
              progressPercentage =
                (parseInt(event.progressDetail.current, 10) /
                  parseInt(event.progressDetail.total, 10)) *
                100;
              totalProgressPercentage = 0;
              subImages = subImages.map((elem) => {
                if (elem.id === event.id) {
                  totalProgressPercentage += progressPercentage;
                  return {
                    ...elem,
                    progress: progressPercentage,
                  };
                }
                totalProgressPercentage += elem.progress;
                return elem;
              });
              totalProgressPercentage /= subImages.length;
              payload = {
                msg: `Downloading ${event.id}`,
                enum: 'STARTING_STREAM',
                totalProgressPercentage,
                subImages,
              };
              if (
                parseInt(previousProgressPercentage.toFixed(), 10) <
                parseInt(totalProgressPercentage.toFixed(), 10)
              ) {
                previousProgressPercentage = totalProgressPercentage;
                return dispatch({
                  type: 'TEZSTER_IMAGE_DOWNLOAD',
                  payload,
                });
              }
              break;
            default:
              return false;
          }
        }
      });
    } else if (!isTezsterContainerPresent) {
      return dispatch(installTezsterContainer());
    }
  };
}

function installTezsterContainer() {
  const docker = new Docker();
  return (dispatch) => {
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
            payload: 'Error in downloading container',
          });
        }
        return dispatch({
          type: 'TEZSTER_CONTAINER_RUNNING',
          payload: { ...data, ...container },
        });
      }
    );
  };
}
