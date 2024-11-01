variable "service_name" {}
variable "env" {}
variable "aws_id" {}
variable "region" {}
variable "az1" {}
variable "az2" {}
variable "root_segment" {}
variable "public_segment1" {}
variable "public_segment2" {}
variable "app_private_segment1" {}
variable "app_private_segment2" {}
variable "db_private_segment1" {}
variable "db_private_segment2" {}
variable "allow_ips" { type = list(string) }
variable "ecs_cpu" {}
variable "ecs_memory" {}
variable "desired_count" {}
variable "min_capa" {}
variable "max_capa" {}
variable "cpu_target_val" {}
variable "cpu_scalein_sec" {}
variable "cpu_scaleout_sec" {}
variable "memory_target_val" {}
variable "memory_scalein_sec" {}
variable "memory_scaleout_sec" {}
variable "db_version" {}
variable "db_instance_type" {}
variable "db_multi_az" {}
variable "db_cluster_count" {}
variable "db_name" {}
variable "db_user" {}
variable "db_password" {}
