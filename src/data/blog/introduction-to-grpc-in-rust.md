---
title: Introduction to gRPC in Rust
author: Fabian Bull
pubDatetime: 2026-03-11
postSlug: introduces-to-grpc-in-rust
featured: true
draft: true
tags:
  - rust
  - programming
  - tokio
  - learning
  - grpc
description: This article gives a brieve introduces to gRPC using Rust.
---

Whatever

```toml file=Cargo.toml"
[package]
name = "grpc"
version = "0.1.0"
edition = "2024"

[dependencies]
prost = "0.14.3"
tokio = { version= "1.50.0", features = ["full"]}
tonic = "0.14.5"
tonic-prost = "0.14.5"

[[bin]]
name = "server"
path = "src/server.rs"

[[bin]]
name = "client"
path = "src/client.rs"

[build-dependencies]
tonic-prost-build = "0.14.5"
```
