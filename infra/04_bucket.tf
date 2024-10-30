#####################################
# S3 Settings
#####################################
# admin-alb log
resource "aws_s3_bucket" "admin-alblog" {
  bucket = "${var.service_name}-${var.env}-admin-alblog-${var.aws_id}"
  tags = {
    Name  = "${var.service_name}-${var.env}-admin-alblog-${var.aws_id}"
    Group = "${var.service_name}-${var.env}"
  }
}

resource "aws_s3_bucket_ownership_controls" "admin-alblog" {
  bucket = aws_s3_bucket.admin-alblog.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "admin-alblog" {
  depends_on = [aws_s3_bucket_ownership_controls.admin-alblog]

  bucket = aws_s3_bucket.admin-alblog.id
  acl    = "private"
}

data "aws_elb_service_account" "admin-alblog" {
}

data "aws_iam_policy_document" "admin-alblog" {
  statement {
    actions   = ["s3:PutObject"]
    resources = ["arn:aws:s3:::${aws_s3_bucket.admin-alblog.arn}/alb-log/AWSLogs/${var.aws_id}/*"]
    principals {
      type        = "AWS"
      identifiers = [data.aws_elb_service_account.admin-alblog.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "admin-alblog" {
  bucket = aws_s3_bucket.admin-alblog.id
  policy = data.aws_iam_policy_document.admin-alblog.json
}

# client-alb log
resource "aws_s3_bucket" "client-alblog" {
  bucket = "${var.service_name}-${var.env}-client-alblog-${var.aws_id}"
  tags = {
    Name  = "${var.service_name}-${var.env}-client-alblog-${var.aws_id}"
    Group = "${var.service_name}-${var.env}"
  }
}

resource "aws_s3_bucket_ownership_controls" "client-alblog" {
  bucket = aws_s3_bucket.client-alblog.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "client-alblog" {
  depends_on = [aws_s3_bucket_ownership_controls.client-alblog]

  bucket = aws_s3_bucket.client-alblog.id
  acl    = "private"
}

data "aws_elb_service_account" "client-alblog" {
}

data "aws_iam_policy_document" "client-alblog" {
  statement {
    actions   = ["s3:PutObject"]
    resources = ["arn:aws:s3:::${aws_s3_bucket.client-alblog.arn}/alb-log/AWSLogs/${var.aws_id}/*"]
    principals {
      type        = "AWS"
      identifiers = [data.aws_elb_service_account.client-alblog.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "client-alblog" {
  bucket = aws_s3_bucket.client-alblog.id
  policy = data.aws_iam_policy_document.client-alblog.json
}
