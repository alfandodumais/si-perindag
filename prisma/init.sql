-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "MerchantRegistration" (
    "id" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "businessName" TEXT NOT NULL,
    "yearFounded" INTEGER,
    "regency" TEXT DEFAULT 'Manado',
    "district" TEXT NOT NULL,
    "village" TEXT,
    "address" TEXT NOT NULL,
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "scale" TEXT NOT NULL,
    "employeeCount" INTEGER DEFAULT 1,
    "mainProduct" TEXT,
    "productType" TEXT,
    "rawMaterial" TEXT,
    "productionCapacity" TEXT,
    "productPrice" DOUBLE PRECISION,
    "productAdvantage" TEXT,
    "nib" TEXT,
    "businessLicense" TEXT,
    "npwp" TEXT,
    "halalCert" TEXT,
    "bpomPirt" TEXT,
    "haki" TEXT,
    "productionEquipment" TEXT,
    "monthlyRevenue" DOUBLE PRECISION,
    "marketChannels" TEXT DEFAULT 'Offline',
    "socialMedia" TEXT,
    "fundingSource" TEXT,
    "bankAccess" TEXT,
    "partnerships" TEXT,
    "needs" TEXT,
    "ikmScore" TEXT DEFAULT 'Berkembang',
    "mentoringStatus" TEXT DEFAULT 'Pendampingan',
    "ktpImage" TEXT,
    "businessImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerchantRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AppSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "MerchantRegistration_registrationNo_key" ON "MerchantRegistration"("registrationNo");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "AppSetting_key_key" ON "AppSetting"("key");
