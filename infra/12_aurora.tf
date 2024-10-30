#####################################
# AURORA
#####################################
# iam
resource "aws_iam_role" "db" {
  name               = "${var.service_name}-${var.env}-db-role"
  path               = "/"
  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "monitoring.rds.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
POLICY
}

resource "aws_iam_policy_attachment" "db" {
  name       = "${var.service_name}-${var.env}-db-role-attach"
  roles      = [aws_iam_role.db.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# RDS parameter group Setting
resource "aws_db_parameter_group" "db" {
  name   = "${var.service_name}-${var.env}-db-pg"
  family = "aurora-mysql8.0"
  tags = {
    Name = "${var.service_name}-${var.env}-db-pg"
  }
}

resource "aws_rds_cluster_parameter_group" "db" {
  name        = "${var.service_name}-${var.env}-rds-pg"
  family      = "aurora-mysql8.0"
  description = "${var.service_name}-${var.env}-rds-pg"
  tags = {
    Name = "${var.service_name}-${var.env}-rds-pg"
  }
  parameter {
    name         = "character_set_client"
    value        = "utf8mb4"
    apply_method = "immediate"
  }
  parameter {
    name         = "character_set_connection"
    value        = "utf8mb4"
    apply_method = "immediate"
  }
  parameter {
    name         = "character_set_database"
    value        = "utf8mb4"
    apply_method = "immediate"
  }
  parameter {
    name         = "character_set_filesystem"
    value        = "utf8mb4"
    apply_method = "immediate"
  }
  parameter {
    name         = "character_set_results"
    value        = "utf8mb4"
    apply_method = "immediate"
  }
  parameter {
    name         = "character_set_server"
    value        = "utf8mb4"
    apply_method = "immediate"
  }
  parameter {
    name         = "collation_connection"
    value        = "utf8mb4_general_ci"
    apply_method = "immediate"
  }

  parameter {
    name         = "collation_server"
    value        = "utf8mb4_general_ci"
    apply_method = "immediate"
  }

  parameter {
    name         = "time_zone"
    value        = "Asia/Tokyo"
    apply_method = "immediate"
  }
}
# RDS subnet group Setting
resource "aws_db_subnet_group" "db-sg" {
  name        = "${var.service_name}-${var.env}-db-sg"
  description = "${var.service_name}-${var.env}-db-sg"
  subnet_ids = [
    aws_subnet.private-db1.id,
    aws_subnet.private-db2.id
  ]
}

# RDS Setting
resource "aws_rds_cluster" "rds-cluster" {
  cluster_identifier              = "${var.service_name}-${var.env}-rds-cluster"
  engine                          = "aurora-mysql"
  engine_version                  = var.db_version
  database_name                   = var.db_name
  master_username                 = var.db_user
  master_password                 = var.db_password
  port                            = 3306
  availability_zones              = [var.az1, var.az2]
  vpc_security_group_ids          = [aws_security_group.db.id]
  db_subnet_group_name            = aws_db_subnet_group.db-sg.name
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.db.name
  deletion_protection             = true
  apply_immediately               = false
  storage_encrypted               = true
  skip_final_snapshot             = true
  backup_retention_period         = 35
  preferred_backup_window         = "09:10-09:40" # UTC (JST-9)
  preferred_maintenance_window    = "wed:09:45-wed:10:45"
  lifecycle {
    ignore_changes = [master_password, availability_zones]
  }
  enabled_cloudwatch_logs_exports = ["audit", "error", "general", "slowquery"]
  tags = {
    Name = "${var.service_name}-${var.env}-cluster"
  }
}

resource "aws_rds_cluster_instance" "rds" {
  count                   = var.db_cluster_count
  identifier              = "${var.service_name}-${var.env}-rds-${count.index}"
  engine                  = "aurora-mysql"
  engine_version          = var.db_version
  cluster_identifier      = aws_rds_cluster.rds-cluster.id
  instance_class          = var.db_instance_type
  ca_cert_identifier      = "rds-ca-rsa2048-g1"
  db_subnet_group_name    = aws_db_subnet_group.db-sg.name
  db_parameter_group_name = aws_db_parameter_group.db.name
  publicly_accessible     = false
  monitoring_role_arn     = aws_iam_role.db.arn
  monitoring_interval     = 60
  tags = {
    Name = "${var.service_name}-${var.env}-rds-${count.index}"
  }
}
output "rds_endpoint" {
  value = aws_rds_cluster.rds-cluster.endpoint
}
