import dotenv from "dotenv";
dotenv.config();

import { Octokit } from "@octokit/rest";
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.OWNER
const repo = process.env.REPO
const pull_number = process.env.NUMBER

function hasApprovedWithoutRequestingChanges(reviewerId, reviews) {
  const sortedReviews = reviews
    .filter((review) => review.user.id === reviewerId)
    .filter((review) => ["APPROVED", "CHANGES_REQUESTED"].includes(review.state))
    .sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at))
    .map((review) => review.state);

  return sortedReviews.slice(-1)[0] === "APPROVED";
}

async function checkAutoMerge({ pull_number }) {
  const { data: pr } = await octokit.pulls.get({ owner, repo, pull_number });
  const remainingRequestedReviews = pr.requested_reviewers.length;

  const { data: reviews } = await octokit.pulls.listReviews({ owner, repo, pull_number });
  const reviewerIds = Array.from(new Set(reviews.map((review) => review.user.id)));
  const reviewerApproved = reviewerIds.map((id) => hasApprovedWithoutRequestingChanges(id, reviews));
  const allApproved = reviewerApproved.reduce((a, v) => a && v, true);
  
  return remainingRequestedReviews === 0 && allApproved;
}

(async function () {
  const canMerge = await checkAutoMerge({ pull_number });

  if (canMerge) {
    await octokit.pulls.merge({
      owner,
      repo,
      pull_number,
      merge_method: "squash",
    });
  }
})();
