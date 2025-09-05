---
title: "LeetCode Problem 1: Two Sum"
author: Fabian Bull
pubDatetime: 2025-08-04T13:23:23Z
postSlug: leetcode-problem-1-two-sum
featured: false
draft: false
tags:
  - programming
  - programming challenges
  - leetcode
  - leetcode easy
  - rust
description: This article discusses solutions to the first LeetCode problem 'Two Sum'. The 'Two Sum' problem
---

Continuing with the [last post](./why-i-compete-in-project-euler), let's apply this mindset to a LeetCode problem: [_Two Sum_](https://leetcode.com/problems/two-sum).

**Problem Statement:**

> Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.
>
> You may assume that each input would have exactly one solution, and you may not use the same element twice.

## First Iteration: Brute Force Approach

Let's start with the simplest solution we can think of - checking every possible pair of numbers:

```rust
pub fn two_sum(nums: &[i32], target: i32) -> Vec<i32> {
    for (i, n) in nums.iter().enumerate() {
        for (j, m) in nums.iter().enumerate() {
            if n + m == target && i != j {
                return vec![j as i32, i as i32];
            }
        }
    }

    vec![]
}
```

This brute force approach is correct and easy to understand. It has **O(n²)** time complexity since we check every pair of numbers. However, we can definitely optimize this!

## Second Iteration: Hash Map with Two Passes

What if we could instantly look up whether a number exists in the array? A hash map allows O(1) lookups!

The key insight: for each number `n`, we need to find `target - n`. If we store all numbers in a hash map first, we can then quickly check for the complement of each number.

This approach uses two passes through the array:

```rust
fn two_sum(nums: &[i32], target: i32) -> Vec<i32> {
    let mut seen = HashMap::with_capacity(nums.len());
    for (i, n) in nums.iter().enumerate() {
        seen.entry(n).or_insert(i);
    }

    for (&n, &i) in seen.iter() {
        let hit = target - n;

        if let Some(&j) = seen.get(&hit) {
            return vec![j as i32, i as i32];
        }
    }
    vec![]
}
```

## Third Iteration: One-Pass Hash Map (Optimal)

The optimal solution combines building the hash map with searching for pairs. As we iterate through the array:

1. Check if the complement (`target - current_number`) exists in our hash map
2. If found, we have our answer!
3. If not found, add the current number to the hash map

This eliminates the need for a second pass:

```rust
fn two_sum(nums: &[i32], target: i32) -> Vec<i32> {
    let mut seen = HashMap::with_capacity(nums.len());

    for (i, n) in nums.iter().enumerate() {
        let hit = target - n;
        match seen.get(&hit) {
            Some(&j) => {
                return vec![j as i32, i as i32];
            }
            None => {
                seen.insert(n, i);
            }
        }
    }

    vec![] // No solution found (problem guarantees exactly one solution)
}
```

## Key Takeaways

- **Start simple**: Begin with a working brute force solution
- **Identify bottlenecks**: The nested loop was our performance issue
- **Use appropriate data structures**: Hash maps excel at fast lookups
- **Trade space for time**: Using O(n) space to achieve O(n) time
- **Iterate and optimize**: Each solution builds upon the previous one

This problem demonstrates a fundamental algorithmic pattern: using hash maps to trade space complexity for time complexity improvements.
