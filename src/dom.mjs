import { Ok } from "./gleam.mjs";

const supportedTags = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "math",
  "menu",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "picture",
  "portal",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "search",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "text",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
];

const supportedAttributes = [
  "accept",
  "accept_charset",
  "action",
  "alt",
  "autocomplete",
  "autofocus",
  "autoplay",
  "checked",
  "class",
  "classes",
  "cols",
  "controls",
  "disabled",
  "download",
  "enctype",
  "for",
  "form_action",
  "form_enctype",
  "form_method",
  "form_novalidate",
  "form_target",
  "height",
  "href",
  "id",
  "loop",
  "map",
  "max",
  "method",
  "min",
  "msg",
  "name",
  "none",
  "novalidate",
  "on",
  "pattern",
  "placeholder",
  "property",
  "readonly",
  "rel",
  "required",
  "role",
  "rows",
  "selected",
  "src",
  "step",
  "style",
  "target",
  "type_",
  "value",
  "width",
  "wrap",
];

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
      let attrValue = attr.value;
      let attrName = toSnakeCase(attr.name);
      if (attrName === "type") {
        attrName = "type_";
      }
      if (!supportedAttributes.includes(attrName)) {
        attrName = "attribute";
        attrValue = `${JSON.stringify(attrName)}, ${JSON.stringify(
          attr.value
        )}`;
      } else {
        attrValue = JSON.stringify(attrValue);
      }
      attrStrings.push(`attribute.${attrName.trim()}(${attrValue.trim()})`);
    }
    return attrStrings;
  }

  // Function to process a single node and its children
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return `text(${JSON.stringify(node.nodeValue)})`;
    }

    let tagName = toSnakeCase(node.tagName.toLowerCase());
    if (!supportedTags.includes(tagName)) {
      tagName = `element.element(${JSON.stringify(tagName)}, `;
    } else {
      tagName = `html.${tagName}(`;
    }
    const attributes = getAttributesString(node.attributes);
    const children = [];

    for (let child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim() === "") {
        continue;
      }
      children.push(processNode(child));
    }

    return `${tagName.trim()}[${attributes.join(", ")}], [${children
      .join(", ")
      .trim()}])`;
  }

  return processNode(node);
}

export function parse(html) {
  const parser = new DOMParser();

  return new Ok(
    domToString(parser.parseFromString(html, "text/html").body.firstChild)
  );
}

export function copyToClipboard(text) {
  const el = document.createElement("textarea");
  el.value = text;
  el.style.display = "none";
  document.body.appendChild(el);

  el.select();
  el.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(el.value);

  el.remove();

  return new Ok("copied");
}
