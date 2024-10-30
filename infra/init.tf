#####################################
# terraform Settings
#####################################
terraform {
  backend "s3" {
    bucket  = "interviewai-tfstate-${var.aws_id}"
    region  = var.aws_region
    key     = "terraform.tfstate"
    encrypt = true
  }
}
