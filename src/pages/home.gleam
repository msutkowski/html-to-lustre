import config.{type Config}
import lustre/attribute.{class}
import lustre/effect.{type Effect}
import lustre/element.{type Element, text}
import lustre/element/html.{button, div, h1, span, svg, textarea}
import lustre/element/svg.{path}
import lustre/event

pub type Model {
  Model(config: Config, input_html: String, output_html: String)
}

pub opaque type Msg {
  SetHTML(String)
}

pub fn init(config: Config) -> Model {
  Model(config: config, input_html: "", output_html: "")
}

pub fn on_load(_config: Config) -> Effect(Msg) {
  effect.none()
}

pub fn update(msg: Msg, model: Model) -> #(Model, Effect(Msg)) {
  case msg {
    SetHTML(html) -> {
      case parse_dom(html) {
        Ok(dom) -> {
          #(Model(..model, input_html: html, output_html: dom), effect.none())
        }
        Error(err) -> {
          #(Model(..model, input_html: html, output_html: err), effect.none())
        }
      }
    }
  }
}

pub fn view(model: Model) -> Element(Msg) {
  div([], [
    div([class("bg-indigo-500 py-4 px-2")], [
      h1([class("text-white")], [text("html-to-lustre")]),
    ]),
    div([class("flex mt-2")], [
      div([class("w-1/2 p-2")], [
        div([class("font-bold mr-2 my-3")], [text("Input HTML")]),
        textarea(
          [class("w-full h-full border-2"), event.on_input(SetHTML)],
          model.input_html,
        ),
      ]),
      div([class("w-1/2 p-2")], [
        span([class("font-bold mr-2 my-3")], [text("Output Lustre")]),
        button(
          [
            class(
              "inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
            ),
          ],
          [text("Copy"), clipboard_svg()],
        ),
        div([class("border-2 p-2 mt-2 bg-gray-800 h-full text-white")], [
          text(model.output_html),
        ]),
      ]),
    ]),
  ])
}

fn clipboard_svg() -> Element(Msg) {
  svg(
    [
      attribute.attribute("xmlns", "http://www.w3.org/2000/svg"),
      attribute.attribute("fill", "none"),
      attribute.attribute("viewBox", "0 0 24 24"),
      attribute.attribute("stroke-width", "1.5"),
      attribute.attribute("stroke", "currentColor"),
      attribute.attribute("class", "w-6 h-6"),
    ],
    [
      path([
        attribute.attribute("stroke-linecap", "round"),
        attribute.attribute("stroke-linejoin", "round"),
        attribute.attribute(
          "d",
          "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z",
        ),
      ]),
    ],
  )
}

@external(javascript, "../dom.mjs", "parse")
fn parse_dom(html: String) -> Result(String, String) {
  Error("not implemented")
}
