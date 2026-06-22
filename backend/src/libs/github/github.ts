// https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api?apiVersion=2026-03-10
// https://octokit.github.io/rest.js/v18/#usage

import { settings } from '../../utils/settings';

const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: settings.GITHUB_TOKEN,
});

// sends request with `Authorization: token mypersonalaccesstoken123` header

export const getGithubConnection = async () => {
  try {
    const { data } = await octokit.request("/user");
    return data;
  } catch (error) {
    console.error("Error getting Github connection:", error);
    return "Error getting Github connection";
  }
}
