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
