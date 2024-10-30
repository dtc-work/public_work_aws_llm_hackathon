#####################################
# ECR
#####################################
resource "aws_ecr_repository" "admin" {
  name                 = "${var.service_name}-${var.env}-admin-ecr"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "client" {
  name                 = "${var.service_name}-${var.env}-client-ecr"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}
