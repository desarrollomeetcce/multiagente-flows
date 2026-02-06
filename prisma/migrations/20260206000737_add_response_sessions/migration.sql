-- CreateTable
CREATE TABLE "ResponseSession" (
    "responseId" TEXT NOT NULL,
    "session" TEXT NOT NULL,

    PRIMARY KEY ("responseId", "session"),
    CONSTRAINT "ResponseSession_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
