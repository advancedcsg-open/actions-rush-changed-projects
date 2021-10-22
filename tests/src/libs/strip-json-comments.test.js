const stripJsonComments = require('../../../src/libs/strip-json-comments')

describe('strip json comments', () => {
  afterAll(async () => {
    jest.resetModules() // Most important - it clears the cache
  })

  it('invalid type error', async () => {
    expect(() => stripJsonComments({ test: '' })).toThrow(/Expected argument `jsonString` to be a `string`, got/)
  })

  it('replace comments with whitespace', async () => {
    expect(stripJsonComments('//comment\n{"a":"b"}')).toEqual('         \n{"a":"b"}')
    expect(stripJsonComments('/*//comment*/{"a":"b"}')).toEqual('             {"a":"b"}')
    expect(stripJsonComments('{"a":"b"//comment\n}')).toEqual('{"a":"b"         \n}')
    expect(stripJsonComments('{"a":"b"/*comment*/}')).toEqual('{"a":"b"           }')
    expect(stripJsonComments('{"a"/*\n\n\ncomment\r\n*/:"b"}')).toEqual('{"a"  \n\n\n       \r\n  :"b"}')
    expect(stripJsonComments('/*!\n * comment\n */\n{"a":"b"}')).toEqual('   \n          \n   \n{"a":"b"}')
    expect(stripJsonComments('{/*comment*/"a":"b"}')).toEqual('{           "a":"b"}')
  })

  it('remove comments', async () => {
    const options = { whitespace: false }
    expect(stripJsonComments('//comment\n{"a":"b"}', options)).toEqual('\n{"a":"b"}')
    expect(stripJsonComments('/*//comment*/{"a":"b"}', options)).toEqual('{"a":"b"}')
    expect(stripJsonComments('{"a":"b"//comment\n}', options)).toEqual('{"a":"b"\n}')
    expect(stripJsonComments('{"a":"b"/*comment*/}', options)).toEqual('{"a":"b"}')
    expect(stripJsonComments('{"a"/*\n\n\ncomment\r\n*/:"b"}', options)).toEqual('{"a":"b"}')
    expect(stripJsonComments('/*!\n * comment\n */\n{"a":"b"}', options)).toEqual('\n{"a":"b"}')
    expect(stripJsonComments('{/*comment*/"a":"b"}', options)).toEqual('{"a":"b"}')
  })

  it('doesn\'t strip comments inside strings', async () => {
    expect(stripJsonComments('{"a":"b//c"}')).toEqual('{"a":"b//c"}')
    expect(stripJsonComments('{"a":"b/*c*/"}')).toEqual('{"a":"b/*c*/"}')
    expect(stripJsonComments('{"/*a":"b"}')).toEqual('{"/*a":"b"}')
    expect(stripJsonComments('{"\\"/*a":"b"}')).toEqual('{"\\"/*a":"b"}')
  })

  it('consider escaped slashes when checking for escaped string quote', async () => {
    expect(stripJsonComments('{"\\\\":"https://foobar.com"}')).toEqual('{"\\\\":"https://foobar.com"}')
    expect(stripJsonComments('{"foo\\"":"https://foobar.com"}')).toEqual('{"foo\\"":"https://foobar.com"}')
  })

  it('line endings - no comments', async () => {
    expect(stripJsonComments('{"a":"b"\n}')).toEqual('{"a":"b"\n}')
    expect(stripJsonComments('{"a":"b"\r\n}')).toEqual('{"a":"b"\r\n}')
  })

  it('line endings - single line comment', async () => {
    expect(stripJsonComments('{"a":"b"//c\n}')).toEqual('{"a":"b"   \n}')
    expect(stripJsonComments('{"a":"b"//c\r\n}')).toEqual('{"a":"b"   \r\n}')
  })

  it('line endings - single line block comment', async () => {
    expect(stripJsonComments('{"a":"b"/*c*/\n}')).toEqual('{"a":"b"     \n}')
    expect(stripJsonComments('{"a":"b"/*c*/\r\n}')).toEqual('{"a":"b"     \r\n}')
  })

  it('line endings - multi line block comment', async () => {
    expect(stripJsonComments('{"a":"b",/*c\nc2*/"x":"y"\n}')).toEqual('{"a":"b",   \n    "x":"y"\n}')
    expect(stripJsonComments('{"a":"b",/*c\r\nc2*/"x":"y"\r\n}')).toEqual('{"a":"b",   \r\n    "x":"y"\r\n}')
  })

  it('line endings - works at EOF', async () => {
    const options = { whitespace: false }
    expect(stripJsonComments('{\r\n\t"a":"b"\r\n} //EOF')).toEqual('{\r\n\t"a":"b"\r\n}      ')
    expect(stripJsonComments('{\r\n\t"a":"b"\r\n} //EOF', options)).toEqual('{\r\n\t"a":"b"\r\n} ')
  })

  it('handles weird escaping', async () => {
    expect(stripJsonComments(String.raw`{"x":"x \"sed -e \\\"s/^.\\\\{46\\\\}T//\\\" -e \\\"s/#033/\\\\x1b/g\\\"\""}`)).toEqual(String.raw`{"x":"x \"sed -e \\\"s/^.\\\\{46\\\\}T//\\\" -e \\\"s/#033/\\\\x1b/g\\\"\""}`)
  })
})
