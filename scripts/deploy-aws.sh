#!/usr/bin/env bash
# Build and publish the site to S3 + CloudFront.
#
#   npm run deploy:aws
#
# Uses the AWS CLI profile "swu-homepage" (aws configure --profile swu-homepage),
# or the AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY env vars when set (GitHub Actions).
# The API is served from the same CloudFront domain under /api, so the build
# always uses VITE_API_BASE_URL=/api regardless of what .env says.
set -euo pipefail

BUCKET="${BUCKET:-swu-homepage-fe-2026}"
DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-E5IL85KSIOBV}"
if [[ -z "${AWS_ACCESS_KEY_ID:-}" ]]; then
  export AWS_PROFILE="${AWS_PROFILE:-swu-homepage}"
fi

cd "$(dirname "$0")/.."

echo "==> Building"
VITE_API_BASE_URL=/api npx vite build

echo "==> Uploading to s3://$BUCKET"
# Hashed assets never change content, so they can be cached for a year.
aws s3 sync dist/assets "s3://$BUCKET/assets" --delete \
  --cache-control "public,max-age=31536000,immutable" --only-show-errors
aws s3 sync dist "s3://$BUCKET" --delete --exclude "assets/*" \
  --cache-control "no-cache" --only-show-errors

echo "==> Invalidating CloudFront cache"
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" --query 'Invalidation.Id' --output text

echo "Done: https://d2efnrglbaul7g.cloudfront.net (changes show up in 1-2 minutes)"
