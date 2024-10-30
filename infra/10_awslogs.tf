resource "aws_cloudwatch_log_group" "admin" {
  name = "/aws/ecs/${var.service_name}-${var.env}-admin-cluster"
  # retention_in_days = 731
}

resource "aws_cloudwatch_log_group" "client" {
  name = "/aws/ecs/${var.service_name}-${var.env}-client-cluster"
  # retention_in_days = 731
}
