import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Markdown(props: any) {
  return (
    <ReactMarkdown children={props.content} remarkPlugins={[remarkGfm]} />
  );
}

export default Markdown;
