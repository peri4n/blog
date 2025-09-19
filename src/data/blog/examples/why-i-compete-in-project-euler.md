---
title: Why I compete in Project Euler.
author: Fabian Bull
pubDatetime: 2025-08-01T13:23:23Z
postSlug: why-i-compete-in-project-euler
featured: false
draft: false
tags:
  - programming
  - programming challenges
description: This article explaines my motivation to compete in Project Euler.
---

### TLDR;

1. [It's a nice break from day to day programming.](#its-a-nice-break-from-my-day-to-day-programming)
2. [It forces you to structure your problem solving approach.](#it-forces-you-to-structure-your-problem-solving-approach)
3. [You learn a lot along the way.](#you-learn-a-lot-along-the-way)

But let me explain it in a little more detail.

## It's a nice break from my day to day programming

This point probably needs no further discussion.
Every programmer knows the frustrations of working in tech: meetings, changing requirements, failing infrastructure, and the list goes on and on.
Doing something that doesn't require spawning 100 Docker containers adds some much-needed simplicity to my life — something I'm very thankful for.

## It forces you to structure your problem solving approach

If you enjoy solving programming problems, you already know about platforms like [Advent of Code](https://adventofcode.com).
But the challenges on [Project Euler](https://projecteuler.net) are very unique.
They all focus on (seemingly) simple math.

Start at [Problem 1](https://projecteuler.net/problem=1), and you are faced with a very simple challenge:

> If we list all the natural numbers below that are multiples of 3 or 5, we get 3, 5, 6 and 9. The sum of these multiples is 23.
>
> Find the sum of all the multiples of 3 or 5 below 100.

Looking at that challenge, my first instinct was to write a straightforward solution in [Rust](https://rust-lang.org) that looked something like:

```rust
fn multiples_of_3_and_5() -> i32 {
    (1..1000).filter(|n| n % 3 == 0 || n % 5 == 0).sum()
}

```

This solves the problem and I can't stress this enough: This is good code.
It has been my solution to the problem for years.
It's easy to read, [simple](https://youtu.be/SxdOUGdseq4) and fast.
Only while writing this article did I challenge myself to see if I could improve it.

In our case, solving the problem is not the reason why we are here; we want to spark our curiosity.
So how would we do this? Is there a way to compute this in a smarter way?

So instead of brute-forcing our way through all numbers, we might be more efficient by generating the multiples of 3 and 5:

```rust
fn multiples_of_3_and_5_next() -> u32 {
    let limit = 1000;
    let mut sum = 0;

    // Add multiples of 3
    let mut i = 3;
    while i < limit {
        sum += i;
        i += 3;
    }

    // Add multiples of 5 that are not also multiples of 3
    let mut j = 5;
    while j < limit {
        if j % 3 != 0 {
            sum += j;
        }
        j += 5;
    }

    sum
}
```

That's a lot more code and I'd argue that it is a lot harder to read.
But if we only focus on performance (_which you should not_) this _might_ be better.

And to bring my point home once again: Is there a way to make this even smarter?
Sure there is. You can compute the sum of all multiples by using the sum of [1+2+3+4+...](https://en.wikipedia.org/wiki/1_%2B_2_%2B_3_%2B_4_%2B_%E2%8B%AF) and up with:

```rust
fn sum_multiples(n: u32, limit: u32) -> u32 {
    let count = (limit - 1) / n;
    n * count * (count + 1) / 2
}

fn multiples_of_3_and_5_next2() -> u32 {
    let limit = 1000;
    sum_multiples(3, limit) + sum_multiples(5, limit) - sum_multiples(15, limit)
}
```

At this point, I hope it's clear just how much thought a seemingly simple challenge can provoke.
This iterative process is the essence of what makes great programmers. **Always start with the _simplest_ possible solution and iterate from there.**
Or another way to put it: **Always stay curious**.

## You learn a lot along the way.

As you have witnessed, solving this simple math problem taught you that you can compute the sum of all natural numbers within a range in _constant_ rather than _linear_ time.

These small insights happen quite often when you work on such problems.
They might seem insignificant now, but there might come a situation where this turns out to be super helpful.
Plus, they are always a _cool_ party trick.
Okay, maybe not every party — but the right kind!

## Final thoughts

Whether you're trying to sharpen your problem-solving skills, learn more math, or just enjoy a few quiet moments of coding for its own sake—Project Euler delivers.

Give it a shot.
Start at Problem 1.
You might not want to stop.
