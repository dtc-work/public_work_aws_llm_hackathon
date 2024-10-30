#####################################
# Service Setting
#####################################
# admin
resource "aws_ecs_service" "admin" {
  name            = "${var.service_name}-${var.env}-admin-service"
  cluster         = aws_ecs_cluster.admin.id
  task_definition = aws_ecs_task_definition.admin.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"
  load_balancer {
    target_group_arn = aws_alb_target_group.admin.id
    container_name   = "admin"
    container_port   = 8000
  }
  network_configuration {
    subnets          = [aws_subnet.private-app1.id, aws_subnet.private-app2.id]
    security_groups  = [aws_security_group.admin-ecs.id]
    assign_public_ip = "true"
  }
  depends_on = [aws_alb_listener.admin]
  #    "aws_alb_listener.admin-https"
}

# client
resource "aws_ecs_service" "client" {
  name            = "${var.service_name}-${var.env}-client-service"
  cluster         = aws_ecs_cluster.client.id
  task_definition = aws_ecs_task_definition.client.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"
  load_balancer {
    target_group_arn = aws_alb_target_group.client.id
    container_name   = "client"
    container_port   = 8000
  }
  network_configuration {
    subnets          = [aws_subnet.private-app1.id, aws_subnet.private-app2.id]
    security_groups  = [aws_security_group.client-ecs.id]
    assign_public_ip = "true"
  }
  depends_on = [aws_alb_listener.client]
  #    "aws_alb_listener.client-https"
}
