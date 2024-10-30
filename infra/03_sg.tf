#####################################
# Security Group Settings
#####################################
# admin-alb
resource "aws_security_group" "admin-alb" {
  name        = "${var.service_name}-${var.env}-admin-alb-sg"
  vpc_id      = aws_vpc.main.id
  description = "${var.service_name}-${var.env}-admin-alb-sg"
  tags = {
    Name  = "${var.service_name}-${var.env}-admin-alb-sg"
    Group = "${var.service_name}-${var.env}"
  }
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.allow_ips
  }
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.allow_ips
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# client-alb
resource "aws_security_group" "client-alb" {
  name        = "${var.service_name}-${var.env}-client-alb-sg"
  vpc_id      = aws_vpc.main.id
  description = "${var.service_name}-${var.env}-client-alb-sg"
  tags = {
    Name  = "${var.service_name}-${var.env}-client-alb-sg"
    Group = "${var.service_name}-${var.env}"
  }
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.allow_ips
  }
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.allow_ips
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# admin-ecs
resource "aws_security_group" "admin-ecs" {
  name        = "${var.service_name}-${var.env}-admin-ecs-sg"
  vpc_id      = aws_vpc.main.id
  description = "${var.service_name}-${var.env}-admin-ecs-sg"
  tags = {
    Name  = "${var.service_name}-${var.env}-admin-ecs-sg"
    Group = "${var.service_name}-${var.env}"
  }
  ingress {
    from_port       = 8000
    to_port         = 8000
    protocol        = "tcp"
    security_groups = [aws_security_group.admin-alb.id]
    self            = false
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# client-ecs
resource "aws_security_group" "client-ecs" {
  name        = "${var.service_name}-${var.env}-client-ecs-sg"
  vpc_id      = aws_vpc.main.id
  description = "${var.service_name}-${var.env}-client-ecs-sg"
  tags = {
    Name  = "${var.service_name}-${var.env}-client-ecs-sg"
    Group = "${var.service_name}-${var.env}"
  }
  ingress {
    from_port       = 8000
    to_port         = 8000
    protocol        = "tcp"
    security_groups = [aws_security_group.client-alb.id]
    self            = false
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# db(MySQL)
resource "aws_security_group" "db" {
  name        = "${var.service_name}-${var.env}-db-sg"
  vpc_id      = aws_vpc.main.id
  description = "${var.service_name}-${var.env}-db-sg"
  tags = {
    Name  = "${var.service_name}-${var.env}-db-sg"
    Group = "${var.service_name}-${var.env}"
  }
  ingress {
    from_port = 3306
    to_port   = 3306
    protocol  = "tcp"
    security_groups = [
      aws_security_group.admin-ecs.id,
      aws_security_group.client-ecs.id,
    ]
    self = false
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
