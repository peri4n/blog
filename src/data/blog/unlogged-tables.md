---
title: Unlogged Tables
author: Fabian Bull
pubDatetime: 2026-04-14
postSlug: unlogged-tables
featured: false
draft: false
tags:
  - database
  - postgres
  - today-i-learned
description: This article explains what unlogged tables are, how they are used, advantages and disadvantages.
---

Sometimes in your day job you implement a feature where losing the data is not really that important.
Like caches or user sessions; if all sessions are gone, it's inconvenient but it's not the end of the world.
Users can just log in again.
Same for caches.

A lot of people would immediately store such data in Redis but it turns out Postgres has an alternative in store, _unlogged tables_.

## Creating a Cache in Postgres

Just add the _UNLOGGED_ keyword when creating a table

```sql
CREATE UNLOGGED TABLE cache (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_cache_expires ON cache(expires_at);
```

You can insert new cache entries and resolve conflicts directly in the database.

```sql
INSERT INTO cache (key, value, expires_at)
VALUES ($1, $2, NOW() + INTERVAL '1 hour')
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value,
      expires_at = EXCLUDED.expires_at;
```

Read from your cache.

```sql
SELECT value FROM cache
WHERE key = $1 AND expires_at > NOW();
```

And periodically clean up.

```sql
DELETE FROM cache WHERE expires_at < NOW();
```

## Why does this work?

The secret is that _unlogged_ tables skip the _Write-Ahead-Log_ of the database.
And if you know anything about database internals you know how much time this saves you.

But as always when things look too good to be true, they aren't.
Unlogged tables come with some drawbacks you have to keep in mind:

- They don't survive crashes of the database.
- They won't get replicated.
- They aren't readable on replicas.

## Conclusion

If you're storing data that's nice to have but not critical like: caches, sessions, temporary scratch data - unlogged tables are a solid choice.
You get the familiar SQL interface without adding Redis to your stack, and the write performance is noticeably better than regular tables.

Just don't use them for anything you can't afford to lose.
