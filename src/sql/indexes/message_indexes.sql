-- Add indexes to improve performance of message queries

-- Index for looking up sender messages
CREATE INDEX IF NOT EXISTS idx_direct_message_sender ON "directMessage" ("senderID");

-- Index for looking up receiver messages
CREATE INDEX IF NOT EXISTS idx_direct_message_receiver ON "directMessage" ("receiverID");

-- Index for finding unread messages
CREATE INDEX IF NOT EXISTS idx_direct_message_unread ON "directMessage" ("receiverID", read)
WHERE read = false;

-- Composite index for conversations between two users
CREATE INDEX IF NOT EXISTS idx_direct_message_conversation 
ON "directMessage" ("senderID", "receiverID", "sentAt");

-- Index on sentAt for sorting
CREATE INDEX IF NOT EXISTS idx_direct_message_sent_at ON "directMessage" ("sentAt");
