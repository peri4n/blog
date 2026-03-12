---
title: Introduction to gRPC in Rust
author: Fabian Bull
pubDatetime: 2026-03-11
postSlug: introduction-to-grpc-in-rust
featured: true
draft: false
tags:
  - rust
  - programming
  - tokio
  - learning
  - grpc
description: This article gives a brief introduction to gRPC using Rust.
---

I am a huge fan of [gRPC][1] and as such I wanted to test out how easy it is to get going in Rust.
So I set out and implemented the canonical "Hello World" server/client example given the following ProtoBuf:

```proto file=proto/greeter.proto
syntax = "proto3";

package greeter;

service Greeter {
    rpc SayHello (HelloRequest) returns (HelloReply);
}

message HelloRequest {
    string name = 1;
}

message HelloReply {
    string message = 1;
}

```

# Setup

If you hear "gRPC" and "server" you might already guess the two crates we rely on: [tonic][2] and [tokio][3].
To compile the ProtoBuf into Rust structs we also need [prost][4].
You can add all those dependencies using cargo:

- `cargo add prost tonic tonic-prost`
- `cargo add tokio -F full`
- `cargo add --build tonic-prost-build`

And should end up with a `Cargo.toml` like:

```toml file=Cargo.toml
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

To compile the ProtoBuf you need a `build.rs` in your project root:

```rust file=build.rs
fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_prost_build::compile_protos("proto/greeter.proto")?;
    Ok(())
}
```

# The Server

So let's start to implement the actual server:

```rust file=src/server.rs
use greeter::greeter_server::{Greeter, GreeterServer};
use greeter::{HelloReply, HelloRequest};
use tonic::{Request, Response, Status, transport::Server};

pub mod greeter {
    // Makes all your ProtoBuf models available
    tonic::include_proto!("greeter");
}

#[derive(Debug, Default)]
pub struct SimpleServer;

#[tonic::async_trait]
impl Greeter for SimpleServer {
    async fn say_hello(
        &self,
        request: Request<HelloRequest>,
    ) -> Result<Response<HelloReply>, Status> {
        println!("Got a request: {:?}", request);
        let reply = greeter::HelloReply {
            message: format!("Hello, {}!", request.into_inner().name),
        };
        Ok(Response::new(reply))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("GreeterServer listening on [::1]:50051");
    let addr = "[::1]:50051".parse()?;
    Server::builder()
        .add_service(GreeterServer::new(SimpleServer))
        .serve(addr)
        .await?;
    Ok(())
}
```

There is some Rust magic happening here, with macros like `async_trait` but the overall logic is simple:

1. Create a struct that holds all your state. In our case, _SimpleServer_ has no state.
2. Implement the generated service trait for your struct.
3. Register your struct as a service to the server.

It's very easy to read and easy to adjust to your needs.

# The Client

Like you have experienced with any API before:

1. You create a client.
2. You call a method on the client that executes the request against the server.

```rust file=src/client.rs
use greeter::HelloRequest;
use greeter::greeter_client::GreeterClient;
use tonic::transport::Channel;

pub mod greeter {
    // Makes all your ProtoBuf models available
    tonic::include_proto!("greeter");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("GreeterClient connecting to [::1]:50051");
    let channel = Channel::from_static("http://[::1]:50051").connect().await?;
    let mut client = GreeterClient::new(channel);
    let request = tonic::Request::new(HelloRequest {
        name: "Tonic".into(),
    });
    let response = client.say_hello(request).await?;
    println!("RESPONSE={:?}", response);
    Ok(())
}
```

And in case you are wondering about resource cleanup.
All this is handled by Rust when the variables get out of scope.

# Testing

To see your server and client in action you can open two terminal sessions.
In the first one you start the server with `cargo run --bin server`.
In the second you can fire requests against the server with: `cargo run --bin client`.

On the server you should see something like:

```
GreeterServer listening on [::1]:50051
Got a request: Request { metadata: MetadataMap { headers: {"te": "trailers", "content-type": "application/grpc", "user-agent": "tonic/0.14.5"} }, message: HelloRequest { name: "Tonic" }, extensions: {tonic::transport::server::conn::TcpConnectInfo, axum::routing::url_params::UrlParams} }
```

After executing the client you should see something like:

```
GreeterClient connecting to [::1]:50051
RESPONSE=Response { metadata: MetadataMap { headers: {"content-type": "application/grpc", "date": "Thu, 12 Mar 2026 08:02:04 GMT", "grpc-status": "0"} }, message: HelloReply { message: "Hello, Tonic!" }, extensions: {} }
```

I hope this was helpful. You can look at even more examples [here][5].
As always, you can find the final code at [my repo][6].

[1]: https://grpc.io/
[2]: https://docs.rs/tonic/latest/tonic/
[3]: https://docs.rs/tokio/latest/tokio/
[4]: https://docs.rs/prost/latest/prost/
[5]: https://github.com/hyperium/tonic/tree/master/examples
[6]: https://github.com/peri4n/learning-rust/tree/main/grpc
