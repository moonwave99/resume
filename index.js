const fs = require('fs');
const marked = require('marked');
const cheerio = require('cheerio');
const style = fs.readFileSync('./style.css', 'utf8');
const data = {
  header: marked(fs.readFileSync('./header.md', 'utf8')),
  body: marked(fs.readFileSync('./body.md', 'utf8'))
};

function process(html, section) {
  const $ = cheerio.load(html);
  $('h1').addClass('f1 lh-title fw9 mb3 mt0 pt3 light-blue');
  $('h2').addClass('f2 lh-title black');
  $('h3').addClass('f3 mid-gray lh-title');
  $('h3').each((i, h3) => {
    const $h3 = $(h3);
    const $date = $h3.next('p');
    $date.replaceWith(
      (i, date) => `<time class="f6 ttu tracked gray">${$(date).html()}</time>`
    );
    $date.next().addClass('f5 lh-copy mt0-ns');
  });

  $('a').addClass('link underline-hover').attr('target', '_blank');
  if (section === 'header') {
    $('p').addClass('f3 lh-copy');
    $('a').addClass('light-blue');
  } else {
    $('p').addClass('f5 lh-copy');
    $('a').addClass('blue');
  }

  $('ul').addClass('lh-copy');

  return $.html();
}

const site = {
  title: 'Diego Caponera - Full Stack Web Developer',
  footer: '2020 <a class="link blue underline-hover" href="https://www.diegocaponera.com">Diego Caponera</a>.'
};

const output = `
<!DOCTYPE html>
<html>

<head>
  <title>${site.title}</title>
	<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Resume of Diego Caponera, full-stack web developer">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <meta name="author" content="Diego Caponera">
  <link rel="stylesheet" href="https://unpkg.com/tachyons@4/css/tachyons.min.css">
  <style>${style}</style>
</head>

<body class="w-100 sans-serif bg-white">
	<main class="bt b--black-10 black-70 bg-white">
    <header class="pa3 pa5-ns white bg-dark-blue">
      <div class="mw8">
        ${process(data.header, 'header')}
      </div>
    </header>
    <section class="pa3 pa5-ns mw8">
      ${process(data.body, 'body')}
    </section>
    <footer class="pa3 pa5-ns">
      <p class="f5 lh-copy b">${site.footer}</p>
    </footer>
  </main>
</body>
</html>
`;

fs.writeFileSync('./public/resume.html', output);
