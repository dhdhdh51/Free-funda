# BharatAI Business OS - AWS EC2 & RDS Deployment Guide

## 1. Cloud Architecture
- **Compute:** AWS EC2 (Ubuntu 22.04 LTS or Amazon Linux 2023) running Apache 2.4 + PHP 8.2 FPM.
- **Database:** AWS RDS MySQL 8.0 (Multi-AZ for high availability).
- **Storage:** AWS S3 for uploaded PDFs, invoices, and documents.
- **Email:** AWS SES (Simple Email Service) for transactional emails.
- **SSL / CDN:** AWS CloudFront with AWS Certificate Manager (ACM).

## 2. Step-by-Step Provisioning

### A. EC2 Instance Setup
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y apache2 php8.2 php8.2-mysql php8.2-curl php8.2-mbstring php8.2-xml php8.2-zip unzip git
sudo a2enmod rewrite ssl headers
```

### B. Configure VirtualHost (`/etc/apache2/sites-available/bharatai.conf`)
```apache
<VirtualHost *:80>
    ServerName app.yourdomain.com
    DocumentRoot /var/www/bharatai
    <Directory /var/www/bharatai>
        AllowOverride All
        Require all granted
    </Directory>
    ErrorLog ${APACHE_LOG_DIR}/bharatai_error.log
    CustomLog ${APACHE_LOG_DIR}/bharatai_access.log combined
</VirtualHost>
```

### C. Import Database
```bash
mysql -h your-rds-endpoint.rds.amazonaws.com -u dbadmin -p bharatai_db < /var/www/bharatai/database/schema.sql
mysql -h your-rds-endpoint.rds.amazonaws.com -u dbadmin -p bharatai_db < /var/www/bharatai/database/seed_demo.sql
```

### D. Set Permissions & Secrets
```bash
sudo chown -R www-data:www-data /var/www/bharatai/storage /var/www/bharatai/public/uploads
sudo chmod -R 755 /var/www/bharatai/storage
cp .env.example .env
nano .env
```
