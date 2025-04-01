module.exports = grammar({
  name: "chicory",
  extras: ($) => [/\s/, $.comment],

  conflicts: ($) => [
    [$._type_expression, $.adt_option],
    [$.adt_option],  // Allow ambiguity in ADT option parsing
    [$._type_expression, $.generic_type, $.adt_option],  // Add conflict for generic type parsing
  ],

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $.const_declaration,
        $.let_assignment,
        $.type_definition,
        $.import_statement,
        $.export_statement,
        $._expression  // Add expressions as valid statements
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
        optional(field("type_params", $.type_parameters)),
        "=",
        field("value", $._type_expression),
      ),

    _type_expression: ($) =>
      choice(
        $.adt_type,
        $.record_type,
        $.tuple_type,
        $.primitive_type,
        $.function_type,
        $.generic_type,
        $.type_identifier
      ),

    primitive_type: ($) => choice("number", "string", "boolean", "unit"),

    type_identifier: ($) => $._upper_identifier,

    function_type: ($) => seq(
      '(',
      optional(field('params', $.parameter_list_type)),
      ')',
      '=>',
      field('return_type', $._type_expression)
    ),

    parameter_list_type: ($) => prec.dynamic(1, commaSep1(choice(
      $._type_expression,
      $.named_type_param
    ))),

    named_type_param: ($) => seq(
      field('name', $.identifier),
      ':',
      field('type', $._type_expression)
    ),

    generic_type: ($) => prec(2, seq(
      field('base_type', $.type_identifier),
      '<',
      field('type_arguments', commaSep1($._type_expression)),
      '>'
    )),

    _expression: ($) => choice(
      $._primary_expression,
      $.binary_expression,
      $.call_expression,
      $.member_expression,  // Add member expression as a valid expression
      $.index_expression,   // Add index expression as a valid expression
      $.block_expression,
      $.if_expression,
      $.match_expression,
      $.jsx_element
    ),

    _primary_expression: ($) =>
      choice(
        $.number,
        $.string_literal,
        $.boolean,
        $.identifier,
        $.function_expression,
        $.array_expression,
        $.record_expression,
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
      const operators = ['>', '<', '+', '*', '>=', '<=', '==', '!=']
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
        seq($.type_identifier, "(", field("type", choice($.primitive_type, $.type_identifier)), ")"),
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

    if_expression: ($) => prec.right(1, choice(
      // Simple if-else
      seq(
        'if',
        '(',
        field('condition', $._expression),
        ')',
        field('consequence', $._expression),
        'else',
        field('alternative', $._expression)
      ),
      // if-else-if chain (recursive pattern)
      seq(
        'if',
        '(',
        field('condition', $._expression),
        ')',
        field('consequence', $._expression),
        'else',
        field('alternative', $.if_expression)
      )
    )),

    block_expression: ($) => prec.right(1, seq(
      '{',
      optional(repeat(seq($._statement, optional('\n')))),  // Allow blocks with just statements
      '}'
    )),

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
      $.number,          // NumberLiteralMatchPattern
      $.string_literal,  // StringLiteralMatchPattern
      $.boolean,         // BooleanMatchPattern
      $.identifier,      // BareAdtMatchPattern
      seq(               // AdtWithParamMatchPattern
        $.identifier,
        '(',
        $.identifier,
        ')'
      ),
      seq(               // AdtWithLiteralMatchPattern
        $.identifier,
        '(',
        choice(
          $.number,
          $.string_literal,
          $.boolean
        ),
        ')'
      )
    ),

    wildcard: ($) => '_',

    boolean: ($) => choice(
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
      ),
      seq(
        'bind',
        field('name', $.identifier),
        'as',
        field('type', $._type_expression),
        'from',
        field('source', $.string_literal)
      ),
      seq(
        'bind',
        field('named', $.binding_import),
        'from',
        field('source', $.string_literal)
      ),
      seq(
        'bind',
        field('name', $.identifier),
        'as',
        field('type', $._type_expression),
        ',',
        field('named', $.binding_import),
        'from',
        field('source', $.string_literal)
      )
    ),

    destructuring_import: ($) => seq(
      '{',
      commaSep1($.identifier),
      '}'
    ),

    binding_import: ($) => seq(
      '{',
      commaSep1($.binding_identifier),
      '}'
    ),

    binding_identifier: ($) => seq(
      field('name', $.identifier),
      'as',
      field('type', $._type_expression)
    ),

    export_statement: ($) => seq(
      'export',
      '{',
      commaSep1($.identifier),
      '}'
    ),

    array_expression: ($) => seq(
      '[',
      optional(seq(
        $._expression,
        repeat(seq(',', $._expression)),
        optional(',')
      )),
      ']'
    ),

    record_expression: ($) => prec(2, seq(
      '{',
      optional(seq(
        $.record_field_expression,
        repeat(seq(',', $.record_field_expression)),
        optional(',')
      )),
      '}'
    )),

    record_field_expression: ($) => seq(
      field('name', $.identifier),
      ':',
      field('value', $._expression)
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

    member_expression: ($) => prec.left(3, seq(
      field('object', $._expression),
      '.',
      field('property', $.identifier)
    )),

    index_expression: ($) => prec.left(3, seq(
      field('array', $._expression),
      '[',
      field('index', $._expression),
      ']'
    )),

    type_parameters: ($) => prec(2, seq(
      '<',
      commaSep1($.type_identifier),
      '>'
    )),
  },
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}
