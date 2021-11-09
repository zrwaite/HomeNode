import React, { useState, useEffect } from "react";
import ReactMarkdown from "../../components/dashboard/Markdown";

let content = ``;

function WikiPlant() {
  return <ReactMarkdown content={content} />;
}

export default WikiPlant;
