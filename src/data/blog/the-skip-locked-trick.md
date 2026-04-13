---
title: The SKIP LOCKED trick
author: Fabian Bull
pubDatetime: 2026-04-13
postSlug: the-skip-locked-trick
featured: false
draft: false
tags:
  - database
  - today-i-learned
  - postgres
description: This article explains the SKIP LOCKED trick which allows you to skip currently locked rows in a database.
---

# The Problem

Have you ever implemented a job queue using a database table?
It's a pretty straightforward task if there is only a single consumer.
In today's Age of Microservices, you often have multiple processes concurrently accessing the same table, complicating things a little.

This article describes a typical pitfall you might run into and how to fix it.

## Generating Sample Data

I'd like my articles to be self-contained so first let's spin up a database if you haven't already.
The cool kids today do this with Docker:

```sh
docker run --name pg-lock-demo \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -d postgres:18
```

After the download is complete you can start your Postgres session via:

```sh
docker exec -it pg-lock-demo psql -U postgres
```

To create the table and insert sample data, run:

```sql
DROP TABLE IF EXISTS jobs;

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    payload TEXT,
    status TEXT DEFAULT 'pending'
);

INSERT INTO jobs (payload, status)
SELECT
    'job ' || gs,
    CASE
        WHEN gs % 3 = 0 THEN 'processing'
        ELSE 'pending'
    END
FROM generate_series(1, 20) AS gs;

SELECT * FROM jobs;
```

## Running Into The Problem

Now let's simulate two concurrently running transactions.
If you run the following command in two separate terminal sessions, you might be surprised (notice the session doesn't get committed).

```sql
BEGIN;

SELECT * FROM jobs
WHERE status = 'pending'
ORDER BY id
LIMIT 1
FOR UPDATE;
```

The _first_ session prints out the next job to run.
The _second_ session just blocks and prints nothing.
Why is that?

The first session acquires a lock for each of the selected rows and only allows access to these rows when the transaction is committed.
If you type `commit;` into the first session, the second session will happily take over and print all selected rows.

As you can see, the database blocks all concurrent access which in turn leads to poor performance.

## Solving it using SKIP LOCKED

If only there was a way to tell the database to skip the locked rows 😂.
Turns out there is:

```sql
SELECT * FROM jobs
WHERE status = 'pending'
ORDER BY id
LIMIT 1
FOR UPDATE SKIP LOCKED;
```

If you repeat the experiment with this command you will see that the second session isn't blocking anymore.
Instead the database skips all the currently locked rows and returns the first unlocked row.

## Conclusion

So to fetch the next job to process, the following query should come in handy:

```sql
WITH cte AS (
    SELECT id
    FROM jobs
    WHERE status = 'pending'
    ORDER BY id
    LIMIT 1
    FOR UPDATE SKIP LOCKED
)
UPDATE jobs
SET status = 'processing'
FROM cte
WHERE jobs.id = cte.id
RETURNING jobs.*;
```
