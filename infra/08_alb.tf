#####################################
# ALB Setting
#####################################
# admin-alb
resource "aws_alb" "admin" {
  name            = "${var.service_name}-${var.env}-admin-alb"
  internal        = false
  security_groups = [aws_security_group.admin-alb.id]
  subnets = [
    aws_subnet.public1.id,
    aws_subnet.public2.id,
  ]
  access_logs {
    bucket = aws_s3_bucket.admin-alblog.bucket
    prefix = "admin-alb-log"
  }
  idle_timeout = 400
  tags = {
    Name  = "${var.service_name}-${var.env}-admin-alb"
    Group = "${var.service_name}-${var.env}"
  }
}

resource "aws_alb_target_group" "admin" {
  name        = "${var.service_name}-${var.env}-admin-alb-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
  health_check {
    interval            = 30
    path                = "/healthcheck"
    port                = 8000
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
    matcher             = 200
  }
  tags = {
    Name  = "${var.service_name}-${var.env}-admin-alb-tg"
    Group = "${var.service_name}-${var.env}"
  }
}

resource "aws_alb_listener" "admin" {
  load_balancer_arn = aws_alb.admin.id
  port              = 80
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.admin.id
    type             = "forward"
  }
}

# SSL証明書を発行して割り当てる必要があるため手で作成
# resource "aws_alb_listener" "admin-ssl" {
#   load_balancer_arn = "${aws_alb.admin.id}"
#   port              = 443
#   protocol          = "HTTPS"
#   ssl_policy        = "ELBSecurityPolicy-TLS13-1-3-2021-06"
#   certificate_arn   = ""
#   default_action {
#     target_group_arn = "${aws_alb_target_group.admin.id}"
#     type             = "forward"
#   }
# }

# client-alb
resource "aws_alb" "client" {
  name            = "${var.service_name}-${var.env}-client-alb"
  internal        = false
  security_groups = [aws_security_group.client-alb.id]
  subnets = [
    aws_subnet.public1.id,
    aws_subnet.public2.id,
  ]
  access_logs {
    bucket = aws_s3_bucket.client-alblog.bucket
    prefix = "client-alb-log"
  }
  idle_timeout = 400
  tags = {
    Name  = "${var.service_name}-${var.env}-client-alb"
    Group = "${var.service_name}-${var.env}"
  }
}

resource "aws_alb_target_group" "client" {
  name        = "${var.service_name}-${var.env}-client-alb-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
  health_check {
    interval            = 30
    path                = "/healthcheck"
    port                = 8000
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
    matcher             = 200
  }
  tags = {
    Name  = "${var.service_name}-${var.env}-client-alb-tg"
    Group = "${var.service_name}-${var.env}"
  }
}

resource "aws_alb_listener" "client" {
  load_balancer_arn = aws_alb.client.id
  port              = 80
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.client.id
    type             = "forward"
  }
}

# SSL証明書を発行して割り当てる必要があるため手で作成
# resource "aws_alb_listener" "client-ssl" {
#   load_balancer_arn = "${aws_alb.client.id}"
#   port              = 443
#   protocol          = "HTTPS"
#   ssl_policy        = "ELBSecurityPolicy-TLS13-1-3-2021-06"
#   certificate_arn   = ""
#   default_action {
#     target_group_arn = "${aws_alb_target_group.client.id}"
#     type             = "forward"
#   }
# }
