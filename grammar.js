module.exports = grammar({
  name: "chicory",
  extras: ($) => [/\s/, $.comment],

  conflicts: ($) => [
    [$._type_expression, $.adt_option],
    [$.adt_option],  // Allow ambiguity in ADT option parsing
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
      $.if_expression,
      $.match_expression,
      $.jsx_element
    ),

    _primary_expression: ($) =>
      choice(
        $.number,
        $.string_literal,
        $.identifier,
        $.function_expression,
        seq('(', $._expression, ')')
      ),

    function_expression: ($) => seq(
      '(',
      optional($.parameter_list),
      ')',
      '=>',
      $._expression
    ),

    call_expression: ($) => prec.left(3, seq(  // Higher precedence than binary_expression
      field('function', $._expression),
      '(',
      optional(commaSep1($._expression)),
      ')'
    )),

    parameter_list: ($) => prec.right(2,  // Higher precedence than _primary_expression
      commaSep1($.identifier)
    ),

    binary_expression: ($) => {
      const operators = ['>', '<', '+', '*']
      const table = operators.map(operator => prec.left(1,  // Lower precedence than call_expression
        seq(
          field('left', choice($._expression, $.string_literal)),
          operator,
          field('right', choice($._expression, $.string_literal))
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

    match_expression: ($) => seq(
      'match',
      '(',
      field('value', $._expression),
      ')',
      '{',
      optional(seq(
        $.match_arm,
        repeat(seq(',', $.match_arm)),
        optional(',')
      )),
      '}'
    ),

    match_arm: ($) => seq(
      field('pattern', $.match_pattern),
      '=>',
      field('body', $._expression)
    ),

    match_pattern: ($) => choice(
      $.wildcard,
      $.literal,          // LiteralMatchPattern
      $.identifier,       // BareAdtMatchPattern
      seq(                // AdtWithParamMatchPattern
        $.identifier,
        '(',
        $.identifier,
        ')'
      ),
      seq(                // AdtWithLiteralMatchPattern
        $.identifier,
        '(',
        $.literal,
        ')'
      )
    ),

    wildcard: ($) => '_',

    literal: ($) => choice(
      $.number,
      $.string_literal,
      'true',
      'false'
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

    jsx_element: ($) => choice(
      seq(
        $.jsx_opening_element,
        repeat(choice(
          $.jsx_element,
          $.jsx_expression,
          $.jsx_text
        )),
        $.jsx_closing_element
      ),
      $.jsx_self_closing_element
    ),

    jsx_opening_element: ($) => seq(
      '<',
      field('name', $.identifier),
      repeat($.jsx_attribute),
      '>'
    ),

    jsx_closing_element: ($) => seq(
      '</',
      field('name', $.identifier),
      '>'
    ),

    jsx_self_closing_element: ($) => seq(
      '<',
      field('name', $.identifier),
      repeat($.jsx_attribute),
      '/>'
    ),

    jsx_attribute: ($) => seq(
      $.identifier,
      '=',
      choice(
        $.string_literal,
        $.jsx_expression
      )
    ),

    jsx_expression: ($) => seq(
      '{',
      $._expression,
      '}'
    ),

    jsx_text: ($) => token(prec(-1, /[^<>{}\s][^<>{}]*/)),

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
