# PDF Match

Convert images to PDFs with [Tesseract][1], extract PDF text with
[pdftotext][2] and execute commands depending on the content. The purpose is to
scan paperwork, generate a PDF with text overlay and apply a set of rules to
rename and move the PDF.

## Usage

The `pdfmatch` command is used like this:

```
pdfmatch [options] source.pdf
pdfmatch [options] source.jpeg target.pdf

  Options:
    --config  Use the given config file
     --debug  Don't create the PDF or execute commands, but print the text
          -l  Use the given language(s), overrides the configured "lang"
```

If no config file is specified, `pdfmatch` will look for a file named
`pdfmatch.json` in the current directory.

The config file can specify the language(s) to use and a set of rules to apply.
After the first match, the associated command is executed and processing is
stopped.

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
  }]
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

The `command` can contain variables in the form `${...}` where `...` is a
JavaScript expression with access to the matched properties. After successful
substitution, the command is written to the console and executed using
`child_process.execSync(command)`.

These special properties can be accessed in commands:

- `file`: The PDF file

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
