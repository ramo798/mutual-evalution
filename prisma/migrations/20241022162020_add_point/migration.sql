/*
  Warnings:

  - Added the required column `point` to the `Evaluation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Evaluation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "from" INTEGER NOT NULL,
    "to" INTEGER NOT NULL,
    "point" INTEGER NOT NULL,
    CONSTRAINT "Evaluation_from_fkey" FOREIGN KEY ("from") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Evaluation_to_fkey" FOREIGN KEY ("to") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Evaluation" ("from", "id", "to") SELECT "from", "id", "to" FROM "Evaluation";
DROP TABLE "Evaluation";
ALTER TABLE "new_Evaluation" RENAME TO "Evaluation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
