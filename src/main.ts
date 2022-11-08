import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  try {
    const token = core.getInput("repo-token", { required: true });
    const tag = core.getInput("tag", { required: true });
    const sha =
      core.getInput("commit-sha", { required: false }) || github.context.sha;

    const octokit = github.getOctokit(token);

    core.debug(`tagging #${sha} with tag ${tag}`);
    await octokit.rest.git.createRef({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: `refs/tags/${tag}`,
      sha: sha,
    });
  } catch (error) {
    let e;
    let message;
    if (error instanceof Error) {
      e = error;
      message = error.message;
    } else {
      message = String(error);
    }
    core.error(e);
    core.setFailed(message);
  }
}

run();
