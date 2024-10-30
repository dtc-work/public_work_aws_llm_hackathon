#####################################
# IAM Settings
#####################################
# ecs use case
data "aws_iam_policy_document" "ecs-task" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# ecs task
resource "aws_iam_role" "ecs-task" {
  name               = "${var.service_name}-${var.env}-ecs-task-role"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.ecs-task.json
}

resource "aws_iam_policy_attachment" "ecs-task" {
  name       = "${var.service_name}-${var.env}-ecs-task-role-attach"
  roles      = [aws_iam_role.ecs-task.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

# ecs task execution
resource "aws_iam_role" "ecs-task-execution" {
  name               = "${var.service_name}-${var.env}-ecs-task-execution-role"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.ecs-task.json
}

resource "aws_iam_policy_attachment" "ecs-task-execution" {
  name       = "${var.service_name}-${var.env}-ecs-task-execution-role-attach"
  roles      = [aws_iam_role.ecs-task-execution.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs-task-execution" {
  name   = "getparameters-from-ecs-policy"
  role   = aws_iam_role.ecs-task-execution.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameters",
        "secretsmanager:GetSecretValue",
        "kms:Decrypt"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}
