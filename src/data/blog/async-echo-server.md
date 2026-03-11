---
title: "Building My First Async Echo Server with Tokio"
author: Fabian Bull
pubDatetime: 2025-09-19T14:23:23Z
postSlug: async-echo-server
featured: true
draft: false
tags:
  - rust
  - programming
  - tokio
  - learning
  - echo-server
  - async
description: This article describes how I implement the hello world of systems programming, an async echo server in Rust.
---

The first project on my [Tokio learning](learning-tokio) path was an echo server.
The idea is simple: accept a TCP connection, read incoming lines, and send them straight back to the client; the _HelloWorld_ of systems programming.

Here is the full code I ended up with:

```rust
use tokio::io;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};

#[tokio::main]
async fn main() -> io::Result<()> {
    // (1) Bind a TCP listener to localhost on port 3000
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await?;

    loop {
        // (2) Wait for an incoming connection
        let (mut socket, addr) = listener.accept().await?;
        println!("New connection at {}", addr);

        // (3) Spawn a new async task to handle the connection
        tokio::spawn(async move {
            // (4) Split the socket into a reader and writer
            let (reader, mut writer) = socket.split();
            let mut buf = String::with_capacity(1024);
            let mut reader = BufReader::new(reader);
            println!("Starting to echo data for {}", addr);

            // (5) Read incoming lines in a loop
            while let Ok(_bytes) = reader.read_line(&mut buf).await {
                // (6) Allow clients to exit by typing "quit"
                if buf.trim() == "quit" {
                    break;
                }

                // (7) Write the received line back to the client
                writer.write_all(buf.as_bytes()).await.unwrap();
                buf.clear();
            }

            // (8) Print a message when the connection closes
            println!("Connection at {} closed", addr);
        });
    }
}
```

---

## Walking Through the Code

1. **Binding a listener**: TcpListener::bind tells Tokio to listen for TCP connections on port 3000. Because it is async, we await it.
2. **Accepting connections**: The accept call blocks (asynchronously) until a new client connects. It gives us both the socket and the client address.
3. **Spawning tasks**: Each connection runs in its own task thanks to tokio::spawn. This way, multiple clients can connect at the same time without blocking each other.
4. **Splitting the socket**: Splitting the socket into a reader and writer allows us to read and write independently. Wrapping the reader in a BufReader makes reading lines easier.
5. **Reading lines**: read_line waits until the client sends a full line (ending with \n). We reuse the same buffer for each message.
6. **Quit condition**: If a client types quit, we break out of the loop and close the connection.
7. **Echoing messages**: The server writes the same line back using write_all. Because we clear the buffer after each loop, the next line starts fresh.
8. **Connection closed**: When the loop ends, we log that the client disconnected.

---

## Testing the Echo Server

Once the server is running (`cargo run`), you can connect to it using `nc` (netcat):

```bash
nc 127.0.0.1 3000
```

Type any line and press Enter. You should see the same line echoed back. To disconnect, type:

```bash
quit
```

This manual testing is a simple way to verify that the server correctly echoes lines.
You can even start multiple `nc` sessions to test if the server handles multiple clients concurrently.

---

## Things I Learned

- **Tokio tasks are lightweight:** I can spawn a new task for every client, and Tokio schedules them efficiently.
- **Splitting sockets is convenient:** I can split a socket, allowing me to read and write. At some point I'd like to understand what happens under the curtain.
- **Async I/O feels natural after a while:** At first await everywhere looked noisy, but it quickly started to make sense.
- **Even simple servers need cleanup:** Without clearing the buffer, messages would have been repeated incorrectly.

This project was small, but it gave me a good taste of writing async code in Rust.
