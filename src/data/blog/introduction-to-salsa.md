---
title: Introduction to Salsa
author: Fabian Bull
pubDatetime: 2026-10-31
postSlug: introduction-to-salsa
featured: true
draft: false
tags:
  - programming
  - rust
description: This article gives an introduction to the Salsa Rust crate.
---

_Disclaimer: This is not about dancing. This is about the Rust crate [Salsa](https://crates.io/crates/salsa)_.

Let's say your boss comes to you and wants you to compute $(a+b)+(c+d)$, with $a$, $b$, $c$ and $d$ being arbitrary integers.
Using your college math skills, you figure out: First you compute the left parenthesis, then you compute the right parenthesis and then you add both results.
But then your boss tells you that all of these numbers are constantly changing, so you do what every good engineer does: you introduce a cache.

That's pretty much what _Salsa_ is: a cache for incremental computations.
It's often used in the context of compilers and LSPs like [rust-analyzer](https://github.com/rust-lang/rust-analyzer)
All of the tutorials I found add the overhead of "Let's build a small calculator language."
So I asked myself what a minimal example actually looks like, and that is what I came up with.

## Imports

You need them to please the compiler.
I won't talk about them from here on out.

```rust
use salsa::{Event, EventKind, Setter};
```

## Inputs

_Inputs_ are Salsa's way of, you guessed it, defining the inputs to your computation.
In our case, that's a struct holding all input numbers.

```rust
#[salsa::input(debug)]
struct Formula {
    pub a: u32,
    pub b: u32,
    pub c: u32,
    pub d: u32,
}
```

## Queries

Given your input, you can derive other information.
This information can be queried at any time.

```rust
// Computes the left parenthesis
#[salsa::tracked]
fn left(db: &dyn salsa::Database, f: Formula) -> u32 {
    f.a(db) + f.b(db)
}

// Computes the right parenthesis
#[salsa::tracked]
fn right(db: &dyn salsa::Database, f: Formula) -> u32 {
    f.c(db) + f.d(db)
}

// Adds both parentheses
#[salsa::tracked]
fn total(db: &dyn salsa::Database, f: Formula) -> u32 {
    left(db, f) + right(db, f)
}
```

Note that we don't access the values directly from the structs but rather ask the database about the current values.
What's that database, I hear you asking? Look no further!

## Salsa setup

Salsa stores everything in a thing it calls _Database_.
Note that most of the code adds logging of the internals.
We need this to understand how Salsa computes things later on.

```rust
#[salsa::db]
#[derive(Clone)]
struct Db {
    storage: salsa::Storage<Self>,
}

impl Db {
    fn with_logging() -> Self {
        Self {
            storage: salsa::Storage::new(Some(Box::new(log_event))),
        }
    }
}

#[salsa::db]
impl salsa::Database for Db {}

fn log_event(event: Event) {
    match event.kind {
        // The query's function body is about to run.
        EventKind::WillExecute { database_key } => {
            println!("    [recompute] {database_key:?}");
        }
        // Salsa checked the query's dependencies, found them unchanged,
        // and reused the cached value without running the body.
        EventKind::DidValidateMemoizedValue { database_key } => {
            println!("    [reuse]     {database_key:?}");
        }
        _ => {}
    }
}
```

## Demo

Given all of this, we can evaluate our formula.

```rust
fn eval(db: &Db, f: Formula, step: &str) {
    println!("{step}");
    let result = total(db, f);
    println!(
        "  ({} + {}) + ({} + {}) = {result}\n",
        f.a(db),
        f.b(db),
        f.c(db),
        f.d(db)
    );
}

fn main() {
    let mut db = Db::with_logging();
    let f = Formula::new(&db, 1, 2, 3, 4);

    eval(&db, f, "1. first evaluation: everything is computed");

    eval(&db, f, "2. nothing changed: no events at all, cached result returned");

    f.set_a(&mut db).to(10);
    eval(&db, f, "3. a := 10: left and total recompute, right is reused");

    f.set_d(&mut db).to(40);
    eval(&db, f, "4. d := 40: right and total recompute, left is reused");

    f.set_a(&mut db).to(5);
    f.set_b(&mut db).to(7);
    eval(&db, f, "5. a := 5, b := 7 (a + b still 12): left recomputes, total is reused");
}
```

And like absolute magic, Salsa provided the correct output and cached every intermediate step.
Even in step 5, where a and b both changed, Salsa is smart enough to skip recomputing total: left had to rerun, but it still returned 12, so nothing total depends on actually changed.
You can verify this by looking at the output.

```text
1. first evaluation: everything is computed
    [recompute] total(Id(0))
    [recompute] left(Id(0))
    [recompute] right(Id(0))
  (1 + 2) + (3 + 4) = 10

2. nothing changed: no events at all, cached result returned
  (1 + 2) + (3 + 4) = 10

3. a := 10: left and total recompute, right is reused
    [recompute] left(Id(0))
    [recompute] total(Id(0))
    [reuse]     right(Id(0))
  (10 + 2) + (3 + 4) = 19

4. d := 40: right and total recompute, left is reused
    [reuse]     left(Id(0))
    [recompute] right(Id(0))
    [recompute] total(Id(0))
  (10 + 2) + (3 + 40) = 55

5. a := 5, b := 7 (a + b still 12): left recomputes, total is reused
    [recompute] left(Id(0))
    [reuse]     right(Id(0))
    [reuse]     total(Id(0))
  (5 + 7) + (3 + 40) = 55
```

## Outro

I hope you got my point.
_Salsa_ looks much more intimidating than it actually is.
Granted, I left out a lot, but this is only meant to be a starting point.
If you want to know more, check out the [Salsa Book](https://salsa-rs.github.io/salsa) and start to build things.

Have a good one and see you next time.
