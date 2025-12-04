# Tests

End-to-end tests using Playwright and Deno's built-in testing framework.

## Setup

Before running tests for the first time, install Playwright browsers:

```bash
deno run -A npm:playwright@1.48.2 install chromium
```

## Running Tests

Make sure the development server is running in one terminal:

```bash
deno task start
```

Then run the tests in another terminal:

```bash
deno task test
```
