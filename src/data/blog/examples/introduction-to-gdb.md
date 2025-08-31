---
title: Introduction to GDB
author: Fabian Bull
pubDatetime: 2024-12-10T13:23:23Z
postSlug: introduction-to-gdb
featured: false
draft: true
tags:
  - Rust
  - Debug
  - GDB
description: Introduction to the word of debugging in GDB.
---

I started my career in a company with a giant Java code base; 3 million lines of code at the time.
I can still remember the feeling of being completely overwhelmed.
When I was assigned my first bug ticket I had no idea how to fix it.
Telling my team lead how I felt he just responded: _"Have you started to debug it?"_.

I was aware that debuggers existed but had never used one.
He showed me, how to attach my then editor IntelliJ to a running JVM and I managed to fix the problem in no time.
Ever since, I consider debugging one of the most useful skills in programming.

However, dropping IntelliJ as an editor (in favor of NeoVim) and moving to Rust as my main language, I had to learn a new set of tools.
This article summarizes my very first steps on this journey.

## An Example

Let's say you have some very basic Rust code:

```rust
// file: src/main.rs
fn compute(x: i32, y: i32) -> i32 {
    let x = x + 2;
    let y = y + 3;
    x + y
}

fn main() {
    println!("Hello World");
    println!("{}", compute(2, 3));
}
```

And you want to follow the execution of the program, line by line.

To start the debugger (GDB in this case), you first have to build an executable.
Running `cargo build` will create an executable like `target/debug/gdb-example`.
To start the debugger run `gdb target/debug/gdb-example` and you will be greeted with a _REPL_.

## The REPL

The GDB REPL has so many features, you can talk for hours but here is a list of the most important commands.

### Run

If you type `run` into the REPL the program runs and prints 10 on the screen; no surprise.
What's the point you ask?
It will all make sense once we introduce _breakpoints_.

### Start

If you type `start` you'll get a different behavior.
The program will halt at the first line of the `main` function, line 8 of `main.rs`.
From here you can progressively execute each individual line of your program, step by step.

### Stepping

There are several ways to step through a program:

To execute the current line and jump to the next, run `next` or `n` for short.
This will jump you to line 9.
Here you have several options.
You can run `next` again to execute the line and jump to the next, or you can run `step` (or s for short) to jump into the `compute` function getting called on line 9.
Once you are in a function a new execution context, also called _frame_.
If you want to quickly get out of it (also called dropping the frame), you can run `finish`.
After you are done with your investigation and want the program to continue running until it ends, execute `continue` or short `c`.

This way you can step-by-step understand exactly what your program is doing.

### Breakpoints

Stepping through an entire program flow is great but it is not a very common use case.
Most of the time you debug a program, you already have some sense of area where the bug is.
This is where breakpoints enter the arena.

Before you `run` the program, you can add a breakpoint at any location in your source.
To jump directly to line 9 of `main.rs` you run: `breakpoints main.rs:9` or `b main.rs:9` in short.
If you `run` the program now, you will not start at line 8 but at line 9.

To get a list of all breakpoints run: `info breakpoints`.
This list not only shows the location where the breakpoint is located but also its index.
If you don't need a certain breakpoint anymore you run `delete breakpoints 3` (This will remove the third breakpoint).
