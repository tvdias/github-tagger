import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  try {
    const token = core.getInput("repo-token", { required: true });
    const tag = core.getInput("tag", { required: true });
    const sha =
      core.getInput("commit-sha", { required: false }) || github.context.sha;

    const client = new github.GitHub(token);

    core.debug(`tagging #${sha} with tag ${tag}`);

    const params = {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: `tags/${tag}`
    };

    core.debug(JSON.stringify(params));

    const exists = await client
      .request(`GET /repos/:owner/:repo/git/:ref`, params)
      .catch(_ => false);

    core.debug(exists ? "exists" : "not exists");

    core.debug(`get ref`);

    var result = await client.git.getRef(params);

    core.debug(`result ${result}`);

    // await client.git.deleteRef({
    //   owner: github.context.repo.owner,
    //   repo: github.context.repo.repo,
    //   ref: `refs/tags/${tag}`
    // });

    await client.git.updateRef({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: `tags/${tag}`,
      sha: sha,
      force: true
    });
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
