---
title: "LeetCode Problem 1: Two Sum"
author: Fabian Bull
pubDatetime: 2025-08-04T13:23:23Z
postSlug: leetcode-problem-1-two-sum
featured: true
draft: false
tags:
  - programming
  - programming challenges
  - leetcode
  - leetcode easy
  - rust
description: This article disucsses solutions to the first LeetCode problem 'Two Sum'. The 'Two Sum' problem
---

Continuing with the [last post](./why-i-compete-in-project-euler), let's try to apply this mindset to a LeetCode Problem: [_Two Sum_](https://leetcode.com/problems/two-sum):

> Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

## First Iteration

Let's start with the simplest solution we can come up with:

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

That's a correct solution and easy to read. However, can we do better?

## Second Iteration

Imagine you already knew which numbers are in the array.
Would it help you to solve the problem? Sure!
You could iterate over each element and check if the `target - current_value` is in the array.
If so, you found a match:

Luckily, you can build this information in linear time:

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

## Third Iteration

The final iteration arises when you realize, that while preprocessing the array, you can already check for hits:

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

    vec![]
}
```
