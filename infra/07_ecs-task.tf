#####################################
# Task Setting
# 完全なものができないので後で補完する
#####################################
# admin-task
resource "aws_ecs_task_definition" "admin" {
  family                   = "${var.service_name}-${var.env}-admin-task"
  container_definitions    = <<EOF
[
  {
    "name": "admin",
    "image": "${aws_ecr_repository.admin.repository_url}:latest",
    "portMappings": [
      {
        "hostPort": 8000,
        "protocol": "tcp",
        "containerPort": 8000
      }
    ],
    "essential": true
  }
]
EOF
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  task_role_arn            = aws_iam_role.ecs-task.arn
  execution_role_arn       = aws_iam_role.ecs-task-execution.arn
  cpu                      = var.ecs_cpu
  memory                   = var.ecs_memory
  depends_on = [
    aws_cloudwatch_log_group.admin
  ]
}

# client-task
resource "aws_ecs_task_definition" "client" {
  family                   = "${var.service_name}-${var.env}-client-task"
  container_definitions    = <<EOF
[
  {
    "name": "client",
    "image": "${aws_ecr_repository.client.repository_url}:latest",
    "portMappings": [
      {
        "hostPort": 8000,
        "protocol": "tcp",
        "containerPort": 8000
      }
    ],
    "essential": true
  }
]
EOF
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  task_role_arn            = aws_iam_role.ecs-task.arn
  execution_role_arn       = aws_iam_role.ecs-task-execution.arn
  cpu                      = var.ecs_cpu
  memory                   = var.ecs_memory
  depends_on = [
    aws_cloudwatch_log_group.client
  ]
}
