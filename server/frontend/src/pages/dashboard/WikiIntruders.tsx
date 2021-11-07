import React, { useState, useEffect } from "react";
import ReactMarkdown from "../../components/dashboard/Markdown";

let content = `
A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |`;

function WikiIntruders() {
  return <ReactMarkdown content={content} />;
}

export default WikiIntruders;
