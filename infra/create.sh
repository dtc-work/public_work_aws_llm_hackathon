#!/bin/bash

ROOT_DIR=`pwd`

ENV_TYPE=$1
[ "$1" = "" ] && ENV_TYPE="dev"

TFVARS="${ENV_TYPE}.tfvars"

# AWSログイン
export AWS_DEFAULT_PROFILE=proddev-cliadmin

# workspace選択
terraform workspace new ${ENV_TYPE}
terraform workspace select ${ENV_TYPE}

# check && exec
if [[ "$2" = "destroy" ]]; then
  terraform destroy -var-file ${TFVARS}
  \rm -rf ${EC2_KEY} ${EC2_KEY}.pub
elif [[ "$2" = "dry" ]]; then
  terraform init
  terraform plan -var-file=${TFVARS}
  \rm -rf ${EC2_KEY} ${EC2_KEY}.pub
else
  terraform init
  terraform plan -var-file=${TFVARS} && \
  terraform apply -auto-approve -var-file ${TFVARS}
fi
