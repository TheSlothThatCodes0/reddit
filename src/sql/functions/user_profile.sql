-- Function to get user profile by username
CREATE OR REPLACE FUNCTION get_user_profile_by_username(p_username VARCHAR)
RETURNS TABLE (
  user_id BIGINT,
  username VARCHAR,
  display_name VARCHAR,
  avatar TEXT,
  banner_image TEXT,
  bio TEXT,
  karma BIGINT,
  created_at DATE,
  location VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u."userID"::BIGINT,
    u."userName"::VARCHAR,
    u."userName"::VARCHAR as display_name, -- Using username as display_name if none exists
    u.avatar::TEXT,
    ''::TEXT as banner_image, -- Add a banner_image field if you have one
    ''::TEXT as bio, -- Add a bio field if you have one,
    (
      -- Calculate karma based on post votes
      COALESCE((
        SELECT SUM(CASE WHEN v."isUpvote" THEN 1 ELSE -1 END)
        FROM vote v
        JOIN posts p ON v."postID" = p.id
        WHERE p."userID" = u."userID"
      ), 0) +
      -- Add karma based on comment votes
      COALESCE((
        SELECT SUM(CASE WHEN v."isUpvote" THEN 1 ELSE -1 END)
        FROM vote v
        JOIN comment c ON v."commentID" = c.id
        WHERE c."userID" = u."userID"
      ), 0)
    )::BIGINT as karma,
    u."createdAt"::DATE as created_at,
    ''::VARCHAR as location -- Add a location field if you have one
  FROM users u
  WHERE LOWER(u."userName") = LOWER(p_username);
END;
$$ LANGUAGE plpgsql;

-- Function to get posts by a specific user
CREATE OR REPLACE FUNCTION get_user_posts(p_username VARCHAR)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content JSON,
  created_at TIMESTAMP,
  vote_score BIGINT,
  comment_count BIGINT,
  author_name VARCHAR,
  subreddit_id BIGINT,
  subreddit_name VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id::UUID,
    p.title::TEXT,
    p.content::JSON,
    p."createdAt"::TIMESTAMP,
    COALESCE(
      (SELECT SUM(CASE WHEN v."isUpvote" THEN 1 ELSE -1 END)
       FROM vote v WHERE v."postID" = p.id),
      0
    )::BIGINT as vote_score,
    COALESCE(
      (SELECT COUNT(*) FROM comment c WHERE c."postID" = p.id),
      0
    )::BIGINT as comment_count,
    u."userName"::VARCHAR as author_name,
    s."subredditID"::BIGINT,
    s."subredditName"::VARCHAR
  FROM posts p
  JOIN users u ON p."userID" = u."userID"
  JOIN subreddit s ON p."subredditID" = s."subredditID"
  WHERE LOWER(u."userName") = LOWER(p_username)
  ORDER BY p."createdAt" DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get comments by a specific user
CREATE OR REPLACE FUNCTION get_user_comments(p_username VARCHAR)
RETURNS TABLE (
  id UUID,
  content JSON,
  created_at TIMESTAMP,
  vote_score BIGINT,
  author_name VARCHAR,
  post_id UUID,
  post_title TEXT,
  subreddit_name VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id::UUID,
    c.content::JSON,
    c."createdAt"::TIMESTAMP,
    COALESCE(
      (SELECT SUM(CASE WHEN v."isUpvote" THEN 1 ELSE -1 END)
       FROM vote v WHERE v."commentID" = c.id),
      0
    )::BIGINT as vote_score,
    u."userName"::VARCHAR as author_name,
    p.id::UUID as post_id,
    p.title::TEXT as post_title,
    s."subredditName"::VARCHAR
  FROM comment c
  JOIN users u ON c."userID" = u."userID"
  JOIN posts p ON c."postID" = p.id
  JOIN subreddit s ON p."subredditID" = s."subredditID"
  WHERE LOWER(u."userName") = LOWER(p_username)
  ORDER BY c."createdAt" DESC;
END;
$$ LANGUAGE plpgsql;
