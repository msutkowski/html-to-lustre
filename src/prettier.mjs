import * as prettier from "prettier";
import { Ok, Err } from "./gleam.mjs";

export function format(str) {
  prettier
    .format(str, { semi: false, parser: "babel" })
    .then((result) => new Ok(result))
    .catch((error) => new Err(error));
}
