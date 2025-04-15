-- Function to get user conversations
CREATE OR REPLACE FUNCTION get_user_conversations(p_user_id BIGINT)
RETURNS TABLE (
  other_user_id BIGINT,
  username VARCHAR,
  latest_message TEXT,
  sent_at TIMESTAMP WITHOUT TIME ZONE,
  unread_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH latest_messages AS (
    SELECT 
      CASE 
        WHEN dm."senderID" = p_user_id THEN dm."receiverID"
        ELSE dm."senderID"
      END AS other_user_id,
      dm.content,
      dm."sentAt",
      dm.read,
      ROW_NUMBER() OVER (
        PARTITION BY 
          CASE 
            WHEN dm."senderID" = p_user_id THEN dm."receiverID"
            ELSE dm."senderID"
          END
        ORDER BY dm."sentAt" DESC
      ) as rn
    FROM "directMessage" dm
    WHERE dm."senderID" = p_user_id OR dm."receiverID" = p_user_id
  ),
  unread_counts AS (
    SELECT 
      "senderID" as other_user_id,
      COUNT(*) as unread_count
    FROM "directMessage"
    WHERE "receiverID" = p_user_id AND read = false
    GROUP BY "senderID"
  )
  
  SELECT 
    lm.other_user_id,
    u."userName" as username,
    lm.content as latest_message,
    lm."sentAt" as sent_at,
    COALESCE(uc.unread_count, 0)::BIGINT as unread_count
  FROM latest_messages lm
  JOIN users u ON u."userID" = lm.other_user_id
  LEFT JOIN unread_counts uc ON uc.other_user_id = lm.other_user_id
  WHERE lm.rn = 1
  ORDER BY lm."sentAt" DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to create a direct message and return the new message ID safely
CREATE OR REPLACE FUNCTION create_direct_message(
  p_content TEXT,
  p_sender_id BIGINT,
  p_receiver_id BIGINT
)
RETURNS BIGINT AS $$
DECLARE
  v_message_id BIGINT;
  v_max_id BIGINT;
BEGIN
  -- Get current maximum ID to potentially fix sequence
  SELECT MAX("messageID") INTO v_max_id FROM "directMessage";
  
  -- If we found existing messages, make sure our sequence is ahead of max ID
  IF v_max_id IS NOT NULL THEN
    -- Set the sequence to start after the max ID
    PERFORM setval('"directMessage_messageID_seq"', v_max_id);
  END IF;
  
  -- Now insert the message with current timestamp in UTC
  INSERT INTO "directMessage"(
    content,
    read,
    "sentAt",
    "senderID",
    "receiverID"
  ) VALUES (
    p_content,
    false,
    clock_timestamp(), -- Use clock_timestamp() for precise current time
    p_sender_id,
    p_receiver_id
  )
  RETURNING "messageID" INTO v_message_id;
  
  RETURN v_message_id;
END;
$$ LANGUAGE plpgsql;

-- Improve the get_conversation_messages function to handle errors better
CREATE OR REPLACE FUNCTION get_conversation_messages(
  p_current_user_id BIGINT,
  p_other_user_id BIGINT
)
RETURNS TABLE (
  message_id BIGINT,
  content TEXT,
  read BOOLEAN,
  sent_at TIMESTAMP WITHOUT TIME ZONE,
  sender_id BIGINT,
  receiver_id BIGINT,
  sender_name VARCHAR,
  receiver_name VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm."messageID",
    dm.content,
    dm.read,
    dm."sentAt",
    dm."senderID",
    dm."receiverID",
    sender."userName" as sender_name,
    receiver."userName" as receiver_name
  FROM "directMessage" dm
  JOIN users sender ON sender."userID" = dm."senderID"
  JOIN users receiver ON receiver."userID" = dm."receiverID"
  WHERE (dm."senderID" = p_current_user_id AND dm."receiverID" = p_other_user_id)
     OR (dm."senderID" = p_other_user_id AND dm."receiverID" = p_current_user_id)
  ORDER BY dm."sentAt" ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_conversation_read(
  p_current_user_id BIGINT,
  p_other_user_id BIGINT
) RETURNS void AS $$
BEGIN
  UPDATE "directMessage"
  SET read = true
  WHERE "receiverID" = p_current_user_id 
    AND "senderID" = p_other_user_id 
    AND read = false;
END;
$$ LANGUAGE plpgsql;
