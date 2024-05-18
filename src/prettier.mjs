import * as prettier from "prettier";
import * as babel from "prettier/plugins/babel.mjs";
import * as estree from "prettier/plugins/estree.mjs";
import * as html from "prettier/plugins/html.mjs";
import { Ok, Error } from "./gleam.mjs";

export function format(str, msg, dispatch) {
  prettier
    .format(str, {
      semi: false,
      parser: "babel",
      plugins: [babel, estree, html],
    })
    .then((value) => {
      dispatch(msg(new Ok(value)));
    })
    .catch((error) => {
      dispatch(msg(new Error(error)));
    });
}
