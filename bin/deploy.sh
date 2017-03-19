#!/bin/bash
set -e

S3_BUCKET_NAME=yi-capture

aws s3 --profile yi-gitlab-ci cp dist/build.js.gz s3://$S3_BUCKET_NAME/yi-capture-$(awk '/version/{gsub(/("|",)/,"",$2);print $2};' package.json).min.js --acl public-read --content-encoding gzip
aws s3 --profile yi-gitlab-ci cp s3://$S3_BUCKET_NAME/yi-capture-$(awk '/version/{gsub(/("|",)/,"",$2);print $2};' package.json).min.js s3://$S3_BUCKET_NAME/yi-capture-latest.min.js --acl public-read --content-encoding gzip
