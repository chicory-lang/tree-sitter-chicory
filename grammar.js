module.exports = grammar({
  name: "chicory",
  extras: ($) => [/\s/, $.comment],

  conflicts: ($) => [
    [$._type_expression, $.adt_option],
    [$.adt_option]  // Allow ambiguity in ADT option parsing
  ],

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $.const_declaration,
        $.let_assignment,
        $.type_definition,
        $.import_statement,
        $.export_statement
      ),

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
      $.binary_expression,
      $.call_expression,
      $.block_expression,
      $.if_expression
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

    call_expression: ($) => prec(2, seq(
      field('function', $.identifier),
      '(',
      field('arguments', optional(commaSep1($._expression))),
      ')'
    )),

    parameter_list: ($) => commaSep1($.identifier),

    binary_expression: ($) => {
      const operators = ['>', '<', '+', '*']
      const table = operators.map(operator => prec.left(
        operator === '*' ? 2 : 1,  // Higher precedence for multiplication
        seq(
          field('left', $._expression),
          operator,
          field('right', $._expression)
        )
      ))
      return choice(...table)
    },

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

    if_expression: ($) => seq(
      'if',
      '(',
      field('condition', $._expression),
      ')',
      field('consequence', $._expression),
      'else',
      field('alternative', $._expression)
    ),

    block_expression: ($) => seq(
      '{',
      optional(seq(
        repeat(seq($._statement, optional('\n'))),
        $._expression
      )),
      '}'
    ),

    import_statement: ($) => choice(
      seq(
        'import',
        field('default', $.identifier),
        'from',
        field('source', $.string_literal)
      ),
      seq(
        'import',
        field('named', $.destructuring_import),
        'from',
        field('source', $.string_literal)
      ),
      seq(
        'import',
        field('default', $.identifier),
        ',',
        field('named', $.destructuring_import),
        'from',
        field('source', $.string_literal)
      )
    ),

    destructuring_import: ($) => seq(
      '{',
      commaSep1($.identifier),
      '}'
    ),

    export_statement: ($) => seq(
      'export',
      '{',
      commaSep1($.identifier),
      '}'
    ),
  },
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}

function sep1(separator, rule) {
  return seq(rule, repeat(seq(separator, rule)));
}
