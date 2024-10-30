#####################################
# VPC Settings
#####################################
resource "aws_vpc" "main" {
  cidr_block           = var.root_segment
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name  = "${var.service_name}-${var.env}-vpc"
    Group = "${var.service_name}-${var.env}"
  }
}

#####################################
# Internet Gateway Settings
#####################################
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name  = "${var.service_name}-${var.env}-igw"
    Group = "${var.service_name}-${var.env}"
  }
}

#####################################
# Public Subnets Settings
#####################################
resource "aws_subnet" "public1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_segment1
  availability_zone       = var.az1
  map_public_ip_on_launch = true
  tags = {
    Name  = "${var.service_name}-${var.env}-public-subnet1"
    Group = "${var.service_name}-${var.env}"
  }
}

resource "aws_subnet" "public2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_segment2
  availability_zone       = var.az2
  map_public_ip_on_launch = true
  tags = {
    Name  = "${var.service_name}-${var.env}-public-subnet2"
    Group = "${var.service_name}-${var.env}"
  }
}

#####################################
# Private Subnets Settings
#####################################
resource "aws_subnet" "private-app1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.app_private_segment1
  availability_zone       = var.az1
  map_public_ip_on_launch = false
  tags = {
    Name  = "${var.service_name}-${var.env}-private-app-subnet1"
    Group = "${var.service_name}-${var.env}"
  }
}

resource "aws_subnet" "private-app2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.app_private_segment2
  availability_zone       = var.az2
  map_public_ip_on_launch = false
  tags = {
    Name  = "${var.service_name}-${var.env}-private-app-subnet2"
    Group = "${var.service_name}-${var.env}"
  }
}

resource "aws_subnet" "private-db1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.db_private_segment1
  availability_zone       = var.az1
  map_public_ip_on_launch = false
  tags = {
    Name  = "${var.service_name}-${var.env}-private-db-subnet1"
    Group = "${var.service_name}-${var.env}"
  }
}

resource "aws_subnet" "private-db2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.db_private_segment2
  availability_zone       = var.az2
  map_public_ip_on_launch = false
  tags = {
    Name  = "${var.service_name}-${var.env}-private-db-subnet2"
    Group = "${var.service_name}-${var.env}"
  }
}

#####################################
# Public Routes Table Settings
#####################################
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  tags = {
    Name  = "${var.service_name}-${var.env}-public-rtb"
    Group = "${var.service_name}-${var.env}"
  }
}

resource "aws_route_table_association" "public1" {
  subnet_id      = aws_subnet.public1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public2" {
  subnet_id      = aws_subnet.public2.id
  route_table_id = aws_route_table.public.id
}

#####################################
# Private Routes Table Settings
#####################################
resource "aws_route_table" "private-app" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name  = "${var.service_name}-${var.env}-app-private-rtb"
    Group = "${var.service_name}-${var.env}"
  }
}

resource "aws_route_table_association" "private-app1" {
  subnet_id      = aws_subnet.private-app1.id
  route_table_id = aws_route_table.private-app.id
}

resource "aws_route_table_association" "private-app2" {
  subnet_id      = aws_subnet.private-app2.id
  route_table_id = aws_route_table.private-app.id
}

resource "aws_route_table" "private-db" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  tags = {
    Name  = "${var.service_name}-${var.env}-private-db-rtb"
    Group = "${var.service_name}-${var.env}"
  }
}

resource "aws_route_table_association" "private-db1" {
  subnet_id      = aws_subnet.private-db1.id
  route_table_id = aws_route_table.private-db.id
}

resource "aws_route_table_association" "private-db2" {
  subnet_id      = aws_subnet.private-db2.id
  route_table_id = aws_route_table.private-db.id
}

#####################################
# ##### Network ACL Setting #####
#####################################
resource "aws_network_acl" "acl" {
  vpc_id = aws_vpc.main.id
  subnet_ids = [
    aws_subnet.public1.id,
    aws_subnet.public2.id,
    aws_subnet.private-app1.id,
    aws_subnet.private-app2.id,
    aws_subnet.private-db1.id,
    aws_subnet.private-db2.id,
  ]
  ingress {
    from_port  = 0
    to_port    = 0
    rule_no    = 100
    action     = "allow"
    protocol   = "-1"
    cidr_block = "0.0.0.0/0"
  }
  egress {
    from_port  = 0
    to_port    = 0
    rule_no    = 100
    action     = "allow"
    protocol   = "-1"
    cidr_block = "0.0.0.0/0"
  }
  tags = {
    Name = "${var.service_name}-${var.env}-acl"
  }
}

