module.exports = grammar({
  name: "chicory",
  extras: ($) => [/\s/, $.comment],

  conflicts: ($) => [
    [$._type_expression, $.adt_option]
  ],

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice($.const_declaration, $.let_assignment, $.type_definition),

    let_assignment: ($) =>
      seq(
        "let",
        field("name", $.identifier),
        "=",
        field("value", $._expression),
      ),

    const_declaration: ($) =>
      seq(
        "const",
        field("name", $.identifier),
        "=",
        field("value", $._expression),
      ),

    type_definition: ($) =>
      seq(
        "type",
        field("name", $.type_identifier),
        "=",
        field("value", $._type_expression),
      ),

    _type_expression: ($) =>
      choice(
        $.adt_type,
        $.record_type,
        $.tuple_type,
        $.primitive_type,
        $.type_identifier
      ),

    primitive_type: ($) => choice("number", "string", "boolean"),

    type_identifier: ($) => $._upper_identifier,

    _expression: ($) => choice(
      $._primary_expression,
      $.binary_expression
    ),

    _primary_expression: ($) =>
      choice(
        $.number,
        $.string_literal,
        $.identifier,
        $.function_expression
      ),

    function_expression: ($) => seq(
      '(',
      field('parameters', optional($.parameter_list)),
      ')',
      '=>',
      field('body', $._expression)
    ),

    parameter_list: ($) => commaSep1($.identifier),

    binary_expression: ($) => prec.left(1,
      seq(
        field('left', $._expression),
        '+',
        field('right', $._expression)
      )
    ),

    identifier: ($) => choice($._lower_identifier, $._upper_identifier),

    _lower_identifier: ($) => /[a-z][a-zA-Z0-9_]*/,
    _upper_identifier: ($) => /[A-Z][a-zA-Z0-9_]*/,

    string_literal: ($) => /"[^"]*"/,

    number: ($) => /\d+/,

    comment: ($) =>
      token(
        choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
      ),

    tuple_type: ($) =>
      seq(
        "[",
        field("fields", commaSep1($._type_expression)),
        optional(","),
        "]",
      ),

    record_type: ($) =>
      seq("{", field("fields", commaSep1($.record_field)), optional(","), "}"),

    record_field: ($) =>
      seq(field("name", $.identifier), ":", field("type", $._type_expression)),

    adt_type: ($) => prec.left(1, seq(
      optional('|'),
      field('options', seq(
        $.adt_option,
        repeat(seq('|', $.adt_option))
      ))
    )),

    adt_option: ($) =>
      choice(
        $.type_identifier,
        seq($.type_identifier, "(", field("type", $.primitive_type), ")"),
        seq($.type_identifier, "(", field("fields", $.adt_fields), ")"),
      ),

    adt_fields: ($) =>
      seq("{", field("fields", commaSep1($.adt_field)), optional(","), "}"),

    adt_field: ($) =>
      seq(
        field("name", $.identifier),
        ":",
        field("type", choice($.primitive_type, $.type_identifier)),
      ),
  },
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}

function sep1(separator, rule) {
  return seq(rule, repeat(seq(separator, rule)));
}
