#####################################
# ECS Service Auto Scale Setting
#####################################
resource "aws_appautoscaling_target" "client" {
  min_capacity       = var.min_capa
  max_capacity       = var.max_capa
  resource_id        = "service/${aws_ecs_cluster.client.name}/${aws_ecs_service.client.name}"
  role_arn           = "arn:aws:iam::${var.aws_id}:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "client-cpu" {
  name               = "${var.service_name}-${var.env}-cpu-scalepolicy"
  service_namespace  = aws_appautoscaling_target.client.service_namespace
  scalable_dimension = aws_appautoscaling_target.client.scalable_dimension
  resource_id        = aws_appautoscaling_target.client.resource_id
  policy_type        = "TargetTrackingScaling"
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = var.cpu_target_val
    scale_in_cooldown  = var.cpu_scalein_sec
    scale_out_cooldown = var.cpu_scaleout_sec
  }
}

resource "aws_appautoscaling_policy" "client-memory" {
  name               = "${var.service_name}-${var.env}-memory-scalepolicy"
  service_namespace  = aws_appautoscaling_target.client.service_namespace
  scalable_dimension = aws_appautoscaling_target.client.scalable_dimension
  resource_id        = aws_appautoscaling_target.client.resource_id
  policy_type        = "TargetTrackingScaling"
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    target_value       = var.memory_target_val
    scale_in_cooldown  = var.memory_scalein_sec
    scale_out_cooldown = var.memory_scaleout_sec
  }
}
