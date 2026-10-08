-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qr_id" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "points" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "collections_qr_id_key" ON "collections"("qr_id");

-- CreateIndex
CREATE INDEX "collections_created_at_idx" ON "collections"("created_at");
