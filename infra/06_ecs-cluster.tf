#####################################
# ECS Cluster
#####################################
resource "aws_ecs_cluster" "admin" {
  name = "${var.service_name}-${var.env}-admin-cluster"
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_cluster" "client" {
  name = "${var.service_name}-${var.env}-client-cluster"
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}
