# Fantastic Streams and where to find them

What problems they solve? What exactly is a stream? Where they live? This and more on this post.
But let's take a step back and look at common problem where streams shine.

Let's imagine that we have to read a large dataset from a file or a database and do something with it.
If you try to fetch it like this:

```js
const response = await fetch("/large-dataset");
const largeDataset = await response.json();
doSomething(largeDataset);
```

Depending on your memory you'll either get an `out of memory error` or wait for a some time untill the program can do anything.

Here is what large dataset do to our program:
![Excessevely large dataset crushing your program's memory](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Feje4t7pp779dkzpipp7j.png)

What if instead of reading the entire dataset at once we could read it chunk by chunk as soon as it's available?

Like this:
![Chunks entering your memory to be proccessed](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Frke19afp3gjgvpdi73ab.png)

## What exactly is a stream?

As popularly quoted “streams are arrays over time.”

Or if you prefer a more fancy description:

> In computer science, a stream is a sequence of potentially unlimited data elements made available over time.

by [Wikipedia](<https://en.wikipedia.org/wiki/Stream_(computing)>):

### With Streams

Some common use cases are:

- handling multimedia
- reading and writing large files
- compression and decompression
- encryption
- networking

If you use the fetch API you already use streams, you may have done something like this.

```js
const response = await fetch(url);
const { body } = response;
const parsed = await body.json();
```

This `body` property is a Readable Stream, more on this later, of bits.

```js
const { body } = response;
```

The `.json()` method will wait for the response to end and then parse the whole response.

```js
const parsed = await body.json();
x;
```

But if you're expecting a very big response or just want a more seamsless response to the user, we can use streams and start processing the data chunk by chunk.
Now if you're convinced or not... let's dive deeper into streams concepts.

Just an observation, NodeJS Streams are different from their WEB Standard cousin, I'll try to explain their difference in this post.

## Concepts

There are 2 Types of streams Readable and Writable and the combination of both the Transform Stream on the Web or Duplex in NodeJS

### Types of Streams

#### Readable

It's the input equivalent of streams. Some examples of ReadableStreams in the wild is the response.body in our previous example and http.IncomingMessage in NodeJS

```js
import http from "node:http";
const server = http.createServer();
server.on("request", (request, response) => {
  request.on("data", (chunk) => handleChunk(chunk));
});
```

#### Writable

It's the output equivalent of streams. Some examples of WritableStreams in the wild is the response object in the http module

```js
import http from "node:http";
const server = http.createServer((request, response) => {
  request.on("data", (chunk) => readChunk(chunk));
});
```

#### Transform

The combination of both
In NodeJS we call them Duplex, some examples of Transform streams in the wild is the Socket class in the net module:

```js
import http from "node:http";
const server = http.createServer((request, response) => {
  response.write("<h1>Fantastic Streams and Where To Find Them</h1>");
});
```

### Chunks

The unit of data in the stream, in a network it wil be a *bit* but you can create streams for bigger data.

### Teeing

The ability to create a duplicate of a stream, there's no native teeing in node streams.

### Pipe Chains

The ability to chain streams into one another, very useful to change read streams before writing.

## Show me the code

Okay we will apply all this concepts by creating a small app that will read a very large file and display the result chunk by chunk on html.

Let's first assume we have a very big file consisting of multiple json entries of

```json
{ "id": "1", "timestamp": "2025-02-13T13:56:41.420Z", "value": "355.66" }
```

I've also set up a vanilla node server, serve a html from get '/'

## Recap

If you could leave this post with a few points, use streams when you want to:

- optimize memory usage
- process large datasets
- realtime data processing

## Bonus

Thanks for taking all the way down here, since you're already here bonus content, while trying to create the script for create_really_big_file.js, I've also dealt with out of memory errors

- You can't live the file connection open
- And memoery is not infinite haha

```
<--- JS stacktrace --->

FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```
