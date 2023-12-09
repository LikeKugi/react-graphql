function FmtString(text: string) {
  let index = 0;
  function go(step?: number) {
    if (step === void 0) { step = 1; }
    index += step;
  }
  function insert(str: string) {
    text = text.substr(0, index + 1) + str + text.substr(index + 1);
    return {
      step: function () {
        go(str.length);
      }
    };
  }
  function del(count?: number) {
    if (count === void 0) { count = 1; }
    text = text.substr(0, index + 1) + text.substr(index + count + 1);
  }
  function ch(step?: number) {
    if (step === void 0) { step = 0; }
    return text[index + step];
  }
  return {
    go: go, insert: insert, del: del, ch: ch,
    get text() {
      return text;
    },
    get ended() {
      return index == text.length - 1;
    }
  };
}

function format(text: string) {
  const str = FmtString(text.replace(/\r/g, '') + '\n');
  let tabs = 0;
  const getTabs = function () {
    let buffer = '';
    for (let i = 0; i < tabs; i++)
      buffer += '\t';
    return buffer;
  };
  const isSpace = function (ch: string) { return /^\s$/.test(ch); };
  while (!str.ended) {
    if (str.ch() == '#') {
      if (str.ch(1) == ' ')
        str.go();
      else
        str.insert(' ').step();
      while (isSpace(str.ch(1)))
        str.del();
      while (str.ch(1) != '\n')
        str.go();
    }
    else if (str.ch() == '{') {
      tabs++;
      if (str.ch(-1) != ' ') {
        str.go(-1);
        str.insert(' ').step();
        str.go();
      }
      while (str.ch(1) != '\n' && isSpace(str.ch(1)))
        str.del();
      if (str.ch(1) != '\n')
        str.insert(' ').step();
    }
    else if (str.ch() == '}') {
      if (str.ch(1) != '}')
        tabs--;
      if (str.ch(-1) == '\t') {
        str.go(-2);
        str.del();
        str.go();
      }
      while (str.ch(1) != '\n' && isSpace(str.ch(1)))
        str.del();
    }
    else if (str.ch() == ':' || str.ch() == ',') {
      if (str.ch(1) != ' ')
        str.insert(' ').step();
    }
    else if (str.ch() == '\n') {
      if (str.ch(1) != '\n') {
        str.insert(getTabs()).step();
        while (isSpace(str.ch(1)))
          str.del();
      }
    }
    str.go();
  }
  return str.text.trim();
}
export {format};
