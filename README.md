# PDF Match

Convert images to PDFs with [Tesseract][1], extract PDF text with
[pdftotext][2] and execute commands depending on the content. The purpose is to
scan paperwork, generate a PDF with text overlay and apply a set of rules to
rename and move the PDF.

## Usage

The `pdfmatch` command is used like this:

```
pdfmatch [options] source.{pdf,jpeg,tif,...} [target.pdf]

  Options:
    --config  Use the given config file
     --debug  Don't create the PDF or execute commands, but print the text
          -l  Use the given language(s), overrides the configured "lang"
```

If no config file is specified, `pdfmatch` will look for a file named
`pdfmatch.json` in the current directory.

If the source file is a PDF, the text is extracted with `pdftotext` and the
configured rules are applied.

If the source file is not a PDF, it is expected to be an image and is converted
to a PDF with searchable text using `tesseract`. If no target file is given,
the base name of the image is used for the PDF. In a second step, the text is
extracted with `pdftotext` and the configured rules are applied.

The config file can specify the language(s) to use with `tesseract` and a set
of rules to apply. After the first match, the associated command is executed
and processing is stopped. If no match was found the `no-match` command is
executed.

Here is an example:

```json
{
  "lang": "deu+eng",
  "rules": [{
    "matches": [{
      "invoiceDate": "Invoive Date: ${DATE}"
    }, {
      "invoiceDate": "Ausstellungsdatum: ${DATE}"
    }],
    "command": "mv ${file} ${invoiceDate.format('YYYY-MM-DD')}\\ invoice.pdf"
  }],
  "no-match": "mv ${file} ${now.format('YYYY-MM-DD_HHmmss')}.pdf"
}
```

The config properties are:

- `lang`: The language(s) to pass to Tesseract
- `rules`: An array of rules to run, where each rule is an object with these
  properties:
    - `match`: A single match object or an array of match objects, passed to
      [text-match][3]
    - `command`: The command to execute, after substituting any JavaScript
      expressions
- `no-match`: A default command to execute if no matching rule was found

The `command` can contain variables in the form `${...}` where `...` is a
JavaScript expression with access to the matched properties. After successful
substitution, the command is written to the console and executed using
`child_process.execSync(command)`.

These special properties can be accessed in commands:

- `file`: The PDF file
- `now`: The current date as a [moment][4] object

## Install

Installing Tesseract with brew:

```bash
$ brew install tesseract --with-all-languages
```

Installing `pdftotext` (or download from
<http://www.foolabs.com/xpdf/download.html>):

```bash
$ brew install Caskroom/cask/pdftotext
```

Installing this tool:

```bash
$ npm install pdfmatch -g
```

## License

MIT

[1]: https://github.com/tesseract-ocr/tesseract
[2]: http://www.foolabs.com/xpdf/home.html
[3]: https://github.com/mantoni/text-match.js
[4]: http://momentjs.com
