// https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api?apiVersion=2026-03-10
// https://octokit.github.io/rest.js/v18/#usage

const { Octokit } = require("@octokit/rest");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
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
