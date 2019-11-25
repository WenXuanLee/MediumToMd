const reconvertUnicode = require("./util");
const fs = require('fs');
const path = require('path');

class MarkdownTransformer {
  constructor($) {
    this.$ = $;
  }

  getArticleTitle() {
    return this.$('meta[property="og:title"]')[0].attribs.content;
  }

  getArticleDate() {
    let result = "";
    const month = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12"
    };
    const isThisYear = dateArray => dateArray.length === 2;
    // if not this year would be Aug 1, 2019, trim the comma
    const date = this.$('span div a[rel="noopener"]')
      .eq(1)
      .text()
      .replace(",", "");
    const dateArray = date.split(" ");

    if (isThisYear(dateArray)) {
      const now = new Date();
      result = `${now.getFullYear()}-${month[dateArray[0]]}-${dateArray[1]}`;
    } else {
      result = `${dateArray[2]}-${month[dateArray[0]]}-${dateArray[1]}`;
    }
    return `${result}`;
  }

  getArticleTags() {
    const isTag = targetDom => {
      const href = targetDom.attr("href");
      return href && href.indexOf("tag") !== -1;
    };
    let result = "[";
    const tags = this.$("ul li a");
    const tagKeys = Object.keys(tags);
    tagKeys.forEach(key => {
      const targetDom = tags.eq(key);
      if (isTag(targetDom)) {
        result += `"${targetDom.text()}",`;
      }
    });
    result += "]";
    return result;
  }

  getMarkdownHeader() {
    let result = "+++\n";
    result += `title= "${this.getArticleTitle()}"\n`;
    result += `date= "${this.getArticleDate()}"\n`;
    result += `tags= ${this.getArticleTags()}\n`;
    result += `categories= "mediumPosts"\n`;
    result += "+++\n\n";
    return result;
  }

  // getContent and transform
  getArticleContent() {
    let result = "";
    let that = this;
    /* 
      <article>
        <div>
          <section><div><div> ... contentTags </div></div></section>
          <section><div><div> ... contentTags </div></div></section>
        </div>
      </article>
    */
   
    let articleContents = that
      .$("article div")
      .first() // Will select the first element of a cheerio object
      .contents(); //Gets the children of each element in the set of matched elements, including text and comment nodes.
    articleContents.map(function(el) {
      if (this.name === "section") {
        /* 
          children Gets the children of the first selected element.
          the selector select the fir div containing all the article section
        */
        that.$("div>div", this).children(function(el) {
          result += that.parseMedium(this);
        });
      } else if (articleContents[el].name === "hr") {
        result += "\n---\n";
      }
    });

    return result;
  }

  parseMedium(mediumDOM) {
    const isImage = content => content.indexOf('noscript') !== -1;
    const domContent = reconvertUnicode(this.$(mediumDOM).html());

    switch (mediumDOM.name) {
      case "h1":
        return `## ${domContent}\n\n`;
      case "h2":
        return `### ${domContent}\n\n`;
      case "p":
        return `${domContent}\n\n`;
      case "pre":
        return `<pre>${domContent}</pre>\n\n`;
      case "ol":
        return(`<ol>\n${domContent}\n</ol>`);
        break;
      case "ul":
        return(`<ul>\n${domContent}\n</ul>`);
        break;
      case "blockquote":
        const blockquoteStyle =
          "font-size: 26px; color: #696969; font-style:italic";
        return(
          `<span style="${blockquoteStyle}">${this.$(domContent).text()}</span>`
        );
        break;
      case 'figure': /* figure might contain gist iframe */
        if(isImage(domContent)) {
          return this.handleImage(mediumDOM);
        }
        break;
      default:
        return "";
    }
  }

  /* all image include noscript tag */
  handleImage(content) {
    const removeWidthAndHeight = image => this.$(image).removeAttr('height').removeAttr('width');
    const image = this.$(content).find('noscript').html();
    return `${removeWidthAndHeight(image)}<br/>`;
  }
  
  // set path as parameter which default file parent folder
  outputResult(targetPath = __dirname) {
    let fileName= this.getArticleTitle()
    let output = this.getMarkdownHeader() + this.getArticleContent()

    fs.writeFile(`${targetPath}/${fileName}.md`, output, (err) => {
      if(err) {
        console.log(err)
      } else {
        console.log('create success')
      }
    });
  }
}

module.exports = MarkdownTransformer;
