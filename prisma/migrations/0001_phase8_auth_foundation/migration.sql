-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Verdict" AS ENUM ('PASS', 'FAIL', 'INCONCLUSIVE');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "GovernmentDataSource" AS ENUM ('GST_PORTAL', 'INCOME_TAX_PORTAL', 'MCA', 'BANK', 'MANUAL_UPLOAD', 'ERP', 'CREDIT_BUREAU', 'PUBLIC_RECORD');

-- CreateEnum
CREATE TYPE "GovernmentVerificationStatus" AS ENUM ('VERIFIED', 'NOT_FOUND', 'DISCREPANCY', 'PENDING', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ANALYST', 'ADMIN');

-- CreateTable
CREATE TABLE "ApiClient" (
    "id" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "name" TEXT,
    "monthly_quota" INTEGER NOT NULL DEFAULT 1000,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "client_reference_id" TEXT,
    "api_client_id" TEXT,
    "verdict" "Verdict",
    "verdict_code" TEXT,
    "anomaly_severity" "Severity",
    "status" TEXT,
    "government_verification_status" "GovernmentVerificationStatus",
    "checks" JSONB,
    "match_fields" JSONB,
    "supplier_intelligence" JSONB,
    "pricing_tier" JSONB,
    "error" TEXT,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernmentDataCache" (
    "id" TEXT NOT NULL,
    "data_source" "GovernmentDataSource" NOT NULL,
    "source_name" TEXT NOT NULL,
    "gstin" TEXT,
    "cached_data" JSONB NOT NULL,
    "accessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernmentDataCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernmentApiAuditLog" (
    "id" TEXT NOT NULL,
    "api_client_id" TEXT,
    "endpoint" TEXT NOT NULL,
    "request_method" TEXT NOT NULL,
    "request_body" JSONB,
    "response_status" INTEGER NOT NULL,
    "response_body" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GovernmentApiAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organisation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "api_client_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ANALYST',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_api_client_id_key" ON "Organisation"("api_client_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_api_client_id_fkey" FOREIGN KEY ("api_client_id") REFERENCES "ApiClient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GovernmentApiAuditLog" ADD CONSTRAINT "GovernmentApiAuditLog_api_client_id_fkey" FOREIGN KEY ("api_client_id") REFERENCES "ApiClient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organisation" ADD CONSTRAINT "Organisation_api_client_id_fkey" FOREIGN KEY ("api_client_id") REFERENCES "ApiClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
