class Markdown {
  constructor($) {
    this.$ = $;
  }

  getArticleTitle() {
    return this.$('meta[property="og:title"]')[0].attribs.content
  }

  getArticleDate() {
    let result = '';
    const month = { 'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'};
    const isThisYear = (dateArray) => dateArray.length === 2;
    // if not this year would be Aug 1, 2019, trim the comma
    const date = this.$('span div a[rel="noopener"]').eq(1).text().replace(',', '');
    const dateArray = date.split(' ');
    console.log(dateArray)
    if (isThisYear(dateArray)) {
      const now = new Date();
      result = `${now.getFullYear()}-${month[dateArray[0]]}-${dateArray[1]}`;
    } else {
      result = `${dateArray[2]}-${month[dateArray[0]]}-${dateArray[1]}`;
    }
    return `${result}`;
  };

  getArticleTags() {
    const isTag = (targetDom) => {
      const href = targetDom.attr('href');
      return href && href.indexOf('tag') !== -1;
    };
    let result = '[';
    const tags = this.$('ul li a');
    const tagKeys = Object.keys(tags);
    tagKeys.forEach((key) => {
      const targetDom = tags.eq(key);
      if (isTag(targetDom)) {
        result += `${targetDom.text()},`;
      }
    });
    result += ']';
    return result;
  }


  // TODO 
  // getContent and transform
  // output result to a markdown file in markdown folder
  
  showBody() {
    let title = this.getArticleTitle()
    let date = this.getArticleDate()
    let tag = this.getArticleTags()
    console.log(`+++\n${title}\n${date}\n${tag}\n+++`)
  }
}

module.exports = Markdown;