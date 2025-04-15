-- Script to fix the directMessage sequence issue

-- First, check the current maximum ID
DO $$
DECLARE
  max_id BIGINT;
BEGIN
  SELECT MAX("messageID") INTO max_id FROM "directMessage";
  
  IF max_id IS NULL THEN
    RAISE NOTICE 'No messages found, sequence will start at 1';
  ELSE
    -- Set the sequence to start after the max ID
    PERFORM setval('"directMessage_messageID_seq"', max_id);
    RAISE NOTICE 'Sequence set to start after ID %', max_id;
  END IF;
END $$;

-- Alternative approach: completely recreate the sequence
-- This is more drastic but can resolve stubborn issues
/*
DO $$
BEGIN
  -- Drop the existing sequence
  EXECUTE 'ALTER TABLE "directMessage" ALTER COLUMN "messageID" DROP DEFAULT';
  EXECUTE 'DROP SEQUENCE IF EXISTS "directMessage_messageID_seq"';
  
  -- Create a new sequence
  EXECUTE 'CREATE SEQUENCE "directMessage_messageID_seq"';
  
  -- Get the current maximum ID
  DECLARE
    max_id BIGINT;
  BEGIN
    SELECT COALESCE(MAX("messageID"), 0) + 1 INTO max_id FROM "directMessage";
    
    -- Set the sequence to start after the max ID
    EXECUTE 'ALTER SEQUENCE "directMessage_messageID_seq" START WITH ' || max_id;
    EXECUTE 'ALTER SEQUENCE "directMessage_messageID_seq" OWNED BY "directMessage"."messageID"';
    EXECUTE 'ALTER TABLE "directMessage" ALTER COLUMN "messageID" SET DEFAULT nextval(''"directMessage_messageID_seq"''::regclass)';
    
    RAISE NOTICE 'Sequence recreated and set to start at %', max_id;
  END;
END $$;
*/
