-- Update NULL values to false
UPDATE "user" SET "isVisitor" = false WHERE "isVisitor" IS NULL;

ALTER TABLE "user" 
ALTER COLUMN "isVisitor" SET NOT NULL,
ALTER COLUMN "isVisitor" SET DEFAULT false;
