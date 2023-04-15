Blocking methods execute synchronously and non-blocking methods execute asynchronously.

# Blocking
Blocking is when the execution of additional JavaScript in the Node.js process must wait until a non-JavaScript operation completes. This happens because the event loop is unable to continue running JavaScript while a blocking operation is occurring.

[libuv](https://libuv.org/)

Asynchronous I/O made simple.
libuv is a multi-platform support library with a focus on asynchronous I/O.

# Comparing Code
Blocking methods execute synchronously and non-blocking methods execute asynchronously.
Using the File System module as an example, this is a synchronous file read:

<pre> 
const fs = require("fs");
const data = fs.readFileSync("/file.md"); // blocks here until file is read
</pre>

And here is an equivalent asynchronous example:

<pre>
const fs = require("fs");
fs.readFile("/file.md", (err, data) => {
  if (err) throw err;
});
</pre>

JavaScript execution in Node.js is single threaded, so concurrency refers to the event loop's capacity to execute JavaScript callback functions after completing other work. Any code that is expected to run in a concurrent manner must allow the event loop to continue running as non-JavaScript operations, like I/O, are occurring.

As an example, let's consider a case where each request to a web server takes 50ms to complete and 45ms of that 50ms is database I/O that can be done asynchronously. Choosing non-blocking asynchronous operations frees up that 45ms per request to handle other requests. This is a significant difference in capacity just by choosing to use non-blocking methods instead of blocking methods.


# Dangers of Mixing Blocking and Non-Blocking Code

There are some patterns that should be avoided when dealing with I/O. Let's look at an example:

<pre>
const fs = require("fs");
fs.readFile("/file.md", (err, data) => {
if (err) throw err;
console.log(data);
});
fs.unlinkSync("/file.md");
</pre>

In the above example, fs.unlinkSync() is likely to be run before fs.readFile(), which would delete file.md before it is actually read. A better way to write this, which is completely non-blocking and guaranteed to execute in the correct order is:

<pre>
const fs = require("fs");
fs.readFile("/file.md", (readFileErr, data) => {
if (readFileErr) throw readFileErr;
console.log(data);
fs.unlink("/file.md", (unlinkErr) => {
if (unlinkErr) throw unlinkErr;
});
});
</pre>

The above places a non-blocking call to fs.unlink() within the callback of fs.readFile() which guarantees the correct order of operations.

Credit:
[node.js org guide](https://nodejs.org/en/docs/guides/blocking-vs-non-blocking)