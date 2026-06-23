// https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api?apiVersion=2026-03-10
// https://octokit.github.io/rest.js/v18/#usage

import { logger } from '../../utils/logger';
import { settings } from '../../utils/settings';

const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: settings.GITHUB_TOKEN,
});

// sends request with `Authorization: token mypersonalaccesstoken123` header

export const getGithubConnection = async () => {
  try {
    const { data } = await octokit.request("/user");
    logger.info(settings.GITHUB_TOKEN)
    logger.info(data)
    return data;
  } catch (error) {
    console.error("Error getting Github connection:", error);
    return "Error getting Github connection";
  }
};

export async function getGithubAccessToken(code: string): Promise<string> {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: settings.GITHUB_OAUTH.CLIENT_ID,
      client_secret: settings.GITHUB_OAUTH.CLIENT_SECRET,
      code,
      redirect_uri: settings.GITHUB_OAUTH.CALLBACK_URL,
    }),
  });

  const data = (await res.json()) as any;
  if (!data.access_token) {
    throw new Error("GitHub OAuth failed");
  }
  return data.access_token;
}

export async function getGithubUser(token: string): Promise<any> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "User-Agent": "node",
    },
  });
  return res.json();
}

export async function getEmails(token: string): Promise<any[]> {
  const res = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "User-Agent": "node",
    },
  });
  if (!res.ok) return [];
  return res.json();
}
