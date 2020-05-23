import { exec } from 'child_process';

export default function executeCommandHelper(args, callback) {
  const { command } = args;
  exec(command, (err, stdout, stderr) => {
    if (err || stderr || stdout.toString().toLowerCase().includes('error')) {
      console.error(err);
      return callback(err, null);
    }
    return callback(null, stdout);
  });
}
