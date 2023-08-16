#!/usr/bin/env bash
export AWS_SDK_LOAD_CONFIG=true
export AWS_CONFIG_FILE="$( cd "$( dirname "${BASH_SOURCE[0]:-${(%):-%x}}" )" && pwd )"/aws/config
export AWS_PROFILE="sc"
export AWS_DEFAULT_REGION="eu-central-1"
# unset access key vars otherwise role is no assumed
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
