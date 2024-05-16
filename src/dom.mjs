import { Ok } from "./gleam.mjs";

function domToString(node) {
  if (!node) return "";

  // Function to convert strings to snake case
  function toSnakeCase(str) {
    return str
      .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      .replace(/-/g, "_")
      .toLowerCase();
  }

  // Function to convert attributes into the desired format
  function getAttributesString(attributes) {
    const attrStrings = [];
    for (let attr of attributes) {
      let attrName = toSnakeCase(attr.name);
      if (attrName === "type") {
        attrName = "type_";
      }
      attrStrings.push(`attribute.${attrName}(${JSON.stringify(attr.value)})`);
    }
    return attrStrings;
  }

  // Function to process a single node and its children
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return JSON.stringify(node.nodeValue);
    }

    const tagName = toSnakeCase(node.tagName.toLowerCase());
    const attributes = getAttributesString(node.attributes);
    const children = [];

    for (let child of node.childNodes) {
      children.push(processNode(child));
    }

    return `html.${tagName}([${attributes.join(", ")}], [${children.join(
      ", "
    )}])`;
  }

  return processNode(node);
}

export function parse(html) {
  const parser = new DOMParser();

  return new Ok(
    domToString(parser.parseFromString(html, "text/html").body.firstChild)
  );
}
