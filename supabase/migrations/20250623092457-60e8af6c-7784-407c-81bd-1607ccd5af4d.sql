
-- Clear all existing posts (both feed posts and marketplace items)
DELETE FROM public.posts;

-- Clear any trade requests
DELETE FROM public.trade_requests;

-- Clear marketplace table if it has any data
DELETE FROM public.marketplace;

-- Reset the auto-increment sequences if needed
-- (This ensures new posts start with clean IDs)
SELECT setval(pg_get_serial_sequence('public.posts', 'id'), 1, false);
