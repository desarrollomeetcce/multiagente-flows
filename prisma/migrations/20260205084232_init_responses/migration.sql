-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ResponseActivation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "responseId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "keyword" TEXT,
    "delayFrom" TEXT,
    "delayDays" INTEGER,
    "delayHours" INTEGER,
    "delayMinutes" INTEGER,
    CONSTRAINT "ResponseActivation_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivationTag" (
    "activationId" TEXT NOT NULL,
    "tagId" INTEGER NOT NULL,

    PRIMARY KEY ("activationId", "tagId"),
    CONSTRAINT "ActivationTag_activationId_fkey" FOREIGN KEY ("activationId") REFERENCES "ResponseActivation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResponseAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "responseId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "delaySeconds" INTEGER,
    "text" TEXT,
    "payload" TEXT,
    "position" INTEGER NOT NULL,
    CONSTRAINT "ResponseAction_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResponseRules" (
    "responseId" TEXT NOT NULL PRIMARY KEY,
    "noGroups" BOOLEAN NOT NULL,
    "onlySchedule" BOOLEAN NOT NULL,
    "ignoreIfOpen" BOOLEAN NOT NULL,
    "ignoreIfArchived" BOOLEAN NOT NULL,
    CONSTRAINT "ResponseRules_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FollowUpJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "responseId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "scheduledAt" DATETIME NOT NULL,
    "executedAt" DATETIME,
    "cancelledAt" DATETIME,
    "status" TEXT NOT NULL,
    CONSTRAINT "FollowUpJob_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
