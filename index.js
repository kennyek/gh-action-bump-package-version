const core = require('@actions/core');

async function run() {
  try {
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
