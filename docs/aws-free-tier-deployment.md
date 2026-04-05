# Deploy MBA Decision OS On AWS Free Tier

This guide is for the lowest-cost AWS path for this repository.

AWS Free Tier note:

- If your AWS account was created before July 15, 2025, you are usually on the legacy 12-month free-tier model.
- If your AWS account was created on or after July 15, 2025, AWS uses the newer 6-month free plan plus credits model.

Recommended architecture for this repo:

- 1 Amazon EC2 instance
- Docker on the EC2 instance
- PostgreSQL and the Next.js app running via `docker-compose.ec2.yml`
- HTTP on port 80 using the EC2 public IPv4 or public DNS

This is the cheapest and simplest option for a demo or pilot deployment.

## Why this path

It avoids the AWS services most likely to create extra cost quickly:

- no Application Load Balancer
- no NAT Gateway
- no Route 53 hosted zone unless you explicitly want a custom domain
- no separate RDS instance unless you want cleaner separation

## What is in the repo for AWS

- `Dockerfile.prod`
- `docker-compose.ec2.yml`
- `.env.ec2.example`

## Step 1: Create an EC2 instance

Use Amazon EC2 in one region, for example `eu-west-2` or `us-east-1`.

Choose:

- Amazon Linux 2023
- `t3.micro` for newer accounts, or `t2.micro` if your account still uses the legacy free-tier model
- 20 GB to 30 GB gp3 root volume

Security group inbound rules:

- `22` from your IP only
- `80` from `0.0.0.0/0`

Do not open `5432` publicly.

## Step 2: Connect to the instance

```bash
ssh -i /path/to/key.pem ec2-user@YOUR_EC2_PUBLIC_DNS
```

## Step 3: Install Docker, Compose, and Git

First install Docker and Git:

```bash
sudo yum update -y
sudo yum install -y docker git
sudo service docker start
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user
```

If `docker-compose-plugin` is available on your AMI, install it with:

```bash
sudo yum install -y docker-compose-plugin
```

If that package is not available, install the Docker Compose plugin manually:

```bash
mkdir -p ~/.docker/cli-plugins
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ]; then FILE=docker-compose-linux-aarch64; else FILE=docker-compose-linux-x86_64; fi
curl -SL "https://github.com/docker/compose/releases/latest/download/$FILE" -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose
exit
```

SSH back in so the Docker group membership applies.

Verify:

```bash
docker info
docker compose version
```

## Step 4: Clone the repo

```bash
git clone <your-repo-url> mba-decision-os
cd mba-decision-os
```

## Step 5: Create the EC2 environment file

```bash
cp .env.ec2.example .env.ec2
nano .env.ec2
```

Update at least:

- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `APP_URL`

Example:

```env
POSTGRES_PASSWORD=super-strong-db-password
DATABASE_URL=postgresql://postgres:super-strong-db-password@postgres:5432/mba_decision_os?schema=public
NEXTAUTH_URL=http://ec2-xx-xx-xx-xx.compute-1.amazonaws.com
NEXTAUTH_SECRET=use-a-long-random-secret-value
APP_URL=http://ec2-xx-xx-xx-xx.compute-1.amazonaws.com
```

## Step 6: Start the application stack

```bash
docker compose --env-file .env.ec2 -f docker-compose.ec2.yml up -d --build
```

## Step 7: Seed demo data once

```bash
docker compose --env-file .env.ec2 -f docker-compose.ec2.yml run --rm seed
```

Important:

- The seed resets the demo database.
- Run it once for the first deployment, or only when you intentionally want to reload demo data.

## Step 8: Open the app

Open:

- `http://YOUR_EC2_PUBLIC_DNS`

## Step 9: Log in

Admin:

- `admin@mbadecisionos.dev`
- `Admin@12345`

Student:

- `student@mbadecisionos.dev`
- `Student@12345`

## Step 10: Update the app later

```bash
cd mba-decision-os
git pull
docker compose --env-file .env.ec2 -f docker-compose.ec2.yml up -d --build
```

## Step 11: Check logs

```bash
docker compose --env-file .env.ec2 -f docker-compose.ec2.yml logs -f web
```

## Optional: Use RDS instead of local PostgreSQL

If you want a cleaner production shape, use Amazon RDS PostgreSQL and keep only the app on EC2.

Then:

- remove the `postgres` service from your deployment flow
- set `DATABASE_URL` to your RDS endpoint
- keep the RDS instance private if possible
- allow port `5432` only from the EC2 security group

This is cleaner, but it is not the cheapest path.

## Cost cautions

Avoid these if you want to stay close to free-tier usage:

- Application Load Balancer
- NAT Gateway
- Route 53 unless you want a paid custom domain setup
- Publicly exposed RDS
- Extra public IPv4 addresses beyond free-tier coverage

## If you want HTTPS later

Cheapest approach:

- keep EC2
- add Nginx and Let's Encrypt on the instance
- optionally add Route 53 and a domain

That will not be fully free if you buy a domain or keep a Route 53 hosted zone.




