function FmtString(text: string) {
  let index = 0;

  function go(step?: number) {
    if (step === void 0) {
      step = 1;
    }
    index += step;
  }

  function insert(str: string) {
    text = text.slice(0, index + 1) + str + text.slice(index + 1);
    return {
      step: function () {
        go(str.length);
      }
    };
  }

  function del(count?: number) {
    if (count === void 0) {
      count = 1;
    }
    text = text.slice(0, index + 1) + text.slice(index + count + 1);
  }

  function ch(step?: number) {
    if (step === void 0) {
      step = 0;
    }
    return text[index + step];
  }

  return {
    go: go, insert: insert, del: del, ch: ch,
    get text() {
      return text;
    },
    get ended() {
      return index >= text.length - 1;
    }
  };
}

function format(text: string) {
  const str = FmtString(text
    .replace(/\s+/g, ' ')
    .replace(/\s?:\s?/g, ': ')
    .replace(/\s?,\s?/g, ', ')
    .replace(/\s+{\s+/g, '{')
    .replace(/\s+}\s+/g, '}')
    .replace(/\r/g, '') + '\n');
  let tabs = 0;
  const getTabs = function () {
    let buffer = '';
    for (let i = 0; i < tabs; i++)
      buffer += '\t';
    return buffer;
  };
  const isSpace = function (ch: string) {
    return /^\s$/.test(ch);
  };
  while (!str.ended) {
    switch (str.ch()) {
      case '#':
        if (str.ch(1) == ' ')
          str.go();
        else
          str.insert(' ').step();
        while (isSpace(str.ch(1)))
          str.del();
        while (str.ch(1) != '\n')
          str.go();
        break;
      case '{':
        tabs += 1;
        if (str.ch(-1) != ' ') {
          str.go(-1);
          str.insert(' ').step();
          str.go();
        }
        str.insert('\n' + getTabs()).step()
        break;
      case '}':
        tabs -= 1;
        str.go(-1)
        str.insert('\t'.repeat(tabs >= 0 ? tabs : 0))
        str.insert('\n')
        str.go(tabs >= 0 ? tabs + 2 : 2)
        break;
      case ':':
      case ',':
        if (str.ch(1) != ' ')
          str.insert(' ').step();
        break;
      case '\n':
        if (str.ch(1) != '\n') {
          str.insert(getTabs()).step();
          while (isSpace(str.ch(1)))
            str.del();
        }
        break;
      default:
        break;
    }
    str.go();
  }
  return str.text.trim();
}

export { format };
